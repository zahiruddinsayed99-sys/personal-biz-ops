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
