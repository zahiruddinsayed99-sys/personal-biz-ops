To help you execute the development of **Module 4: LMS Engine (AI-Powered Learning & Enablement)** with maximum organization, I have structured this work into **2 target GitHub Milestones** containing **5 granular, developer-ready GitHub Issues**.

These issues are completely aligned with our existing repository architecture, database schemas, and clean code directives. They can be copied and pasted directly into your repository's issue tracker or project board.

---

# GitHub Milestones: Module 4 (LMS)
## Milestone 9.1: Core LMS Infrastructure & Course Execution Rails

- **Target Duration:** Sprint 1 (2 Weeks)
- **Core Objective:** Deploy the physical database schemas, async repositories, and REST API endpoints supporting complete course design, publishing, learner enrollment, and progress-tracking.
- **Target Metrics:** 100% database schema coverage, zero cross-tenant query leakages on lookups, clean progress-logging state transitions.

## Milestone 9.2: Central AI Ingestion & Standalone Frontend Delivery

- **Target Duration:** Sprint 2 (2 Weeks)
- **Core Objective:** Wire up the AI Quiz Generator to our centralized `AiGatewayService` using Celery background workers and pre-flight credit checks, and deliver the final, highly reactive Angular standalone dashboards.
- **Target Metrics:** 100% of AI operations wrapped in atomic SQL credit deductions, safe Redis idempotent locks, and zero bundle size budget overflows on Angular compilations.

---

# GitHub Issues: Module 4 (LMS)
## Issue 1: Database Migration: Implement LMS Relational Schema (PostgreSQL & pgvector)

- **Type:** `Type: Database / Migration`
- **Milestone:** `Milestone 9.1: Core LMS Infrastructure`
- **Branch:** `track/9-lms-core`

### Description

Generate and apply the physical database schemas and async SQLAlchemy 2.0 repository classes for the LMS engine, ensuring absolute row-level multi-tenant isolation.

### Technical Scope & Specifications

1. **Alembic Migration:** Create a new migration file declaring: 
   - `courses` **Table:** `id` (UUID PK), `organization_id` (UUID FK to `organizations(id)` with `ON DELETE CASCADE`), `title` (VARCHAR(255)), `description` (TEXT), `status` (VARCHAR(20), default `'DRAFT'`), and timezone-aware audit and soft-delete columns (`created_at`, `updated_at`, `deleted_at`).
   - `course_modules` **Table:** `id` (UUID PK), `organization_id` (UUID FK), `course_id` (UUID FK referencing `courses`), `title` (VARCHAR(255)), and `sort_order` (INTEGER, default `0`).
   - `lessons` **Table:** `id` (UUID PK), `organization_id` (UUID FK), `module_id` (UUID FK referencing `course_modules`), `title` (VARCHAR(255)), `content_body` (TEXT for Markdown lessons), `video_url` (VARCHAR(512), Nullable), `sort_order` (INTEGER, default `0`), and soft delete (`deleted_at`).
   - `course_enrollments` **Table:** `id` (UUID PK), `organization_id` (UUID FK), `user_id` (UUID FK referencing `users`), `course_id` (UUID FK referencing `courses`), `status` (VARCHAR(20), default `'ENROLLED'`), `completed_at` (TIMESTAMPTZ, Nullable), and `deleted_at`.
   - `lesson_progress` **Table:** `id` (UUID PK), `organization_id` (UUID FK), `enrollment_id` (UUID FK referencing `course_enrollments`), `lesson_id` (UUID FK referencing `lessons`), `is_completed` (BOOLEAN, default `FALSE`), and `completed_at` (TIMESTAMPTZ, Nullable).
2. **Database Indices & Partial Unique Constraints:** 
   - Enforce a **Partial Composite Unique Index** on `course_enrollments(organization_id, user_id, course_id) WHERE deleted_at IS NULL` to strictly block duplicate active enrollments.
   - Enforce indices on sorting orders: `course_modules(course_id, sort_order)` and `lessons(module_id, sort_order)`.
3. **SQLAlchemy 2.0 Repositories:** 
   - Implement async repositories: `CourseRepository`, `EnrollmentRepository`, and `LessonRepository` inside `app/domain/lms/repositories.py`.
   - Enforce that all lookup/select queries automatically inject `organization_id == current_tenant_id` and `deleted_at IS NULL`.

