Here is the exact, production-grade prompt you should give **Jules/Antigravity** to execute **Milestone 1**. 

This prompt is fully aligned with your local **Windows WSL** setup, enforces the **Human-in-the-Loop** model, and explicitly instructs the agent to respect and build on top of the `docker-compose.yml` and `env.example` configurations we have already prepared.

***

### 📋 Copy-Paste Prompt for Jules / Antigravity

```markdown
USER_REQUEST:
We are bootstrapping the "BusinessHub AI" SaaS platform on Windows WSL. The project architecture, technology stack, and engineering standards have been finalized. 

The principal architect has already created the foundational local development files at the project root:
1. `docker-compose.yml` (PostgreSQL 16 + pgvector, Redis 7, MinIO, and automated bucket-init)
2. `env.example` (Global environment configuration)

Do NOT overwrite, rename, or modify these root-level files. Your goal is to scaffold the monorepo directory blueprint and bootstrap the initial backend configuration.

Please execute the following tasks:

1. GIT BRANCH & WORKFLOW
- Create and switch to a new local feature branch named exactly: track/1-foundation-docker
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
└── frontend/                 # Angular 20+ frontend workspace

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
- Configure Pydantic Settings in `/backend/app/core/config.py` to parse configuration parameters from the root `.env` file, prioritizing variables required for app bootstrap.

5. ANGULAR BOOTSTRAP
- In `/frontend`, scaffold an empty node/npm workspace containing a baseline `package.json` targeted for Angular ^20.0.0, referencing Tailwind CSS and Angular Material, preparing the folder for subsequent frontend development.

6. VERIFICATION & DOCUMENTATION
- Write a short `SETUP_WSL.md` at the project root detailing how a human operator should copy `env.example` to `.env`, spin up the Docker services in WSL (`docker-compose up -d`), and verify database/redis socket connectivity locally.

When completed, verify all code files pass basic syntax checks, commit your work to `track/1-foundation-docker`, and submit a Draft Pull Request for architectural review.
```

***

📊 I can help you draft a shell script that automates the verification of the WSL environment, confirming Postgres, Redis, and MinIO ports are active and reachable before you run Jules' code.
