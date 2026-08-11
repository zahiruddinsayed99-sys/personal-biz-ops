# Architectural Handoff: Module 4 — LMS Engine (AI-Powered Learning & Enablement)

This spec officially updates our engineering plan, **prioritising Module 4 (LMS Engine) as an AI-Powered Learning & Enablement system supporting the core CRM**, while remaining loosely coupled to accommodate future domain expansions.

The **`BusinessHub AI: Module 4 LMS Engine Technical Specification & Implementation Plan`** report has been generated and published to your **Studio** panel. This document covers our complete system boundaries, relational database structures, API contracts, AI prompt schemas, and developer-ready GitHub issues.

Below is the exhaustive, production-grade specification designed to guide **Jules / Antigravity** through a seamless local implementation.

---

## 1. Executive System Specification & Boundaries

### 1.1 Module Boundaries (`app/domain/lms`**)**

The LMS module operates as a standalone package within our modular monolith:

```
backend/app/domain/lms/
├── __init__.py
├── models.py          # SQLAlchemy 2.0 DB Models
├── schemas.py         # Pydantic v2 Ingestion/Validation DTOs
├── services.py        # Course, Progress, and Quiz Business Logic
├── repositories.py    # Async SQLAlchemy 2.0 DB Repositories
└── routes.py          # FastAPI Endpoints & Controller Logic

```

### 1.2 Component Responsibilities

- **`CourseService`**:** Manages course, module, and lesson hierarchies. Handles the transition of courses between `DRAFT` and `PUBLISHED` states.
- **`EnrollmentService`**:** Manages user enrollments and learner-specific completion progress, automatically updating status from `ENROLLED` to `COMPLETED` when all lesson nodes are logged.
- **`QuizService`**:** Orchestrates manual and AI-generated assessments, scores quiz attempts, and saves results.

### 1.3 Tenant Isolation & RBAC Security

- **Horizontal Isolation:** Every table in the schema includes a mandatory `organization_id` column. The FastAPI ASGI tenant middleware intercepts all incoming requests to extract the `X-Organization-Id` header and bind it to the thread-safe context. The repositories automatically inject `WHERE organization_id = :current_org_id` on all CRUD lookups.
- **Vertical Isolation (RBAC):** 
  - `lms:write` **(Tenant Owner, Tenant Admin, LMS Domain Manager):** Authorized to author courses, configure modules, add lessons, publish curricula, and trigger AI Quiz generation.
  - `lms:read` **(All Tenant Users / Learners):** Authorized to self-enroll, track learning progress, submit quiz answers, and view scores.

---

## 2. Detailed Alembic Database Schemas

All tables use lowercase plural `snake_case` naming conventions, UUID v4 primary keys (`DEFAULT gen_random_uuid()`), nullable `deleted_at` timestamps for soft-deletes, and timezone-aware `TIMESTAMPTZ` audit columns.

