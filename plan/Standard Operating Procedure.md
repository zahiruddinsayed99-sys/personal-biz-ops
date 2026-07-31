Based on your AI Pro plan, the best model to use for this architectural discussion is **Gemini Advanced (powered by Gemini 1.5 Pro)**. *(Please note that the specific model name "Gemini Advanced/1.5 Pro" is based on general knowledge outside of your sources, though your sources explicitly rely on "ChatGPT/Gemini" for high-level architecture, generating status reports, and technical reviews).* This model excels at maintaining large contexts, which is critical for complex system architecture.

To build your repeatable system template, you should utilize the **Distributed AI Workflow** outlined in your documents. This workflow maintains a 9.5/10 quality score by dividing tasks into specific roles (like Principal Architect and Implementation Engineer) to avoid context bloat. 

Here is the comprehensive AI prompt you can copy and paste into Gemini to generate your production-grade workflow document. It incorporates your established tech stack, architectural patterns, and the 4-step implementation cycle:

***

### AI Prompt for Gemini

**Copy and paste the text below into your Gemini chat:**

> **Role:** Act as the Principal Architect for "BusinessHub AI," a multi-tenant business operating platform.
> 
> **Context:** I need to build a comprehensive, repeatable Standard Operating Procedure (SOP) and workflow template for developing production-grade application modules (such as CRM, E-commerce, and Inventory). We are treating this as one commercial SaaS platform, not a collection of independent projects. 
> 
> **Technical Baseline:** 
> *   **Architecture:** Modular Monolith using Clean Architecture (Routers → Services → Repositories → Models) and lightweight Domain-Driven Design.
> *   **Backend:** Python 3.12, FastAPI (Pydantic v2), PostgreSQL 17, Redis 8, SQLAlchemy 2.x, and Alembic.
> *   **Frontend:** Angular 20+ utilizing Standalone Components, Signals, RxJS, and Angular Material 3.
> *   **Infrastructure & Validation:** Docker Compose, GitHub Actions (CI/CD), Pytest, Ruff, Black, MyPy (strict type checking), and Postman SIT.
> 
> **Task:** Create a detailed, repeatable step-by-step workflow document that I can use every time I start a new feature or module. The workflow must follow this specific **Implementation Cycle**:
> 
> 1. **Architecture & Planning:** Steps for defining the blueprint, repository/service patterns, and database schema.
> 2. **Context Injection:** A checklist of "Non-Negotiable Principles" (e.g., strict SOLID principles, "no 'any' types" in frontend, and Historical Integrity via snapshotting) that must be fed to the AI Implementation Engineer.
> 3. **Execution (The Zero-Friction Prompt):** A template for creating explicit prompts containing "Task," "Context," and "Technical Requirements" to ensure generated code fits the existing architecture.
> 4. **Verification & Review:** Criteria for the "Definition of Done," including build reviews, lint reviews, technical debt registers, and required testing minimums (Unit, Integration, Component, and E2E via Playwright).
> 
> Finally, include an outline for a Software Requirements Specification (SRS) artifact that can house up to 200–300 functional requirements, API contracts, and a phased implementation backlog so we treat this as a commercial software product from day one.

***

### Why this prompt works based on your sources:
*   **Separation of Concerns:** It explicitly asks Gemini to act as the **Principal Architect**, which is the designated "Host" AI role responsible for blueprints and quality gates, while reserving code generation for a separate "Implementation Engineer" session later.
*   **Enterprise Standards:** It enforces your specific architectural choices, such as strict adherence to the **Repository Pattern** (persistence only) and a dedicated **Service Layer** for business logic, preventing the AI from taking tutorial-style shortcuts.
*   **Human-AI Collaboration Framework:** It sets up the system where you (the Human Technical Lead) provide the vision and context injections, and the AI acts as your technical support for risk analysis and documentation. 

Once Gemini generates this workflow template, you can upload it back here, and we can use it to govern the rest of your platform's development!
