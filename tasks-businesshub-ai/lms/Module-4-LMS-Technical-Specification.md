# Technical Specification: Module 4 — AI-Powered LMS Engine

## 1. Executive System Specification & Domain Architecture

The **LMS Engine** serves as a strategic cornerstone within the BusinessHub AI ecosystem, acting as the primary mechanism for transforming raw corporate knowledge and documentation into measurable human capital.

By integrating directly with the platform’s centralized **AI Gateway** and **Multi-Tenant framework**, the LMS Module allows organizations to automate the creation of instructional content and verify workforce competency through AI-generated assessments.

This ensures that institutional knowledge is not merely stored but actively validated.

For enterprise clients in the Indian market, this module is engineered to support **GST-compliant billing metadata** and **INR-denominated credit tracking**, ensuring local financial regulatory alignment.

---

### 1.1 Domain Boundaries and Clean Architecture

The LMS module is implemented within:

```text
app/domain/lms
```

It adheres to a strict **Clean Architecture** pattern where dependencies flow inward.

| Layer                | Location        | Responsibility                                                                                                                           |
| -------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| API Controllers      | `/api`          | Thin entry points responsible for request parsing, dependency injection, and returning standard System JSON Response Envelopes.          |
| Application Services | `/services`     | Orchestrate business workflows such as enrollment lifecycle management and triggering the asynchronous AI quiz pipeline.                 |
| Domain Logic         | `/models`       | Contains core business rules, including enforcement of `BR-LMS-001` (the 80% passing threshold).                                         |
| Repositories         | `/repositories` | Exclusive handlers of asynchronous SQLAlchemy 2.0 queries, ensuring database interactions are isolated and properly scoped by tenant ID. |

---

### 1.2 Multi-Tenant Isolation Strategy

Data security is enforced through mandatory row-level isolation.

Every table in the LMS domain includes:

```text
organization_id UUID
```

#### Why this matters

This prevents cross-tenant data leakage and ensures that:

* Learner progress
* Proprietary courseware
* Assessment results

remain strictly siloed between organizations.

Tenant isolation is enforced at the repository level through the:

```text
X-Organization-Id
```

context.

This approach meets the high regulatory standards required by Indian enterprise clients while maintaining the operational efficiency of the **Modular Monolith** architecture.

---

### 1.3 RBAC & Permission Matrix

Access is governed by the system-wide RBAC engine, with LMS-specific permissions linked to the `ai:execute` scope for generative features.

| Role                 | Permissions                           | Description                                                  |
| -------------------- | ------------------------------------- | ------------------------------------------------------------ |
| Tenant Owner / Admin | `lms:write`, `lms:read`, `ai:execute` | Full lifecycle management and administrative oversight.      |
| LMS Domain Manager   | `lms:write`, `lms:read`, `ai:execute` | Create content, manage quizzes, and generate AI assessments. |
| Domain Member        | `lms:read`, `lms:execute`             | View courses, log progress, and attempt quizzes.             |

---

### 1.4 Integrated Service Dependencies

The LMS integrates with existing BusinessHub platform services.

#### `AiGatewayService`

Provides the interface for RAG-based quiz generation using versioned prompt templates.

#### `BillingService`

Manages credit-metered operations, specifically atomic consumption of:

* `bonus_ai_credits`
* Base AI credits

for AI generation tasks.

---

# 2. Alembic Database Schema & SQLAlchemy 2.0 Mappings

A normalized relational schema is critical for tracking learner journeys and ensuring data integrity across multi-step interactions.

---

## 2.1 Core Content Entities

### LMS Base Model

All LMS entities inherit the common audit and tenant-isolation fields from `LMSBase`.

```python
class LMSBase(Base):
    __abstract__ = True

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    organization_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"),
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        onupdate=func.now(),
    )

    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        default=None,
    )
```

### Course

```python
class Course(LMSBase):
    __tablename__ = "courses"

    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text)
    is_published: Mapped[bool] = mapped_column(default=False)

    currency: Mapped[str] = mapped_column(
        String(3),
        default="INR",
    )

    gst_compliant: Mapped[bool] = mapped_column(
        default=True,
    )
```

### Course Module

```python
class CourseModule(LMSBase):
    __tablename__ = "course_modules"

    course_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("courses.id", ondelete="CASCADE")
    )

    title: Mapped[str] = mapped_column(
        String(255)
    )

    order_index: Mapped[int] = mapped_column(
        default=0
    )
```

### Lesson

```python
class Lesson(LMSBase):
    __tablename__ = "lessons"

    module_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("course_modules.id", ondelete="CASCADE")
    )

    title: Mapped[str] = mapped_column(
        String(255)
    )

    content_markdown: Mapped[str] = mapped_column(
        Text
    )
```

---

## 2.2 Learner Progress & Enrollment Entities

### Course Enrollment

```python
class CourseEnrollment(LMSBase):
    __tablename__ = "course_enrollments"

    user_id: Mapped[uuid.UUID] = mapped_column(
        index=True
    )

    course_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("courses.id")
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="active",
    )
    # active, completed
```

