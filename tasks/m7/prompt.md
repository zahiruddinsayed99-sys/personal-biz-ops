The finalized blueprint has been published directly to your Studio panel as **`milestone-7-ai-blueprint.md`** [27b7be40]. 

By incorporating these three robust constraints, we ensure that our AI capabilities are enterprise-ready, cost-controlled, and secure against cross-tenant data leaks and race conditions:
1. **Row-Level pgvector Isolation:** Embedding dimensions are bound to `organization_id`. Queries without an active, authenticated organization context fail with a clear **`ERR_RBAC_001` (HTTP 403)** to block unauthorised scans.
2. **Pre-Flight Atomic Metering (`BR-PLT-002`):** Implements an **Atomic SQL Check-and-Increment operation** to block credit theft under concurrent loads. We deduct credit balances *prior* to external LLM dispatch and immediately block requests with **`ERR_BILLING_001` (HTTP 402)** if the tenant is in a **Soft-Lock Overage** state.
3. **Asynchronous Celery Workers:** Delegating heavy document chunking and CRM lead scoring to Celery workers backed by Redis idempotent locks and exponential backoff retry cycles ensures synchronous FastAPI threads remain responsive.

---

### **GitHub Issues for Milestone 7 Sprint Planning**

Here are the four modular, copy-pasteable GitHub issues mapped precisely to our technical action items:

#### **Issue 1: Implement Row-Level pgvector Embedding Schema & Migrations**
*   **Type:** 🛠️ Feature & Migration (Backend)
*   **Track:** `track/7-ai-platform`
*   **Description:** Initialize the `organization_documents` database table with pgvector support, ensuring strict row-level multitenancy constraints are enforced.

##### **Technical Scope & Specifications**
1.  **Alembic Migration:**
    *   Enable the `pgvector` extension in PostgreSQL if not already active.
    *   Create the `organization_documents` table:
        *   `id` UUID PRIMARY KEY (`gen_random_uuid()`).
        *   `organization_id` UUID (FK to `organizations(id)`, `ON DELETE CASCADE`).
        *   `title` VARCHAR(255) (Not Null), `content` TEXT (Not Null).
        *   `embedding` Vector(1536) — *matching OpenAI text-embedding-3-small standard size*.
        *   Standard audit timestamps (`created_at`, `updated_at`) and soft delete (`deleted_at`).
2.  **Zero-Leakage Vector Search Scope:**
    *   Implement an async `OrganizationDocumentRepository` using SQLAlchemy 2.0 select and execute syntaxes.
    *   For vector search similarity queries, enforce that the query pipeline automatically appends `organization_id == current_tenant_id` and `deleted_at IS NULL`.
    *   Enforce that attempts to search without an authenticated `organization_id` throw `ERR_RBAC_001` (HTTP 403).

##### **Definition of Done (DoD)**
- [ ] Database migration successfully compiled and verified with upgrade/downgrade routines.
- [ ] Pytest integration tests verify that cross-tenant vector searches return zero results, and requests lacking an organization context are rejected with a 403.

---

#### **Issue 2: Develop Centralised AI Gateway with Pre-Flight Atomic Metering and Soft-Lock Checks**
*   **Type:** 🔒 Security & Feature (Backend)
*   **Track:** `track/7-ai-platform`
*   **Dependencies:** Issue 1

##### **Description**
Build the centralized AI Gateway layer supporting asynchronous chat/RAG prompts, wrapped in a pre-flight dependency that evaluates soft-locks and deducts credits atomically.

##### **Technical Scope & Specifications**
1.  **Core Gateway (`app/domain/ai/`):**
    *   Route all OpenAI/Gemini SDK instances through a single centralized gateway service. Direct model initialization outside this module is forbidden.
2.  **Soft-Lock & Pre-Flight Metering Dependency:**
    *   Write a dependency wrapper that intercepts all endpoint requests under `/api/v1/ai/`.
    *   If the tenant's `subscription_status` is in a **Soft-Lock Overage** state (e.g. downgraded tier with \\(>3\\) active users), block the execution with `ERR_BILLING_001` (HTTP 402).
