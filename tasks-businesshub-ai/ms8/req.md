### **GitHub Milestone Details**

**Title:** Milestone 8: CRM AI Copilot & Lead Scoring
**Description:**

> This milestone concludes Module 2 (CRM Engine) by bringing it to 100% completion. The goal is to integrate our CRM Kanban Pipeline with the newly established Centralised AI Platform (Milestone 7) to deliver secure, multi-tenant AI Lead Scoring and Draft Follow-Up capabilities (`FR-CRM-02`). All AI operations must enforce strict horizontal multi-tenant isolation, atomic credit metering, and soft-lock protection.
> 
> 

---

### **GitHub Issues (Copy-Paste Ready)**

#### **Issue 1: Alembic Schema Migration for CRM AI Metadata Fields**

**Title:** `feat(db): Alembic schema migration for CRM AI metadata fields`
**Labels:** `backend`, `database`, `milestone-8`
**Description:**
Extend the `crm_deals` table with dedicated columns to persist AI-generated lead scores, intent signals, and historical audit timestamps to support AI analytics on our sales pipeline.

**Tasks:**

* Add the following columns to `crm_deals` via a new Alembic migration:


* `lead_score` (INTEGER, Nullable) — stores the AI-calculated score (0–100).


* `intent_signals` (JSONB, Nullable) — stores structured lists of intent markers (e.g., `["high_email_engagement", "pricing_page_visit"]`).


* `last_scored_at` (TIMESTAMPTZ, Nullable) — prevents redundant scoring runs and guides cache-invalidation.




* Create a partial database index on `crm_deals(organization_id, lead_score) WHERE deleted_at IS NULL` to support fast high-value lead filtering on corporate dashboards.



**Definition of Done:**

* [ ] Migration script runs cleanly on `alembic upgrade head` and rolls back on `alembic downgrade -1`.


* [ ] Database schema verified with automated test assertions ensuring columns are successfully added to newly provisioned deals.



---

#### **Issue 2: Centralised AI Gateway Prompt Templates & Celery Lead Scoring Task**

**Title:** `feat(ai): Centralised AI Gateway prompt templates & Celery lead scoring task`
**Labels:** `backend`, `ai`, `milestone-8`
**Description:**
Implement the asynchronous background Celery task `crm.calculate_lead_score` to query CRM contact histories and generate structured lead scores through our centralized AI Gateway.

**Tasks:**

* Register two new system prompt templates in `backend/app/domain/ai/prompts/`:


* `lead_scoring_v1`: Evaluates unstructured contact notes/history and outputs a JSON containing a `score` (0–100) and an array of `intent_signals` (max 5 strings).


* `crm_followup_v1`: Drafts professional, contextually grounded follow-up emails in INR-pricing terms.




* Implement the `crm.calculate_lead_score` Celery background task:


* Query historical contacts and notes linked to the deal's `contact_id`, strictly bounded by the `organization_id`.


* Call the `AiGatewayService` using the `lead_scoring_v1` prompt template.


* Persist the score and JSON array back to PostgreSQL inside an async transaction.




* Acquire a Redis idempotency lock: `ai_lock:score:{deal_id}` with a 2-minute TTL to prevent double-spend credit issues.



**Definition of Done:**

* [ ] Registered structured JSON prompt templates `lead_scoring_v1` and `crm_followup_v1`.


* [ ] Celery task successfully executes, locks runs via Redis, catches transient provider errors, and commits scores back to the database within strict tenant isolation filters.



---

#### **Issue 3: CRM AI Copilot REST API Endpoints with Atomic Pre-Flight Metering**

**Title:** `feat(api): CRM AI Copilot REST API endpoints with atomic pre-flight metering`
**Labels:** `backend`, `api`, `milestone-8`
**Description:**
Expose the AI CRM endpoints, enforcing strict vertical RBAC, soft-lock gates, and pre-flight atomic credit checks to prevent billing overages.

**Tasks:**

* Expose `POST /api/v1/crm/deals/{id}/ai-score` to trigger the Celery task.


* Expose `POST /api/v1/crm/deals/{id}/draft-followup` to return the personalized email draft.


* Require `crm:write` permission for all endpoints.


* Wrap endpoints in the pre-flight billing verification middleware (`BR-PLT-002`).


* Reject requests with `ERR_BILLING_001` (HTTP 402) if the organization is in a Soft-Lock Overage state (downgraded to Free but holding > 3 active users).


