Here is the Local Verification & Testing Guide for testing this feature branch locally:

1. New Tools & Dependencies
Backend Dependencies: Run the following in your activated virtual environment inside the backend directory to install the new packages:

pip install pgvector celery pytest-asyncio stripe passlib bcrypt python-jose
Database Setup: Ensure your PostgreSQL instance has the pgvector extension installed. If running locally, you must first create the extension:

CREATE EXTENSION IF NOT EXISTS vector;
If using Docker, ensure you pull the pgvector/pgvector:pg16 image or equivalent that bundles the extension. Run the migrations to build the tables:

cd backend
alembic upgrade head
Frontend Dependencies: No new dependencies are required, just an standard install:

cd frontend
npm install
2. Automated Test Commands
Backend Integration Tests: From the backend directory with your virtual environment active, run the test suite to verify the vector isolation, Celery retries, and atomic credit limit logic:

export PYTHONPATH=.
pytest -v tests/test_ai_endpoints.py
All integration tests should pass successfully.

Frontend Verification: Run the build script to ensure the new AI platform components compile flawlessly:

cd frontend
npm run build
3. Manual QA Walkthrough
Start the Infrastructure: Start your local PostgreSQL, Redis server, and the Celery worker (e.g. celery -A app.core.celery_app worker --loglevel=info). Then start the FastAPI server (uvicorn app.main:app --reload) and the Angular frontend (ng serve).
Navigate & Upload: Log in to the application and navigate to the /ai route to open the AI Dashboard. Under "Document Ingestion", enter a Title, paste some text content, and hit "Upload & Ingest".
Verify Polling & Progress: You should see a Job ID appear with the status PENDING, and the progress bar smoothly advance as the background Celery job processes the document embeddings via Redis. Wait for the status to switch to SUCCESS and the progress bar to complete!
