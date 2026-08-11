Technical Specification: Module 4 — AI-Powered LMS Engine

1. Executive System Specification & Domain Architecture

The LMS Engine serves as a strategic cornerstone within the BusinessHub AI ecosystem, acting as the primary mechanism for transforming raw corporate knowledge and documentation into measurable human capital. By integrating directly with the platform’s centralized AI Gateway and Multi-Tenant framework, the LMS Module allows organizations to automate the creation of instructional content and verify workforce competency through AI-generated assessments. This ensures that institutional knowledge is not merely stored but actively validated. For enterprise clients in the Indian market, this module is engineered to support GST-compliant billing metadata and INR-denominated credit tracking, ensuring local financial regulatory alignment.

1.1 Domain Boundaries and Clean Architecture

The LMS module is implemented within the app/domain/lms structure, adhering to a strict Clean Architecture pattern where dependencies flow inward:

* API Controllers (/api): Thin entry points responsible for request parsing, dependency injection, and returning standard System JSON Response Envelopes.
* Application Services (/services): Orchestrators of business workflows, such as enrollment lifecycle management and triggering the asynchronous AI quiz pipeline.
* Domain Logic (/models): The core business rules, including the enforcement of BR-LMS-001 (the 80% passing threshold).
* Repositories (/repositories): Exclusive handlers of asynchronous SQLAlchemy 2.0 queries, ensuring all database interactions are isolated and properly scoped by tenant ID.

1.2 Multi-Tenant Isolation Strategy

Data security is enforced through mandatory row-level isolation. Every table in the LMS domain includes an organization_id UUID column. The "So What?": This prevents cross-tenant data leakage and ensures that learner progress, proprietary courseware, and assessment results remain strictly siloed. By enforcing this at the repository level via the X-Organization-Id context, we meet the high regulatory standards required by Indian enterprise clients while maintaining the operational efficiency of a modular monolith.

1.3 RBAC & Permission Matrix

Access is governed by the system-wide RBAC engine, with LMS-specific permissions linked to the ai:execute scope for generative features.

Role	Permission	Description
Tenant Owner / Admin	lms:write, lms:read, ai:execute	Full lifecycle management and administrative oversight.
LMS Domain Manager	lms:write, lms:read, ai:execute	Create content, manage quizzes, and generate AI assessments.
Domain Member	lms:read, lms:execute	View courses, log progress, and attempt quizzes.

1.4 Integrated Service Dependencies

* AiGatewayService: Provides the interface for RAG-based quiz generation using versioned prompt templates.
* BillingService: Manages credit-metered operations, specifically atomic consumption of bonus_ai_credits and base credits for AI generation tasks.

2. Alembic Database Schema & SQLAlchemy 2.0 Mappings

A normalized relational schema is critical for tracking learner journeys and ensuring data integrity across multi-step interactions.

2.1 Core Content Entities

class LMSBase(Base):
    __abstract__ = True
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
    deleted_at: Mapped[Optional[datetime]] = mapped_column(default=None)

class Course(LMSBase):
    __tablename__ = "courses"
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text)
    is_published: Mapped[bool] = mapped_column(default=False)
    currency: Mapped[str] = mapped_column(String(3), default="INR")  # Indian Market Compliance
    gst_compliant: Mapped[bool] = mapped_column(default=True)

class CourseModule(LMSBase):
    __tablename__ = "course_modules"
    course_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(255))
    order_index: Mapped[int] = mapped_column(default=0)

class Lesson(LMSBase):
    __tablename__ = "lessons"
    module_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("course_modules.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(255))
    content_markdown: Mapped[str] = mapped_column(Text)


2.2 Learner Progress & Enrollment Entities

class CourseEnrollment(LMSBase):
    __tablename__ = "course_enrollments"
    user_id: Mapped[uuid.UUID] = mapped_column(index=True)
    course_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("courses.id"))
    status: Mapped[str] = mapped_column(String(50), default="active") # active, completed

class LessonProgress(LMSBase):
    __tablename__ = "lesson_progress"
    user_id: Mapped[uuid.UUID] = mapped_column(index=True)
    lesson_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("lessons.id"))
    is_completed: Mapped[bool] = mapped_column(default=False)


Partial Unique Index (DDL):

