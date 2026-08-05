That AI prompt is a **highly structured set of technical instructions** designed to be given directly to your AI coding agent, **Jules** (or **Antigravity**). 

Because we spent quite a bit of effort getting your WSL network bridge fixed and your Docker containers running smoothly, **this prompt acts as a safety guard and instruction manual** for the coding agent. It tells the agent exactly how to build the initial codebase without breaking the working local setup you just verified.

Here is a quick breakdown of what the prompt instructs the agent to do:

### 1. **Keep Your Docker Infrastructure Safe**
The prompt explicitly warns the agent: *"Do NOT overwrite, modify, or break these root-level infrastructure files."* This ensures that Jules respects your working `docker-compose.yml` and `.env` settings, avoiding any risk of re-introducing the network errors we just resolved.

### 2. **Establish the Git Workflow**
It forces Jules to operate under strict enterprise standards:
*   Creating a clean feature branch named **`track/1-foundation-docker`** off `develop`.
*   Working entirely in a **Draft Pull Request** for you to review, rather than committing directly to your primary branches.
*   Writing structured commit messages following the **Conventional Commits** standard.

### 3. **Scaffold the Clean Architecture Folders**
It directs Jules to lay out the standardized **Modular Monolith folder structure** in the `/backend` directory according to **Clean Architecture** principles:
*   `api/` (for REST routes).
*   `core/` (for security, middleware, and database configs).
*   `domain/` (for core business models).
*   `repositories/` & `services/` (for database access and application logic).

### 4. **Initialize Backend Dependencies & Entry Point**
It commands the agent to bootstrap the Python environment:
*   Write a `requirements.txt` with the exact, un-hallucinated packages for your async stack (FastAPI, SQLAlchemy 2.0, Pydantic v2, Celery, and Redis).
*   Create `main.py` with a basic **`/api/v1/healthz`** monitoring endpoint.
*   Configure configuration loading via Pydantic Settings so the backend can automatically bind to your running PostgreSQL and Redis containers.

---

### **How to use it:**
Simply copy the entire prompt block from the previous message and paste it into your interface with **Jules/Antigravity** (in GitHub, Cursor, or whatever workspace environment you are using). It gives the agent everything it needs to successfully deliver **Milestone 1** of BusinessHub AI!

🤖 Once you hand this off to Jules, let me know if you would like me to review the generated code or explain any of the architectural choices they make in the Draft PR!