3.  **Atomic SQL Credit Deduction:**
    *   Deduct credits using our atomic transaction statement:
        ```sql
        UPDATE organizations
        SET ai_credits_used = ai_credits_used + :requested_credits
        WHERE id = :org_id
          AND (subscription_tier = 'PRO' OR subscription_tier = 'ENTERPRISE' OR (ai_credits_used + :requested_credits <= 100 + bonus_ai_credits))
        RETURNING id;
        ```
    *   If no rows are updated, raise `ERR_BILLING_001` (HTTP 402) *before* dispatching any requests to external model providers.

##### **Definition of Done (DoD)**
- [ ] Core AI endpoints are fully protected by both soft-lock and pre-flight credit deduction logic.
- [ ] Concurrency tests verify that credit exhaustion successfully blocks downstream LLM API execution.

---

#### **Issue 3: Build Asynchronous Celery Document Ingestion Pipeline & Job Status API**
*   **Type:** ⚙️ Infrastructure & API (Backend)
*   **Track:** `track/7-ai-platform`
*   **Dependencies:** Issue 1

##### **Description**
Implement the asynchronous background ingestion worker using Celery to process document chunking and embedding generation asynchronously without blocking FastAPI thread loops.

##### **Technical Scope & Specifications**
1.  **Async Celery Task (`ai.process_document_embeddings`):**
    *   Worker fetches the uploaded document from MinIO/R2, chunks text, generates embeddings via the AI Gateway, and persists records.
    *   Add the pending background CRM calculation task: `crm.calculate_lead_score`.
2.  **Idempotent Redis Lock:**
    *   Acquire lock `ai_lock:doc:{document_id}` with a 5-minute TTL to prevent duplicate processing on rapid user submission clicks.
3.  **Transient Error Backoff:**
    *   Implement an exponential backoff retry policy (catching OpenAI RateLimitError / HTTP 429) inside the worker.
4.  **Job Status Routing (`GET /api/v1/ai/jobs/{job_id}`):**
    *   Expose a lightweight endpoint querying the Redis/DB state of the task, returning progress trackers and completion metrics.

##### **Definition of Done (DoD)**
- [ ] Celery document task runs asynchronously and registers pgvector records correctly within tenant boundaries.
- [ ] Pytest suite verifies that external API 429 rate-limiting triggers exponential backoff retries without dropping the job.

---

#### **Issue 4: Create Standalone Angular Signals Document Ingestion & AI RAG Panel**
*   **Type:** 🎨 Feature (Frontend)
*   **Track:** `track/7-ai-platform`
*   **Dependencies:** Issue 3

##### **Description**
Develop a standalone Angular dashboard component displaying document uploads, interactive chat RAG sessions, and real-time background task progression tracking.

##### **Technical Scope & Specifications**
1.  **UI Layout & Aesthetics:**
    *   Create a clean, glassmorphism-themed RAG interface featuring document upload widgets and contextually grounded chat streams.
2.  **Signal-Driven State & Standalone Architecture:**
    *   Enforce `ChangeDetectionStrategy.OnPush` and utilize the `inject()` dependency syntax.
    *   Expose Signals tracking uploading progress and active AI generation streams.
3.  **Reactive Job Polling Engine:**
    *   When a document upload returns a `job_id` (HTTP 202), initiate a reactive polling mechanism against `/api/v1/ai/jobs/{job_id}` using an RxJS interval stream converted back to a Signal.
    *   Update the UI with progress percentages, smoothly transitioning to completed states upon job resolution.

##### **Definition of Done (DoD)**
- [ ] Front-end standalone components compile with zero template or stylesheet budget errors.
- [ ] End-to-end flow verified: uploading a file displays active progress bars, resolves successfully, and allows immediate contextual RAG queries.

***

### 📋 Copy-Paste Prompt for Jules / Antigravity