```
-- Enable PGVector if not already active
CREATE EXTENSION IF NOT EXISTS pgvector;

-- 1. COURSES TABLE
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'PUBLISHED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);
CREATE INDEX idx_courses_org_status ON courses (organization_id, status) WHERE deleted_at IS NULL;

-- 2. COURSE MODULES TABLE
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);
CREATE INDEX idx_modules_course_order ON course_modules (course_id, sort_order) WHERE deleted_at IS NULL;

-- 3. LESSONS TABLE
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content_body TEXT NOT NULL, -- Supporting Markdown content
    video_url VARCHAR(512) NULL DEFAULT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);
CREATE INDEX idx_lessons_module_order ON lessons (module_id, sort_order) WHERE deleted_at IS NULL;

-- 4. COURSE ENROLLMENTS TABLE (Junction)
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'ENROLLED', -- 'ENROLLED', 'COMPLETED'
    completed_at TIMESTAMPTZ NULL DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);
-- Partial composite unique index to enforce a single active enrollment per user per course
CREATE UNIQUE INDEX idx_unique_active_enrollment
ON course_enrollments (organization_id, user_id, course_id)
WHERE deleted_at IS NULL;

-- 5. LESSON PROGRESS TABLE
CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ NULL DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX idx_user_lesson_progress ON lesson_progress (enrollment_id, lesson_id);

-- 6. QUIZZES TABLE
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

-- 7. QUIZ QUESTIONS TABLE
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETEHere is the finalized **Technical Specification and Implementation Roadmap** for **Module 4: LMS Engine (AI-Powered Learning & Enablement)**.

The complete technical report, **`BusinessHub AI: Module 4 LMS Engine Technical Specification & Implementation Plan`** [a210bb17], has been successfully published to your Studio panel.

The following sections define our exact module boundaries, SQLAlchemy schemas, endpoint contracts, AI prompt mechanics, and independent GitHub issues to launch this track off your `develop` branch.

---

## 1. Executive System Specification

*   **Module Package Namespace:** `app/domain/lms` (Clean Architecture boundary).
*   **Component Separation:**
    *   **Repositories:** `CourseRepository`, `EnrollmentRepository`, `QuizRepository` strictly executing via Async SQLAlchemy 2.0.
    *   **Services:** `LmsService` orchestrating business rules, lesson tracking, and grading logic.
    *   **Routes:** FastAPI routes handling authorization, context unboxing, and returning our standard JSON envelope.
*   **Multi-Tenant Validation:** Every query explicitly appends `WHERE organization_id = :current_tenant_id`. Any cross-tenant resource probe (e.g. attempting to view an ID belonging to another organization) throws a clean **HTTP 404 Not Found (`ERR_NOT_FOUND_001`)** instead of a 403 to prevent ID scanning.
*   **RBAC Matrix:**
    *   `lms:write` (Tenant Owner, Tenant Admin, LMS Domain Manager): Permission to create, update, and delete courses, modules, lessons, and trigger AI quiz generation.
    *   `lms:read` (All Tenant Users): Permission to self-enroll, track progress, and submit quiz attempts.

---

## 2. Detailed Alembic Database Schemas (SQLAlchemy 2.0 Async)

All models inherit from our base multi-tenant class, using `UUID v4` primary keys, lowercase snake_case plural names, timezone-aware audit timestamps, and soft deletes (`deleted_at`) where applicable:

### Course, Module, & Lesson Schema
```python
class Course(Base):
    __tablename__ = "courses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(20), default="DRAFT", nullable=False)  # DRAFT, PUBLISHED
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class CourseModule(Base):
    __tablename__ = "course_modules"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    module_id = Column(UUID(as_uuid=True), ForeignKey("course_modules.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content_body = Column(Text, nullable=False)  # Markdown lessons
    video_url = Column(String(512), nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

```

### Enrollment, Progress, & Quiz Attempt Schema

```
class CourseEnrollment(Base):
    __tablename__ = "course_enrollments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), default="ENROLLED", nullable=False)  # ENROLLED, COMPLETED
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    # Unique constraint via Partial Index in Alembic: Unique(organization_id, user_id, course_id) WHERE deleted_at IS NULL

class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("course_enrollments.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)

class QuizAnswer(Base):
    __tablename__ = "quiz_answers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("quiz_questions.id", ondelete="CASCADE"), nullable=False)
    answer_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    score = Column(Numeric(5, 2), nullable=False)  # Percentage score (e.g., 85.50)
    passed = Column(Boolean, default=False, nullable=False)  # Enforces BR-LMS-001 (score >= 80%)
    completed_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

```

---

## 3. Core API Contracts

All responses return wrapped in our **standard system response envelope**:

### 3.1 Course Authoring API (POST /api/v1/lms/courses)

- **Requires Scope:** `lms:write`
- **Payload:** 
  ```
  {
    "title": "Closing the Deal: High-Velocity CRM",
    "description": "An enablement program mapping advanced negotiation tactics directly to pipeline opportunities."
  }

  ```
- **Response (201 Created):** 
  ```
  {
    "success": true,
    "data": {
      "id": "e6a17b9d-4034-4bc3-96cb-8456de98402a",
      "title": "Closing the Deal: High-Velocity CRM",
      "status": "DRAFT",
      "created_at": "2026-08-10T22:59:00Z"
    }
  }

  ```

### 3.2 Enrollment API (POST /api/v1/lms/enrollments)

- **Requires Scope:** `lms:read`
- **Payload:** `{"course_id": "e6a17b9d-4034-4bc3-96cb-8456de98402a"}`
- **Response (201 Created):** 
  ```
  {
    "success": true,
    "data": {
      "enrollment_id": "98cc12da-40a2-4682-892c-ef103ba67db2",
      "status": "ENROLLED"
    }
  }

  ```

### 3.3 Log Progress API (POST /api/v1/lms/lessons/{id}/progress)

- **Requires Scope:** `lms:read`
- **Response (200 OK):** 
  ```
  {
    "success": true,
    "data": {
      "lesson_id": "2da12c3f-90db-44e2-bdc4-6cda71ef9c8a",
      "is_completed": true,
      "completed_at": "2026-08-10T23:01:15Z",
      "course_completed": false
    }
  }

  ```
  *Note: If logging the final lesson progress causes all modules in the course to resolve to complete,* *`course_completed`* *automatically flags as* *`true`* *and transitions* *`course_enrollments.status`* *to* *`'COMPLETED'`**.*

### 3.4 Submit Quiz Attempt (POST /api/v1/lms/quizzes/attempts)

- **Requires Scope:** `lms:read`
- **Payload:** 
  ```
  {
    "quiz_id": "847291aa-403d-4cde-8192-3bcda1ee8c29",
    "answers": [
      { "question_id": "c1da276f-98cb-402a-9ac1-62bcdaee3a02", "selected_answer_id": "a98cc1b2-11da-4bc1-9c12-32bcda02b3cc" }
    ]
  }

  ```
- **Response (200 OK):** 
  ```
  {
    "success": true,
    "data": {
      "attempt_id": "31acbd8a-40a2-4bc3-9a3c-b2ca709121fc",
      "score": 80.00,
      "passed": true,
      "completion_rule_satisfied": true
    }
  }

  ```
  *Note: Enforces BR-LMS-001 (score >= 80% yields passed=true).*

---

## 4. AI Quiz Generation & Pre-Flight Metering

To maintain our tight cost-control measures and prevent credit fraud under load, we leverage our pre-flight billing validations and the async Celery workflow:

### 4.1 The Prompt Contract (`lms_quiz_v1`**)**

The schema enforces structured output returning exactly 5 questions with 4 logical answers:

```
{
  "name": "lms_quiz_v1",
  "strict": true,
  "schema": {
    "type": "object",
    "properties": {
      "quiz_title": { "type": "string" },
      "questions": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "question_text": { "type": "string" },
            "explanation": { "type": "string" },
            "answers": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "answer_text": { "type": "string" },
                  "is_correct": { "type": "boolean" }
                },
                "required": ["answer_text", "is_correct"],
                "additionalProperties": false
              }
            }
          },
          "required": ["question_text", "explanation", "answers"],
          "additionalProperties": false
        }
      }
    },
    "required": ["quiz_title", "questions"],
    "additionalProperties": false
  }
}