CREATE UNIQUE INDEX idx_unique_active_enrollment 
ON course_enrollments (organization_id, user_id, course_id) 
WHERE deleted_at IS NULL;


2.3 Assessment & Quiz Engine Entities

The quiz engine records the structure and results of assessments. All tables include the standard audit columns from LMSBase.

* quizzes: Linked to a lesson_id.
* quiz_questions: Stores the AI-generated prompts.
* quiz_attempts: Tracks the user, total score, and the passed flag (\ge 80\%).

2.4 Database Constraints & Soft-Delete Logic

* Cascade Risk Mitigation: While ON DELETE CASCADE ensures database hygiene for deleted organizations, the Application Service must implement a "soft-lock" confirmation flow to prevent catastrophic loss of training records.
* Global Filter: All repository queries must append WHERE deleted_at IS NULL.

3. Core API Contracts & Interface Definitions

3.1 Content Authoring Endpoints

POST /api/v1/lms/courses

{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "title": "GST Compliance 101",
    "currency": "INR"
  },
  "error": null
}


3.2 Learner Experience Endpoints

POST /api/v1/lms/lessons/{id}/progress The "So What?": Progress logging triggers an automatic completion check. Per BR-LMS-001, achieving a passing grade on the associated quiz is a prerequisite for total course completion. While certificates are currently out of scope, this logic provides the necessary state for future certificate triggers.

3.3 Assessment Execution Endpoints

POST /api/v1/lms/quizzes/attempts

* Enforcement: Business rule BR-LMS-001 is validated here. If the calculated score is \ge 80\%, the attempt is marked passed.

3.4 Error Handling Catalog

Error Code	Status	Description
ERR_TENANT_001	403	Unauthorized cross-tenant access.
ERR_VALIDATION_001	422	Invalid payload or Markdown format.
ERR_BILLING_001	402	Insufficient AI Credits (Base or Bonus).

4. AI Quiz Generation Pipeline & Credit Metering

4.1 AI Prompt Contract (lms_quiz_v1)

The LLM must output exactly 5 multiple-choice questions based on lesson markdown, structured for direct database ingestion.

4.2 Asynchronous Orchestration

1. FastAPI Endpoint: Receives request, sets Redis lock ai_lock:quiz_gen:{lesson_id} (120s TTL).
2. Celery Worker: Task lms.tasks.generate_quiz_v1 calls the AI Gateway.
3. Retry Policy: Exponential backoff (2^n) for up to 3 retries on parsing errors.

4.3 Atomic Pre-flight Credit Deduction

To prevent race conditions (TOCTOU) and ensure billing integrity:

UPDATE organizations 
SET ai_credits_used = ai_credits_used + 1 
WHERE id = :org_id 
AND (ai_credits_used + 1) <= (subscription_limit + bonus_ai_credits)
RETURNING id;


If 0 rows are returned, the system throws HTTP 402 (ERR_BILLING_001).

4.4 Integration Flow Evaluation

Async generation is mandatory. This decouples the long-running LLM call from the API request-response cycle, maintaining the required < 200\text{ ms} API response time (NFR).

5. Modular Implementation Roadmap (GitHub Issues)

5.1 Issue 1: LMS Relational Schema & Alembic Migrations

Implement all SQLAlchemy 2.0 models with audit columns and generate migration scripts.

5.2 Issue 2: Course & Content Authoring API Service

Develop CRUD services for courses/modules with draft/publish lifecycle states.

5.3 Issue 3: Learner Enrollment & Progress Tracking

Implement course_enrollments logic and lesson progress logging with tenant isolation.

5.4 Issue 4: AI Quiz Generator Service & Credit Gates

Integrate lms.tasks.generate_quiz_v1 with the AI Gateway and implement the atomic SQL credit check.

5.5 Issue 5: Angular Standalone Learner & Authoring Components

Build the frontend using Angular 20+, Signals, and OnPush detection for the LMS dashboard.

Summary Statement This specification ensures complete alignment with BusinessHub AI's enterprise standards, specifically focusing on Indian market compliance, RS256 security, and robust asynchronous AI orchestration. Out-of-scope features like physical certificates and gamification are deferred, but the underlying domain logic for completion (BR-LMS-001) is strictly enforced.