* Deduct 5 AI Credits atomically via the SQL check-and-increment query prior to external model dispatch. Return HTTP 402 if zero rows are updated.



**Definition of Done:**

* [ ] API routes verified to return standard JSON wrappers with correct HTTP codes.


* [ ] Pytest suites confirm that unauthenticated, soft-locked, or credit-exhausted tenants are blocked with `ERR_BILLING_001` (HTTP 402) prior to external model calls.



---

#### **Issue 4: Angular Kanban UI AI Copilot Actions & Signal Polling Integration**

**Title:** `feat(ui): Angular Kanban AI Copilot actions & Signal polling integration`
**Labels:** `frontend`, `ui`, `milestone-8`
**Description:**
Integrate AI scoring and email drafting tools into our Angular Kanban interface. Leverage Signals to handle optimistic state changes and poll Celery execution records reactively.

**Tasks:**

* Add an interactive action panel to the Kanban card details view.


* Implement a "Score Lead" button that triggers the scoring endpoint, captures the Celery `job_id` (HTTP 202), and uses the Signal-based RxJS polling engine against `/api/v1/ai/jobs/{job_id}` to render real-time progression.


* Update the card's local state dynamically using Angular Signals upon completion.


* Implement a "Draft Follow-Up" button that launches a glassmorphic modal preview displaying the customized email text with an instant "Copy to Clipboard" trigger.



**Definition of Done:**

* [ ] Standalone components compile cleanly with zero errors, remaining strictly under our CSS budget.


* [ ] Verified that initiating scoring launches an active progress tracker and dynamically updates lead metrics on completion.

---

### **Milestone 8 Blueprint: CRM AI Copilot & Lead Scoring (Module 2 100% Completion)**

Our logical next step is to **conclude Module 2 (CRM Engine) by bringing it to 100% completion**. Pausing at 75% was the correct architectural decision, as we now have a fully operational **Centralised AI Platform (Milestone 7)** to handle prompt template orchestrations, pgvector operations, and background task distributions. 

By delivering the remaining **25% of Module 2**, we will implement **`FR-CRM-02` (AI Follow-Up & Lead Scoring Copilot)**. This connects our CRM pipeline to our asynchronous Celery execution workers, enforcing strict horizontal multi-tenant isolation, atomic credit metering, and soft-lock protection.

---

### **1. Database Schema Extensions (Alembic Migration)**
To support AI analytics on our sales pipeline, we must extend the existing `crm_deals` table:
*   **Schema Additions:** Add the following columns to `crm_deals` via a new Alembic migration:
    *   `lead_score` (INTEGER, Nullable) — *stores the AI-calculated score (0–100)*.
    *   `intent_signals` (JSONB, Nullable) — *stores structured lists of intent markers (e.g. `["high_email_engagement", "pricing_page_visit"]`)*.
    *   `last_scored_at` (TIMESTAMPTZ, Nullable) — *prevents redundant scoring runs and guides cache-invalidation*.
*   **Database Indexes:** Create a partial database index on `crm_deals(organization_id, lead_score) WHERE deleted_at IS NULL` to support fast high-value lead filtering on corporate dashboards.

---

### **2. AI Gateway Prompt Versioning & Templates**
Following our centralized AI microservice directives, we will register two new system prompt templates in `backend/app/domain/ai/prompts/` to isolate model-level logic:
1.  **`lead_scoring_v1` (JSON Structured Output):**
    *   *System Context:* Evaluates unstructured contact notes, historical activity records, and deal values.
    *   *Output Schema:* Explicit JSON returning a `score` (0–100) and an array of `intent_signals` (maximum 5 string elements).
2.  **`crm_followup_v1` (Personalised Email Generator):**
    *   *System Context:* Drafts professional, contextually grounded follow-up emails in INR-pricing terms, referencing past deal history.

---

### **3. Asynchronous Lead Scoring Task (`crm.calculate_lead_score`)**
*   **Celery Background Task:**
    *   Triggered asynchronously to avoid blocking the main FastAPI thread loop.
    *   Queries historical contacts, activity records, and notes linked to the deal's `contact_id`, fully bounded by the active `organization_id`.
    *   Calls the centralized `AiGatewayService` using the `lead_scoring_v1` prompt template.
    *   Persists the generated score and JSON array back to PostgreSQL inside an async database transaction.