```

### 4.2 Pre-Flight Guard & Ingestion Pipeline (Celery + Redis)

1. **Request** **`POST /api/v1/lms/quizzes/generate`**:** 
   - Verify the tenant isn't in a **Soft-Lock Overage state**.
   - Execute the **Atomic SQL Check-and-Increment operation** targeting `10 AI Credits`. If the update returns zero rows (exhausted balance), abort immediately with **`ERR_BILLING_001`** **(HTTP 402 Payment Required)** prior to initiating any LLM API worker processes.
2. **Async Celery Task Dispatch:** 
   - Acquire the Redis idempotent task lock: `ai_lock:quiz_gen:{lesson_id}` with a 5-minute TTL to block rapid user spam.
   - Pass the lesson's Markdown text payload into the `AiGatewayService` using the structured `lms_quiz_v1` prompt contract.
   - Wrap model rate-limiting (`429 Too Many Requests`) with our standard exponential backoff retries.
   - Commit questions and answer matrices atomically back to Postgres.

---

## 5. Modular GitHub Issues for Jules / Antigravity

### Issue 1: LMS Relational Schema & Alembic Migrations

- **Track:** `track/9-lms-core`
- **Description:** Initialize migrations and SQLAlchemy classes for courses, course_modules, lessons, enrollments, lesson_progress, and quiz entities.
- **DoD:** `alembic upgrade head` completes cleanly; tests verify that querying active courses automatically isolates records using the requesting `organization_id` context.

### Issue 2: Course & Content Authoring Service (Draft/Publish Lifecycles)

- **Track:** `track/9-lms-core`
- **Description:** Build the endpoints supporting course, module, and lesson creation, draft saves, and public publication updates. Expose routes to pull lesson text.
- **DoD:** Authors with `lms:write` can CRUD curricula; unauthenticated and cross-tenant lookups on drafts throw `ERR_NOT_FOUND_001` (HTTP 404).

### Issue 3: Learner Enrollment, Progress Tracker & Quiz Scoring APIs

- **Track:** `track/9-lms-core`
- **Description:** Implement student enrollments, progressive lesson completeness tracking (checking for aggregate course resolution), and manual quiz submission scoring checking `BR-LMS-001`.
- **DoD:** Standard users can enroll; logging lesson completions updates enrollment rows; submitting quiz answers computes grades and records true/false passes.

### Issue 4: AI Quiz Generator Service, Celery Worker, and Pre-flight Credit Deductions

- **Track:** `track/9-lms-core`
- **Description:** Implement `POST /api/v1/lms/quizzes/generate` backed by pre-flight billing limits, pre-flight atomic SQL credit deductions, a 120s Redis idempotent lock, and Celery tasks generating `lms_quiz_v1` structured JSON.
- **DoD:** Triggering generation returns an HTTP 202 task ID. If credits are zero, throws HTTP 402 with `ERR_BILLING_001` immediately without hitting OpenAI.

### Issue 5: Angular Standalone Learner & Authoring Dashboard Components (Signals, OnPush)

- **Track:** `track/9-lms-core`
- **Description:** Design standalone Angular views showing course catalogs, lesson players, markdown previewers, quiz modules, progress charts, and authoring modules.
- **DoD:** Angular code compiles cleanly with no bundle size budget errors; Signals reactive streams handle responsive card and navigation states.

---

## 📋 Copy-Paste Prompt for Jules / Antigravity

```
USER_REQUEST:
We are starting Milestone 9: Module 4 LMS Engine (AI-Powered Learning & Enablement).
The goal of this track is to build out a secure, multi-tenant learning management workflow, integrated with our Centralised AI Platform and Stripe-billing credit systems.

