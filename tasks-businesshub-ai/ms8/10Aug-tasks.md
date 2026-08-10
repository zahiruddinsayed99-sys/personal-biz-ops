## AI prompt
Here is a prompt you can copy and paste to start your new Jules session and have it execute the tests and generate the final report for Milestone 8:

---

```markdown
USER_REQUEST:
Hi Jules, excellent work on implementing the four issues for Milestone 8! 

Before we finalize this milestone, I need you to run a comprehensive test pass across all the implemented branches (`feat/crm-ai-metadata-fields`, `feat/ai-gateway-celery-scoring`, `feat/crm-ai-endpoints`, and `feat/crm-angular-ai-actions`) and generate a final Testing Report.

Please execute the following steps:

1. **Backend Integration & Unit Tests:**
   - Run the Alembic migrations locally to ensure the database schema is up to date.
   - Execute the pytest suite across the backend (`pytest tests/test_database_migrations.py`, `pytest tests/test_crm_ai_endpoints.py`, and the general `pytest tests/` for Celery/AI tasks).
   - Verify that all tests pass, specifically checking that the atomic credit metering and horizontal tenant isolation are functioning correctly.

2. **Frontend Compilation & Tests:**
   - Run the Angular frontend tests (`npx ng test --watch=false --browsers=ChromeHeadless`).
   - Verify that the Angular application compiles successfully without errors (`npm run build`).

3. **Generate Testing Report:**
   - Provide a structured "Testing Report" summarizing the results of the backend tests, frontend tests, and compilation steps. 
   - If any tests fail, please debug and fix them, then re-run the tests before providing the final report.

Please provide the final Testing Report once everything passes!

```
---
## Testing instruction
1. feat(db): Alembic schema migration for CRM AI metadata fields
Branch: feat/crm-ai-metadata-fields

Description: Extends the crm_deals table with dedicated columns (lead_score, intent_signals, last_scored_at) and a partial database index to support fast high-value lead filtering on corporate dashboards.

Local Verification & Testing Guide:

Dependencies & Setup:
cd backend
export DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/app-db"
alembic upgrade head
Automated Tests:
cd backend
export DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/app-db"
export PYTHONPATH=.
pytest tests/test_database_migrations.py
2. feat(ai): Centralised AI gateway prompt templates & Celery lead scoring task
Branch: feat/ai-gateway-celery-scoring

Description: Implements the asynchronous background Celery task crm.calculate_lead_score to query CRM contact histories and generate structured lead scores through our centralized AI Gateway. It uses a Redis idempotency lock to prevent double execution.

Local Verification & Testing Guide:

Dependencies & Setup:
Start local database and redis: docker compose up -d db redis
Start the Celery worker:
cd backend
celery -A app.core.celery_app worker --loglevel=info
Automated Tests:
cd backend
export DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/app-db"
export PYTHONPATH=.
pytest tests/
3. feat(api): CRM AI Copilot REST API endpoints with atomic pre-flight metering
Branch: feat/crm-ai-endpoints

Description: Exposes the endpoints POST /api/v1/crm/deals/{id}/ai-score and POST /api/v1/crm/deals/{id}/draft-followup enforcing strict vertical RBAC, soft-lock gates, and pre-flight atomic credit checks.

Local Verification & Testing Guide:

Dependencies & Setup:
Start local database and redis: docker compose up -d db redis
Start the Celery worker (same as above).
Start the FastAPI backend:
cd backend
uvicorn app.main:app --reload --port 8000
Automated Tests:
cd backend
export DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/app-db"
export PYTHONPATH=.
pytest tests/test_crm_ai_endpoints.py
Manual QA Walkthrough:
Trigger POST /api/v1/crm/deals/{id}/ai-score with a valid token; observe the 202 Accepted response with a job_id.
Trigger POST /api/v1/crm/deals/{id}/draft-followup and observe the drafted email in the response.
4. feat(ui): Angular Kanban UI AI Copilot Actions & Signal Polling Integration
Branch: feat/crm-angular-ai-actions

Description: Integrates AI scoring and email drafting tools into the Angular Kanban interface. Leverages Signals to handle optimistic state changes and polls Celery execution records reactively.

Local Verification & Testing Guide:

Dependencies & Setup: Ensure you have the Angular CLI installed or use the local one (npm install in the frontend directory).
Automated Tests:
cd frontend
npx ng test --watch=false --browsers=ChromeHeadless
Manual QA Walkthrough:
Run the backend API server (uvicorn) and the Celery worker.
Run the frontend (npm start in the frontend directory).
Access the CRM Deals pipeline at http://localhost:4200/crm.
Locate a deal card and press the Score Lead button.
Observe the button state switch to "Scoring..." and wait for the polling to finish, displaying the new score on the card.
Click Draft Follow-Up to test the glassmorphic modal and try the Copy to Clipboard action.