### Lesson Progress

```python
class LessonProgress(LMSBase):
    __tablename__ = "lesson_progress"

    user_id: Mapped[uuid.UUID] = mapped_column(
        index=True
    )

    lesson_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("lessons.id")
    )

    is_completed: Mapped[bool] = mapped_column(
        default=False
    )
```

### Partial Unique Index

The following partial unique index ensures that a learner cannot have multiple active enrollments for the same course within an organization:

```sql
CREATE UNIQUE INDEX idx_unique_active_enrollment
ON course_enrollments (
    organization_id,
    user_id,
    course_id
)
WHERE deleted_at IS NULL;
```

---

## 2.3 Assessment & Quiz Engine Entities

The quiz engine records both the structure and results of assessments.

All quiz-related tables include the standard audit columns inherited from `LMSBase`.

### `quizzes`

Linked to a specific:

```text
lesson_id
```

### `quiz_questions`

Stores the AI-generated quiz questions/prompts.

### `quiz_attempts`

Tracks:

* User
* Total score
* Passed flag

The passing threshold is:

```text
score >= 80%
```

as defined by:

```text
BR-LMS-001
```

---

## 2.4 Database Constraints & Soft-Delete Logic

### Cascade Risk Mitigation

While:

```sql
ON DELETE CASCADE
```

ensures database hygiene when organizations are deleted, the Application Service must implement a **soft-lock confirmation flow** to prevent catastrophic loss of training records.

### Global Soft-Delete Filter

All repository queries must append:

```sql
WHERE deleted_at IS NULL
```

to ensure soft-deleted records are excluded from normal operations.

---

# 3. Core API Contracts & Interface Definitions

## 3.1 Content Authoring Endpoints

### Create Course

```http
POST /api/v1/lms/courses
```

Example response:

```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "title": "GST Compliance 101",
    "currency": "INR"
  },
  "error": null
}
```

---

## 3.2 Learner Experience Endpoints

### Update Lesson Progress

```http
POST /api/v1/lms/lessons/{id}/progress
```

#### Business Behavior

Progress logging triggers an automatic completion check.

Per:

```text
BR-LMS-001
```

achieving a passing grade on the associated quiz is a prerequisite for total course completion.

Although certificates are currently **out of scope**, this completion state provides the necessary foundation for potential future certificate triggers.

---

## 3.3 Assessment Execution Endpoints

### Submit Quiz Attempt

```http
POST /api/v1/lms/quizzes/attempts
```

#### Enforcement

Business rule `BR-LMS-001` is validated when the attempt is submitted.

If:

```text
score >= 80%
```

the attempt is marked as:

```text
passed = true
```

Otherwise:

```text
passed = false
```

---

## 3.4 Error Handling Catalog

| Error Code           | HTTP Status | Description                              |
| -------------------- | ----------: | ---------------------------------------- |
| `ERR_TENANT_001`     |       `403` | Unauthorized cross-tenant access.        |
| `ERR_VALIDATION_001` |       `422` | Invalid payload or Markdown format.      |
| `ERR_BILLING_001`    |       `402` | Insufficient AI Credits (Base or Bonus). |

---

# 4. AI Quiz Generation Pipeline & Credit Metering

The AI Quiz Generator is the **hero feature** of the LMS Engine.

---

## 4.1 AI Prompt Contract — `lms_quiz_v1`

The LLM must output exactly:

```text
5 multiple-choice questions
```

based on the lesson Markdown content.

The response must be structured for direct database ingestion.

The generated output must contain:

* Multiple-choice questions
* Answer options
* Correct answers
* Explanations

The response must conform strictly to the defined structured JSON contract.

---

## 4.2 Asynchronous Orchestration

AI quiz generation is fully asynchronous.

### Step 1 — FastAPI Endpoint

The FastAPI endpoint receives the request and establishes a Redis lock:

```text
ai_lock:quiz_gen:{lesson_id}
```

with:

```text
TTL = 120 seconds
```

This prevents duplicate quiz-generation requests for the same lesson.

### Step 2 — Celery Worker

The Celery worker executes:

```text
lms.tasks.generate_quiz_v1
```

The task calls the centralized AI Gateway.

### Step 3 — Retry Policy

Parsing failures are retried using exponential backoff:

```text
2^n
```

for a maximum of:

```text
3 retries
```

---

## 4.3 Atomic Pre-flight Credit Deduction

To prevent race conditions and **TOCTOU (Time-of-Check to Time-of-Use)** issues, AI credit consumption must be atomic.

Example:

```sql
UPDATE organizations
SET ai_credits_used = ai_credits_used + 1
WHERE id = :org_id
  AND (
      ai_credits_used + 1
  ) <= (
      subscription_limit + bonus_ai_credits
  )
RETURNING id;
```

If zero rows are returned:

```text
HTTP 402
ERR_BILLING_001
```

is returned to indicate insufficient AI Credits.

---

## 4.4 Integration Flow Evaluation

Asynchronous generation is mandatory.

This decouples the long-running LLM call from the API request/response cycle and maintains the required:

```text
< 200 ms
```