```markdown
USER_REQUEST:
We are starting Milestone 7: Centralised AI Platform (Module 5). 
The goal of this track is to build the centralized, multi-tenant AI Platform Gateway, incorporating strict row-level pgvector isolation, pre-flight atomic credit metering, and asynchronous document ingestion tasks managed via Celery and Redis.

You must strictly implement this work off the 'develop' branch on a clean feature branch.

Please execute the following tasks:

1. GIT BRANCH & WORKFLOW
- Create and switch to a new local feature branch off 'develop' named exactly: track/7-ai-platform
- Follow strict Human-in-the-Loop guidelines: Do NOT attempt to push directly to 'main' or 'develop'. All deliverables must be prepared for a Draft Pull Request.
- All commit messages must follow the Conventional Commits specification (e.g., "feat(ai): implement row-level vector isolation and asynchronous ingestion pipeline").

2. DATABASE SCHEMA & VECTOR EMBEDDING ISOLATION (Alembic)
- Create an Alembic database migration to generate the 'organization_documents' table:
  * id UUID PRIMARY KEY (gen_random_uuid())
  * organization_id UUID (FK to organizations, ON DELETE CASCADE)
  * title VARCHAR(255) (Not Null), content TEXT (Not Null)
  * embedding Vector(1536) — Supports OpenAI text-embedding-3-small dimensions.
  * Standard audit timestamps (created_at, updated_at) and soft delete (deleted_at).
- Implement 'OrganizationDocumentRepository' using Async SQLAlchemy 2.0 select and execute syntaxes.
- Vector search queries MUST append 'organization_id == current_tenant_id' and 'deleted_at IS NULL' automatically. 
- If an API request attempts to access AI features without an authenticated organization context, throw an immediate ERR_RBAC_001 (HTTP 403).

3. CENTRALIZED AI GATEWAY & PRE-FLIGHT ATOMIC METERING
- Build core 'AiGatewayService' in 'backend/app/domain/ai/'. All LLM interactions across other modules (such as CRM lead scoring) must route through this gateway; direct SDK client creation is strictly forbidden.
- Integrate the BR-PLT-002 pre-flight dependency wrapper on all AI endpoints:
  * If 'organizations.subscription_status' is in a Soft-Lock Overage state (Downgraded with seats > 3), block execution with ERR_BILLING_001 (HTTP 402).
  * Deduct the calculated credit cost atomically using our single SQL statement before dispatching external LLM calls. If the transaction updates zero rows (credit limit exceeded), abort immediately and return ERR_BILLING_001 (HTTP 402).

4. ASYNCHRONOUS CELERY INGESTION WORKER & JOB STATUS API
- Implement 'POST /api/v1/ai/documents/upload' returning an HTTP 202 Accepted containing a Celery 'job_id'.
- Create the Celery asynchronous background task 'ai.process_document_embeddings' and the pending CRM background task 'crm.calculate_lead_score'.
- Background workers must fetch documents from MinIO, execute text-chunking algorithms, call the embedding gateway, and store pgvector embeddings bound securely to the organization_id.
- Implement Redis-based processing locks ('ai_lock:doc:{document_id}' NX EX 300) to prevent duplicate parsing runs, and enforce exponential backoff retry cycles inside Celery to handle transient LLM rate-limiting (HTTP 429) gracefully.
- Expose 'GET /api/v1/ai/jobs/{job_id}' to return JSON execution progress and status metrics.

5. ANGULAR STANDALONE AI PLATFORM & INGESTION PANEL
- Create standalone 'AiDashboardComponent' utilizing Angular Signals and ChangeDetectionStrategy.OnPush.
- Build a glassmorphism file-uploader widget and an interactive Chat RAG panel.
- On file upload, capture the Celery 'job_id' and initiate a reactive RxJS interval polling stream against 'GET /api/v1/ai/jobs/{job_id}' (converted to a Signal) to render smooth, real-time progress bars to the user.

6. INTEGRATION TESTING GATES
- Write comprehensive integration tests in 'backend/tests/':
  * Verify cross-tenant vector searches return zero leakages and unauthenticated requests fail with a 403.
  * Verify concurrent AI tasks deduct credits atomically and block once limits are exhausted.
  * Verify Celery tasks execute asynchronously, use Redis locks, and backoff correctly on simulated rate limits.

When complete, verify all tests pass locally (pytest -v), commit your changes to 'track/7-ai-platform', and submit a Draft Pull Request.
```

***

🎨 Once Jules activates this branch and begins implementing the pgvector repository wrappers, I am ready to review their database schemas, background worker setups, and the atomic credit consumption boundaries!