*   **Redis Idempotency Lock:**
    *   Acquires a temporary lock: `ai_lock:score:{deal_id}` with a 2-minute TTL. This prevents double-spend credit issues if a user clicks the scoring button multiple times.

---

### **4. Pre-Flight Credit Metering & Soft-Lock Gate Integration (`BR-PLT-002`)**
*   **The Billing Guard Layer:**
    *   All CRM AI endpoints require the `crm:write` permission and will be wrapped in our pre-flight billing verification middleware.
    *   If the organization is in a **Soft-Lock Overage** state (downgraded to Free but holding \\(>3\\) active users), the API will immediately reject the request with **`ERR_BILLING_001` (HTTP 402 Payment Required)**.
    *   Prior to dispatching requests to external models, deduct **5 AI Credits** (or appropriate tier cost) using our single **Atomic SQL Check-and-Increment operation**:
        ```sql
        UPDATE organizations
        SET ai_credits_used = ai_credits_used + :requested_credits
        WHERE id = :org_id
          AND (subscription_tier = 'PRO' 
               OR subscription_tier = 'ENTERPRISE' 
               OR (ai_credits_used + :requested_credits <= 100 + bonus_ai_credits))
        RETURNING id;
        ```
    *   If zero rows are updated, abort immediately and return `ERR_BILLING_001` (HTTP 402).

---

### **5. Frontend Angular Signals Integration**
*   **Kanban Card AI Panel:** Add an interactive action panel to the Kanban card details view.
*   **Score Lead Button:** 
    *   Triggers the scoring endpoint, captures the Celery `job_id` (HTTP 202), and uses our existing Signal-based RxJS polling engine against `/api/v1/ai/jobs/{job_id}` to render real-time progression.
    *   Upon completion, it dynamically updates the card’s local state using **Angular Signals** without forcing a full page reload.
*   **Draft Follow-Up Button:**
    *   Launches a glassmorphic modal preview displaying the customized email text with an instant "Copy to Clipboard" trigger.

---

### **GitHub Issues for the Milestone 8 Sprint**

#### **Issue 1: Alembic Schema Migration for CRM AI Metadata Fields**
*   **Type:** 🛠️ Refactor / Migration (Backend)
*   **Track:** `track/8-crm-ai-copilot`
*   **Description:** Extend the `crm_deals` table with dedicated columns to persist AI-generated lead scores, intent signals, and historical audit timestamps.

##### **Definition of Done (DoD)**
- [ ] Migration script runs cleanly on `alembic upgrade head` and rolls back on `alembic downgrade -1`.
- [ ] Database schema verified with automated test assertions ensuring columns are successfully added to newly provisioned deals.

---

#### **Issue 2: Centralised AI Gateway Prompt Templates & Celery Lead Scoring Task**
*   **Type:** ⚙️ Feature & Infrastructure (Backend)
*   **Track:** `track/8-crm-ai-copilot`
*   **Dependencies:** Issue 1

##### **Description**
Implement the asynchronous background Celery task `crm.calculate_lead_score` to query CRM contact histories and generate structured lead scores through our centralized AI Gateway.

##### **Definition of Done (DoD)**
- [ ] Registered structured JSON prompt templates `lead_scoring_v1` and `crm_followup_v1`.
- [ ] Celery task successfully executes, locks runs via Redis, catches transient provider errors, and commits scores back to the database within strict tenant isolation filters.

---

#### **Issue 3: CRM AI Copilot REST API Endpoints with Atomic Pre-Flight Metering**
*   **Type:** 🔒 Security & API (Backend)
*   **Track:** `track/8-crm-ai-copilot`
*   **Dependencies:** Issue 2

##### **Description**
Expose the endpoints `POST /api/v1/crm/deals/{id}/ai-score` and `POST /api/v1/crm/deals/{id}/draft-followup` enforcing strict vertical RBAC, soft-lock gates, and pre-flight atomic credit checks.

##### **Definition of Done (DoD)**
- [ ] API routes verified to return standard JSON wrappers with correct HTTP codes.
- [ ] Pytest suites confirm that unauthenticated, soft-locked, or credit-exhausted tenants are blocked with `ERR_BILLING_001` (HTTP 402) prior to external model calls.

---

#### **Issue 4: Angular Kanban UI AI Copilot Actions & Signal Polling Integration**
*   **Type:** 🎨 Feature (Frontend)
*   **Track:** `track/8-crm-ai-copilot`
*   **Dependencies:** Issue 3