API response time requirement defined by the NFR.

The frontend subsequently monitors the existing job-status mechanism until the quiz-generation task completes.

---

# 5. Modular Implementation Roadmap — GitHub Issues

The implementation should be divided into modular, independently manageable GitHub issues.

---

## Issue 1 — LMS Relational Schema & Alembic Migrations

### Objective

Implement the LMS relational database schema.

### Scope

* Implement SQLAlchemy 2.0 models.
* Implement common LMS audit columns.
* Implement tenant isolation fields.
* Implement Course, Module, Lesson entities.
* Implement Enrollment and Progress entities.
* Implement Quiz-related entities.
* Implement Quiz Attempts.
* Add required indexes and constraints.
* Generate Alembic migration scripts.
* Validate migration upgrade/downgrade behavior.

---

## Issue 2 — Course & Content Authoring API Service

### Objective

Implement the course authoring and content management APIs.

### Scope

* Course CRUD
* Module CRUD
* Lesson CRUD
* Course draft/publish lifecycle
* Course metadata
* Rich-text/Markdown lesson content
* External video links
* RBAC enforcement
* Tenant isolation
* Repository/service separation

---

## Issue 3 — Learner Enrollment & Progress Tracking

### Objective

Implement learner enrollment and progress tracking.

### Scope

* Course enrollment
* Enrollment lifecycle
* Lesson progress logging
* Course completion calculation
* `NOT_STARTED`
* `IN_PROGRESS`
* `COMPLETED`
* Quiz prerequisite validation
* Tenant isolation
* Learner authorization

---

## Issue 4 — AI Quiz Generator Service & Credit Gates

### Objective

Implement the AI-powered quiz generation pipeline.

### Scope

* Implement `lms_quiz_v1`
* Integrate with centralized AI Gateway
* Implement Celery task:

  ```text
  lms.tasks.generate_quiz_v1
  ```
* Implement Redis generation lock
* Implement structured JSON validation
* Implement retry policy
* Implement atomic AI credit deduction
* Handle insufficient credits with HTTP `402`
* Persist generated quizzes and questions
* Integrate with existing job-status infrastructure

---

## Issue 5 — Angular Standalone Learner & Authoring Components

### Objective

Implement the LMS frontend experience.

### Scope

* Angular standalone components
* LMS dashboard
* Course authoring UI
* Course/module/lesson management
* Learner course view
* Lesson progress UI
* Quiz execution UI
* Quiz result/feedback UI
* AI quiz generation UI
* Job-status polling
* Signals/RxJS integration
* OnPush change detection

Frontend implementation should follow the existing BusinessHub frontend architecture and conventions.

---

# 6. Architectural & Scope Constraints

The LMS implementation must remain aligned with the existing BusinessHub architecture.

### Reuse Existing Infrastructure

The LMS must reuse:

* Existing Multi-Tenancy infrastructure
* Existing RBAC system
* Existing Billing/Soft-Lock mechanisms
* Existing AI Gateway
* Existing Celery workers
* Existing asynchronous job-status pattern
* Existing repository/service architecture
* Existing API response conventions
* Existing testing and migration conventions

### No New Baseline Architecture

The LMS must **not** introduce:

* Microservices
* A separate LMS backend
* A separate AI infrastructure
* A separate billing system
* A separate tenant-isolation mechanism
* New architectural patterns that conflict with the existing BusinessHub design

The module must remain a loosely coupled component within the existing **Modular Monolith**.

---

# 7. Explicitly Out of Scope for This MVP

The following capabilities are explicitly deferred and must **not** be included in the current architecture or implementation scope:

* Certificates
* Gamification / Badges
* Discussion Boards / Forums
* SCORM Compliance
* Live Classes / Webinars
* Advanced Learning Analytics beyond basic progress tracking
* Full External Customer-Training Workflows

---

# 8. Summary

This specification provides the foundation for an **AI-Powered Learning & Enablement module** within BusinessHub AI.

The LMS integrates:

```text
Multi-Tenancy
      │
      ├── RBAC
      │
      ├── Billing / Soft-Locks
      │
      ├── AI Gateway
      │
      └── Celery
              │
              ▼
       ┌───────────────┐
       │   LMS Engine  │
       └───────────────┘
              │
       ┌──────┼───────┐
       ▼      ▼       ▼
    Courses  Quizzes  Progress
       │      │       │
       └──────┼───────┘
              ▼
       Learner Enablement
```

The module is specifically designed to support the core BusinessHub CRM through use cases such as:

* Employee onboarding
* Sales enablement
* Corporate learning
* Competency validation

The implementation maintains alignment with BusinessHub AI's enterprise standards, specifically:

* Multi-tenant security
* RBAC
* Existing platform billing controls
* AI credit metering
* Asynchronous AI orchestration
* INR/GST-related billing metadata
* Modular Monolith architecture
* Clean Architecture
* Repository/Service separation

The **80% passing threshold (`BR-LMS-001`)** is enforced as the core assessment completion rule.

Features such as physical certificates and gamification remain deferred and are **not part of the MVP**.
