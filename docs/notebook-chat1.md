**BusinessHub AI** is an enterprise-grade, multi-tenant Software-as-a-Service (SaaS) platform designed to operate as a unified operating system for businesses. The system showcases production-grade modular architecture, automated CI/CD pipelines, and zero-cost staging infrastructure.

Here is a comprehensive summary of the system architecture, design specifications, and implementation guidelines detailed in your documents:

### **Architecture & Technology Stack**
The platform is designed as a **Modular Monolith**, utilizing strict package boundaries for logical domain separation, which eliminates the network latency and complexity of microservices while retaining the ability to scale.
*   **Backend:** Powered by **FastAPI (Python 3.12+)** utilizing a native async runtime. It strictly adheres to **Clean Architecture**, meaning dependencies flow inward (API $\rightarrow$ Services $\rightarrow$ Domain $\rightarrow$ Repositories). It uses **Async SQLAlchemy 2.0** for ORM mapping and **Pydantic v2** for data validation.
*   **Frontend:** Built on **Angular 20+** using a **Signal-Driven Reactive State** paradigm. It strictly mandates the use of **Standalone Components** (NgModules are deprecated), `OnPush` change detection, and utility-first styling with Angular Material and Tailwind CSS.
*   **Data & Infrastructure:** The primary database is **PostgreSQL 16 (with pgvector)**, managed via Alembic migrations. **Redis** handles caching, rate limiting, and serves as a message broker for **Celery** background tasks. Hosting is designed for zero-cost free/hobby tiers, utilizing Vercel (Frontend), Render (Backend), Supabase (Postgres), and Cloudflare R2 (Object Storage).

### **Multi-Tenancy, Security, & Billing**
A critical design pillar of BusinessHub AI is strict multi-tenant isolation and security:
*   **Row-Level Tenant Isolation:** Every tenant-bound database table must include a mandatory `organization_id` UUID column. FastAPI middleware automatically extracts the organization ID from user tokens and enforces database query scopes to prevent cross-tenant data leaks.
*   **Authentication & RBAC:** The platform uses short-lived **JWT Access Tokens** paired with rotated Refresh Tokens. A strict Role-Based Access Control (RBAC) matrix defines permissions for roles ranging from Platform SuperAdmin to Domain Members and Read-Only Auditors.
*   **Monetization:** Subscription tiers (Free, Pro, Enterprise) are managed via a **Stripe / Lemon Squeezy sandbox integration**. Asynchronous webhook handlers enforce usage limits, automatically blocking AI or module features if a tenant breaches their credit allocations.

### **Core Business Modules & Centralized AI**
The platform consolidates four primary enterprise engines, all supported by a unified AI layer:
1.  **CRM Module:** Manages leads, contacts, and deal pipelines using visual Kanban boards, supported by an **AI Lead Scoring Copilot** that synthesizes customer notes.
2.  **E-Commerce & Inventory Management:** Tracks multi-warehouse stock allocation in real-time. It features an AI demand forecasting tool that analyzes sales velocity to predict stock depletion and draft purchase orders.
3.  **LMS Engine:** Features a course builder that leverages AI to automatically generate quizzes based on uploaded course documentation.
4.  **Central AI Platform:** Instead of disparate integrations, a shared **AI Microservice Gateway** centralizes RAG (Retrieval-Augmented Generation), OCR, document search, and LLM orchestration. All prompts are structured and versioned, and pgvector handles isolated document embeddings.

### **AI Agent Directives & Engineering Standards**
To ensure codebase health when collaborating with autonomous coding agents (like Google Antigravity or Jules), strict rules are enforced:
*   **Human-in-the-Loop (HITL):** Agents operate as untrusted contributors. They must submit work via isolated feature branches and draft Pull Requests; direct pushes to the main branch are forbidden.
*   **Strict Naming & API Contracts:** All database columns follow `snake_case`, and URLs follow standard REST patterns (e.g., `/api/v1/{module}/{resource}`). API responses must adhere to a standardized schema wrapper, and a specific error code catalog (e.g., `ERR_AUTH_001`) is maintained.
*   **Zero-Tolerance Quality Gates:** Any code pushed must pass automated GitHub Actions pipelines, which include static analysis, health checks, type checking, and unit testing, before it can be merged. 

### **Implementation Roadmap**
The project execution is broken down into structured phases:
*   **Phase 1 (Core Platform Foundation):** Focuses on the monorepo setup, docker initialization, multi-tenant architecture, auth middleware, CI/CD foundation, and the Angular application shell.
*   **Phase 2 (CRM Module):** Introduces operational business features like customer management, deal pipelines, and AI lead scoring.