Please execute the following tasks on a clean feature branch off 'develop':

1. GIT BRANCH & WORKFLOW
- Create and switch to a new local feature branch off 'develop' named exactly: track/9-lms-core
- All commit messages must follow the Conventional Commits specification.

2. DATABASE SCHEMAS & MIGRATIONS (Alembic)
- Create database tables utilizing UUID v4 PKs, lowercase plural snake_case schemas, and organization_id FKs:
  * 'courses', 'course_modules', 'lessons', 'course_enrollments' (add dynamic UNIQUE constraint on user_id + course_id where deleted_at IS NULL), 'lesson_progress', 'quizzes', 'quiz_questions', 'quiz_answers', and 'quiz_attempts'.
- Implement SQLAlchemy 2.0 repository classes under 'app/domain/lms/repositories.py'. Ensure all queries automatically filter by 'deleted_at IS NULL' and 'organization_id == current_tenant_id'.

3. AUTHORING, ENROLLMENT, PROGRESS, AND QUIZ REST APIS
- Deploy endpoints:
  * POST /api/v1/lms/courses (Requires lms:write RBAC)
  * POST /api/v1/lms/enrollments (Requires lms:read, registers user)
  * POST /api/v1/lms/lessons/{id}/progress (Requires lms:read, checks and resolves total course completion if all elements are processed)
  * POST /api/v1/lms/quizzes/attempts (Scores submitted answers, records passes if score >= 80% to satisfy BR-LMS-001)
- Zero-Leakage Horizontal Isolation: If an ID lookup is requested on an item belonging to another tenant or soft-deleted, throw an HTTP 404 Found 'ERR_NOT_FOUND_001' (not a 403).

4. AI QUIZ GENERATION WITH PRE-FLIGHT METERING
- Expose 'POST /api/v1/lms/quizzes/generate':
  * Triggers 'lms.generate_ai_quiz' Celery task, returning 202 Accepted.
  * Wrap route in BR-PLT-002 pre-flight dependency: Block requests if organization is soft-locked. Deduct 10 credits atomically via SQL update BEFORE running the worker task. Return HTTP 402 'ERR_BILLING_001' if credits are exhausted.
  * Task must secure lock 'ai_lock:quiz_gen:{lesson_id}' NX EX 300 in Redis.
  * Call centralized 'AiGatewayService' using 'lms_quiz_v1' JSON Structured output schema to draft a 5-question MC assessment from lesson text.

5. ANGULAR STANDALONE LMS DASHBOARDS (Signals & OnPush)
- Create standalone components 'LmsAuthorComponent' and 'LmsLearnerComponent' utilizing Angular Signals and OnPush change detection.
- Build markdown content renderers, quiz interfaces, and upload progression widgets polling 'GET /api/v1/ai/jobs/{job_id}'.

6. INTEGRATION TESTING GATES
- Write robust async integration test suite validating:
  * Blocked access on unauthorized or soft-locked tenants.
  * Cross-tenant UUID queries return 404s.
  * Atomic credit checks function cleanly under concurrent loads.
  * Quiz scoring correctly flags attempts as passed/failed based on the 80% boundary.

When complete, verify all tests pass locally (pytest -v), commit your work, and submit a Draft Pull Request.

```

---

🛠️ **This complete specification is ready for action.** Let me know when Jules activates this branch and you are ready to begin auditing the database mappings and AI-credit gateway transactions!