### Definition of Done (DoD)

- [ ] Running `alembic upgrade head` and `alembic downgrade -1` completes successfully with zero schema orphaned keys.
- [ ] Automated tests verify that attempting to fetch a course record from another organization yields zero result records.

---

## Issue 2: Backend API: Create Course, Module, and Lesson Authoring Services (Draft/Publish Lifecycles)

- **Type:** `Type: Backend API`
- **Milestone:** `Milestone 9.1: Core LMS Infrastructure`
- **Branch:** `track/9-lms-core`
- **Dependencies:** Issue 1

### Description

Expose the REST API endpoints supporting course creation, module hierarchies, lesson attachments, and transition configurations between `DRAFT` and `PUBLISHED` states.

### Technical Scope & Specifications

1. **Expose Controller Endpoints:** 
   - `POST /api/v1/lms/courses` (Creates a draft course)
   - `GET /api/v1/lms/courses/{id}` (Retrieves structured course details)
   - `POST /api/v1/lms/courses/{id}/modules` (Appends a module with sorting order)
   - `POST /api/v1/lms/courses/{id}/lessons` (Appends a Markdown lesson to a module)
   - `PATCH /api/v1/lms/courses/{id}/status` (Switches course state to `'PUBLISHED'`)
2. **RBAC and Access Security:** 
   - Route authorization must bind strictly to our permission checks. Limit CRUD/Authoring endpoint access to sessions holding the `lms:write` scope (`TENANT_OWNER`, `TENANT_ADMIN`, and `LMS_MANAGER` roles).
3. **Zero-Leakage Multi-Tenant Enforcement:** 
   - If an authenticated request attempts to look up a course, module, or lesson ID that does not exist *or* belongs to another organization, the API must throw an immediate **HTTP 404 Not Found (**`ERR_NOT_FOUND_001`)** instead of a 403 to prevent UUID scanning.

### Definition of Done (DoD)

- [ ] Endpoints return JSON data wrapped cleanly in our standard system response envelope.
- [ ] Pytest suite verifies that users with the standard `DOMAIN_MEMBER` role are blocked from creating courses (returning HTTP 403 `ERR_RBAC_001`).
- [ ] Cross-tenant URL lookups are verified to return HTTP 404 `ERR_NOT_FOUND_001`.

---

## Issue 3: Backend API: Create Learner Enrollment, Progress Tracker, and Quiz Scoring Subsystem

- **Type:** `Type: Backend API / Business Logic`
- **Milestone:** `Milestone 9.1: Core LMS Infrastructure`
- **Branch:** `track/9-lms-core`
- **Dependencies:** Issue 2

### Description

Implement user-enrollment routines, lesson-level progressive progress tracking, and manual quiz scoring checks enforcing our minimum threshold business constraints.

### Technical Scope & Specifications

1. **Database Migration for Assessment Entities:** Ensure tables are initialized: 
   - `quizzes` Table (binds to a `lesson_id`).
   - `quiz_questions` Table (has FK to `quizzes`).
   - `quiz_answers` Table (contains answers, with `is_correct` boolean indicator).
   - `quiz_attempts` Table: tracks `score` (Numeric 5, 2), `passed` (Boolean), and audit data.
   - `quiz_responses` Table: tracks `attempt_id`, `question_id`, and `selected_answer_id`.
2. **Fulfillment & Core Business Logic:** 
   - `POST /api/v1/lms/enrollments` (Registers user to a course).
   - `POST /api/v1/lms/lessons/{id}/progress`: Logs lesson completion. When a lesson progress node is committed, recalculate the aggregate course progression. If all lessons across all modules in the course are completed, automatically transition `course_enrollments.status` to `'COMPLETED'` and set `completed_at = now()`.
   - `POST /api/v1/lms/quizzes/attempts`: Accepts selected answer array, evaluates against true answers in the database, saves responses, computes the percentage score, and enforces `BR-LMS-001`: an attempt is flagged as `passed = TRUE` if and only if the calculated score is $\ge 80\%$.
3. **RBAC Guards:** Limit these learner execution endpoints strictly to sessions holding `lms:read` permissions.

### Definition of Done (DoD)