##### **Description**
Integrate AI scoring and email drafting tools into our Angular Kanban interface. Leverage Signals to handle optimistic state changes and poll Celery execution records reactively.

##### **Definition of Done (DoD)**
- [ ] Standalone components compile cleanly with zero errors, remaining strictly under our CSS budget.
- [ ] Verified that initiating scoring launches an active progress tracker and dynamically updates lead metrics on completion.

---

### 📋 Copy-Paste Prompt for Jules / Antigravity

```markdown
USER_REQUEST:
We are starting Milestone 8: CRM AI Copilot & Lead Scoring Completion (Module 2 100% Completion).
The goal of this sprint is to integrate our CRM Kanban Pipeline with our Centralised AI Platform (Milestone 7) to deliver secure, multi-tenant AI Lead Scoring and Draft Follow-Up capabilities.

Please execute the following tasks on a clean feature branch off 'develop':

1. GIT BRANCH & WORKFLOW
- Create and switch to a new local feature branch off 'develop' named exactly: track/8-crm-ai-copilot
- All commit messages must follow the Conventional Commits specification.

2. DATABASE SCHEMA EXTENSIONS (Alembic)
- Create an Alembic database migration to add these columns to the 'crm_deals' table:
  * lead_score (INTEGER, Nullable)
  * intent_signals (JSONB, Nullable)
  * last_scored_at (TIMESTAMPTZ, Nullable)
- Implement a database index on 'crm_deals(organization_id, lead_score) WHERE deleted_at IS NULL'.

3. CENTRALIZED AI PROMPT TEMPLATES & CELERY BACKGROUND TASK
- Register prompt templates 'lead_scoring_v1' (JSON structured output) and 'crm_followup_v1' inside 'backend/app/domain/ai/prompts/'.
- Implement the 'crm.calculate_lead_score' Celery background task:
  * Safely fetch unstructured notes, activity logs, and contacts bound strictly to the active 'organization_id'.
  * Call the centralized 'AiGatewayService' using 'lead_scoring_v1' to return the score and intent array.
  * Persist findings back to 'crm_deals'.
- Enforce a Redis-based execution lock ('ai_lock:score:{deal_id}' NX EX 120) to prevent duplicate runs.

4. CRM AI COPILOT REST API ENDPOINTS
- Expose public-facing tenant endpoints:
  * 'POST /api/v1/crm/deals/{id}/ai-score' (Triggers Celery task, returns 202 Accepted with job_id)
  * 'POST /api/v1/crm/deals/{id}/draft-followup' (Deducts credits, returns personalized email text body)
- Enforce 'RequiresPermission("crm:write")' and horizontal multi-tenant isolation. If looking up a cross-tenant ID, return HTTP 404 'ERR_NOT_FOUND_001'.
- Wrap endpoints with 'BR-PLT-002' billing check-and-increment middleware:
  * Block execution immediately with 'ERR_BILLING_001' (HTTP 402) if the organization is in a Soft-Lock Overage state.
  * Deduct credits atomically via SQL update before dispatching any model API calls. Return HTTP 402 if credit limits are breached.

5. ANGULAR KANBAN UI COPILOT INTEGRATION
- Create standalone components with ChangeDetectionStrategy.OnPush and Signal-driven state.
- Add "Score Lead" & "Draft Follow-Up" controls inside the Kanban Card details modal.
- For lead scoring, capture the 'job_id' and initiate an RxJS interval polling stream against 'GET /api/v1/ai/jobs/{job_id}' (converted to a Signal) to update progress bars, dynamically resolving to the new score.
- Display drafts inside a polished, glassmorphism modal with a Copy-to-Clipboard shortcut.

6. INTEGRATION TESTING GATES
- Write robust async pytest suites in 'backend/tests/':
  * Verify unauthenticated or soft-locked users cannot run AI endpoints.
  * Verify cross-tenant requests fail with HTTP 404 'ERR_NOT_FOUND_001'.
  * Verify atomic credit consumption behaves correctly under concurrent loads.
  * Verify the Celery task updates DB records successfully and respects the Redis run-lock.

When complete, verify all tests pass locally (pytest -v), commit your work to 'track/8-crm-ai-copilot', and submit a Draft Pull Request.
```

***

🤖 **This plan is completely optimized, highly secure, and is the logical step to bring Module 2 to 100% completion.** Once you approve this architecture, I am ready to hand this scope directly to Jules!
