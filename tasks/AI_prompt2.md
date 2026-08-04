### 📋 Copy-Paste Prompt for Jules / Antigravity

```markdown
USER_REQUEST:
We are bootstrapping the "BusinessHub AI" SaaS platform. The local development infrastructure is already up and fully verified on WSL:
- PostgreSQL 16 + pgvector (via pgvector/pgvector:0.7.4-pg16) is active on port 5432.
- Redis 7-alpine is active on port 6379.
- MinIO object storage is active with an automated initialization job.
- An Angular development workspace is serving locally on port 4200.

The baseline `docker-compose.yml` and `.env`/`env.example` configurations are finalized. Do NOT overwrite, modify, or break these root-level infrastructure files.

Your goal is to scaffold the clean monorepo directory blueprint and bootstrap the initial backend configuration.

Please execute the following tasks:

1. GIT BRANCH & WORKFLOW
- Create and switch to a new local feature branch off 'develop' named exactly: track/1-foundation-docker
- Follow strict Human-in-the-Loop guidelines: Do NOT attempt to push directly to 'main' or 'develop'. All deliverables must be prepared for a Draft Pull Request.
- All commit messages must strictly follow the Conventional Commits specification (e.g., "feat(foundation): scaffold directory blueprint and backend requirements").

2. MONOREPO STRUCTURE
Scaffold the following directory structure in the repository root:
├── backend/                  # Python 3.12+ / FastAPI backend
│   ├── app/                  # Clean Architecture source code directory
│   │   ├── api/              # API controllers and routing layer
│   │   ├── core/             # Settings, security, and middleware
│   │   ├── domain/           # Business entities and domain logic
│   │   ├── repositories/     # Data access layer (Async SQLAlchemy 2.0)
│   │   ├── schemas/          # Pydantic v2 DTO schemas
│   │   └── services/         # Application business use-cases
│   └── tests/                # Pytest suite directory
└── frontend/                 # Angular frontend workspace (leave existing workspace untouched)

3. BACKEND INITIALIZATION & DEPENDENCIES
In `/backend`, create a production-grade `requirements.txt` containing the exact, un-hallucinated stack packages and versions:
- fastapi==0.111.0 (ASGI framework)
- uvicorn[standard]==0.30.0 (ASGI server)
- sqlalchemy[asyncio]==2.0.30 (ORM)
- asyncpg==0.29.0 (PostgreSQL async driver)
- alembic==1.13.0 (Database migrations)
- pydantic[email]==2.7.4 (Data validation & settings management)
- pydantic-settings==2.3.4 (Environment configuration parsing)
- celery==5.4.0 (Asynchronous task queue)
- redis==5.0.4 (Cache/Queue client library)
- structlog==24.1.0 (Structured logging)
- python-multipart==0.0.9 (Form parsing support)

4. BASIC BACKEND ENTRY POINT
- Inside `/backend/app/main.py`, scaffold a minimal FastAPI application.
- Implement a basic `/api/v1/healthz` endpoint that returns a placeholder 200 OK status.
- Configure Pydantic Settings in `/backend/app/core/config.py` to parse configuration parameters from the root `.env` file, prioritizing database, redis, and minio connection strings required for startup.

5. VERIFICATION
- Write a short `backend/README.md` explaining how to create a virtual environment (`python -m venv .venv`), install the dependencies, and start the FastAPI server locally (`uvicorn app.main:app --reload`).

When completed, verify all code files pass basic syntax checks, commit your work to `track/1-foundation-docker`, and submit a Draft Pull Request for architectural review.
```

***

🚀 Let me know when Jules has prepared the Draft PR, and we can run a deep architectural review of the clean backend entry point and settings parsing!