- [ ] Submitting progress logs correctly transitions enrollment rows to completed once the final lesson is processed.
- [ ] Quiz submissions evaluate score calculations accurately and apply correct true/false pass validations.

---

## Issue 4: Backend/AI Service: Create AI Quiz Generator Task, Celery Workers, and Pre-flight Credit Metering Gates

- **Type:** `Type: AI Service / Worker / Billing Control`
- **Milestone:** `Milestone 9.2: Central AI Ingestion & Frontend Delivery`
- **Branch:** `track/9-lms-core`
- **Dependencies:** Issue 3

### Description

Build the asynchronous background AI Quiz Generator pipeline, integrating with our centralized `AiGatewayService` using Celery workers, Redis locks, and strict pre-flight billing gates.

### Technical Scope & Specifications

1. **Expose** `POST /api/v1/lms/quizzes/generate` **(HTTP 202 Accepted):** 
   - Payload format: `{"lesson_id": "<UUID>"}`.
   - Verify the organization is not in a **Soft-Lock Overage state** (exceeding active users limit).
   - **Pre-flight Billing Guard (**`BR-PLT-002`):** Execute our atomic check-and-increment SQL query to deduct **10 AI Credits** from the organization's billing balance before dispatching the background worker. If the update yields zero rows, abort immediately and return **HTTP 402 Payment Required (**`ERR_BILLING_001`)** without hitting external models.
2. **Async Celery Task (**`lms.generate_ai_quiz`):** 
   - Implement a Redis-based execution lock: `ai_lock:quiz_gen:{lesson_id}` with a 300s TTL.
   - Query the lesson's Markdown text content, bound strictly to the active `organization_id`.
   - Call the centralized `AiGatewayService` using the structured `lms_quiz_v1` **JSON output prompt contract** to extract exactly 5 MCQ questions.
   - Implement exponential backoff retry handling for transient external LLM rate limits (`HTTP 429`).
   - Save the resulting questions, answers, and keys atomically to the database inside a transaction block.

### Definition of Done (DoD)

- [ ] Triggering the endpoint with zero credits immediately returns an HTTP 402 without executing background tasks.
- [ ] Pytest verification confirms Celery tasks process and commit structured quiz schemas within isolated tenant constraints.

---

## Issue 5: Frontend UI: Implement Standalone Angular LMS Dashboards, Lesson Player, and Real-time Task Polling

- **Type:** `Type: Frontend Component`
- **Milestone:** `Milestone 9.2: Central AI Ingestion & Frontend Delivery`
- **Branch:** `track/9-lms-core`
- **Dependencies:** Issue 4

### Description

Develop the responsive, standalone Angular frontend dashboards displaying active course catalogs, Markdown lesson readers, assessment quiz modules, progress charts, and admin course creation.

### Technical Scope & Specifications

1. **Architecture & UI:** 
   - Build `LmsLearnerComponent` and `LmsAuthorComponent` standalone structures using `ChangeDetectionStrategy.OnPush` and `inject()` syntax.
   - Establish a glassmorphic dashboard visualizing active enrollments, course progression meters, and low-score warning tags.
2. **Markdown & Video Player:** 
   - Render lesson Markdown bodies inside a secure sanitization container, with built-in styling for copyable code blocks and interactive checklists.
3. **Real-Time AI Quiz Polling:** 
   - When the author clicks "Generate AI Quiz", capture the returned Celery `job_id`.
   - Initiate a reactive RxJS interval polling stream (3-second interval) querying `GET /api/v1/ai/jobs/{job_id}`, converting the state back into an Angular **Signal**.
   - Show a progress bar in the UI. Transition automatically to render the generated MCQ form when the job resolves.

### Definition of Done (DoD)

- [ ] Angular compilation finishes cleanly with zero errors, keeping stylesheet budgets within our strict constraints.
- [ ] Manual walkthrough confirms that triggering AI quiz generation updates the UI progressively, displaying the completed quiz form upon worker resolution.

---

## 🚀 Ready for Jules / Antigravity

These issues provide a highly detailed, comprehensive roadmap for Jules. They can now create the branch `track/9-lms-core` and execute the issues sequentially on their coding pipeline.

Which component of the schema structure or API logic would you like to review next as they prepare to initiate this sprint?
