## 1. AI-Augmented Software Architecture Process (The 5-Step Pipeline)

Aapko AI ko seedha `"Create CRM module"` nahi bolna hai. Har feature/module ko **5 distinct phases** se guzar kar build karna hai:

```
[ Phase 1: Context & Specs ]  --> Prompt NotebookLM / Antigravity for SRS & API Schema
         │
         ▼
[ Phase 2: Design & Data ]     --> Generate DB Schemas, Interfaces, & OpenAPI Contracts
         │
         ▼
[ Phase 3: Core Coding ]       --> Antigravity builds Core Logic (FastAPI + Angular)
         │
         ▼
[ Phase 4: Async Automation ]  --> Jules writes Unit Tests, DTOs, & Repositories (PR Mode)
         │
         ▼
[ Phase 5: Verification ]      --> Run Local Tests, CI/CD, & Audit Logs

```

---

## 2. Reusable Feature Implementation Template (The AI Prompt Blueprint)

Jab bhi aap koi naya Feature (e.g., *Phase 2: CRM - Leads*) start karein, bilkul is **Standardized Template Format** mein Antigravity / Jules ko prompt aur context dein:

> ### 📋 Feature Specification Prompt Template
> 
> 
> **1. Feature Domain:** `BusinessHub AI` -> `[Module Name: e.g., CRM]` -> `[Sub-feature: e.g., Lead Management]`
> **2. Architecture Boundary:**
> * **Backend Pattern:** FastAPI Clean Architecture (`domain/`, `services/`, `repositories/`, `schemas/`)
> * **Frontend Pattern:** Angular 20+ Standalone Component, Signals, Reactive Forms, Lazy Loaded
> * **Multi-tenancy Requirement:** Enforce `organization_id` on all DB queries and DB schemas.
> 
> 
> **3. Execution Tasks for AI Agent:**
> * **Step A (Database):** Create SQLAlchemy model with PostgreSQL `organization_id` FK, indexes, and migrations.
> * **Step B (Schemas):** Create Pydantic v2 schemas (`Create`, `Update`, `Response`).
> * **Step C (Service/Repository):** Implement CRUD operations with Async FastAPI. Enforce RBAC permissions (`crm:lead:write`).
> * **Step D (AI Integration):** Integrate Shared AI Service for `[e.g., Lead Summary Generation]`.
> * **Step E (Angular UI):** Create Angular Signals-based component with Material UI and RxJS for state management.
> 
> 
> **4. Constraints:**
> * Do not write monolithic code. Keep files under 200 lines.
> * Include typing everywhere (Python type hints & TypeScript strict mode).
> 
> 

---

## 3. Tool Allocation Strategy (Kaun Sa Tool Kab Aur Kaise Use Karein?)

Systematic division of labor se aapka laptop load free rahega aur quality production-grade rahegi:

| Layer / Stage | Primary AI Tool | Execution Workflow & Role |
| --- | --- | --- |
| **Architect & SRS Specs** | **NotebookLM** | Saare requirements, architecture docs, aur API schemas upload karke system design validation ke liye use karein. |
| **Active Development & Complex Code** | **Google Antigravity IDE** | Microservice structure, FastAPI endpoints, Angular Signal components, aur AI Shared Service integrate karne ke liye. |
| **Async Tasks, PRs & Refactoring** | **Jules (GitHub Agent)** | Background tasks: Unit tests (`pytest`), Cypress/Playwright E2E tests, Swagger docs formatting, aur code cleanup. |

---

## 4. Immediate Step-by-Step Execution Plan (Beginning Today)

Aap apne **BusinessHub AI** project ko setup karne ke liye inn exact steps ko follow karein:

### Step 1: Repository & Base Scaffold

1. GitHub par ek monorepo banayein: `businesshub-ai`.
2. Master branches set karein: `main`, `develop`.
3. Folder structure scaffold karein:
```text
businesshub-ai/
├── backend/             # FastAPI App (Clean Architecture)
├── frontend/            # Angular 20+ Standalone App
├── docker-compose.yml   # Postgres, Redis, MinIO setup
└── docs/                # Architecture & SRS

```



### Step 2: System Specs Artifact Generation

Antigravity mein pehla prompt chala kar exact artifacts generate karwayein:

1. **Database Schema ERD** (PostgreSQL multi-tenant tables for Auth, Users, Orgs, RBAC).
2. **OpenAPI / Swagger Spec** (`core-platform-api.yaml`).

### Step 3: Jules Workflow Test

* Project scaffold karne ke baad branch banayein: `feature/core-platform`.
* Jules ko command dein: *"Write unit tests for FastAPI JWT Authentication and Organization Middleware in `backend/tests/`"*.
* Jules ke Pull Request (PR) ko review karke `develop` branch mein merge karein.

Is systematic workflow se har module (CRM, E-Commerce, Inventory, LMS) ek hi exact pattern aur high standard par build hoga!
## 1. Laptop Drive Space Issue (C Drive Urgent Cleanup)

C Drive par **17 GB space bohot risky** hai (Docker aur WSL heavy cache create karte hain, jisse Windows crash ya slow ho sakta hai).

### Step-by-Step Space Recovery Action Plan:

1. **Docker Clean-up (Sabse bada space loss yahan hota hai):**
Terminal (CMD/PowerShell) mein ye command chalayein jo unused containers, images, aur build cache ko delete karega:
```bash
docker system prune -a --volumes -f

```


*(Isse easily 10–30 GB space reclaim ho jata hai).*
2. **WSL Disk Shrink:**
WSL ka `.vhdx` file size apne aap chota nahi hota jab aap files delete karte hain.
* Terminal (PowerShell as Admin) khol kar WSL stop karein:
```powershell
wsl --shutdown

```


* Open `diskpart` utility:
```powershell
diskpart
# diskpart window mein enter karein:
select vdisk file="C:\Users\<Your-User>\AppData\Local\Packages\CanonicalGroupLimited...\LocalState\ext4.vhdx"
compact vdisk

```




3. **Temp & Node Modules Cleanup:**
* Run command (Win + R) -> `%temp%` type karein -> Saari temp files delete karein.
* Purane / Inactive Node.js projects ke `node_modules` folders delete kar dein (Aap unhe `npm install` se kabhi bhi wapas la sakte hain).



> 💡 **Pro-Tip:** Agar aapke laptop mein D: or E: drive hai, toh **Docker Desktop Images** aur **WSL Location** ko secondary drive par shift kar dein.

---

## 2. NotebookLM Workspace System (Kitne Notebooks aur Kahan Kya?)

Aapke dono business goals + trading app + local system ke liye **4 Dedicated Notebooks** hone chahiye:

| Notebook Name | Primary Objective / Content | Sources to Upload |
| --- | --- | --- |
| **1. BusinessHub AI Architecture** | Core SaaS Platform Specs, Multi-Tenancy Architecture, FastAPI & Angular Standards. | `BusinessHub.md` doc, SRS documents, API Schemas, System Design specs. |
| **2. Swing Trading Automation** | Personal Algorithmic Trading Rules, Risk Management, Zerodha API Docs. | Zerodha Kite Connect Docs, Trading Strategy Rules (20 EMA, RSI), Python Script Snippets. |
| **3. AI Tooling & Prompt Engine** | Antigravity Prompts, Jules Workflows, Git rules, Terminal Commands. | Prompt Templates, Agent System Prompts, Terminal Setup Cheatsheets. |
| **4. Personal Business Ops & Ideas** | Market Research, Pricing Strategies, Freelance Proposals, Pitching. | Client proposal templates, Market analysis PDFs, Business plans. |

---

## 3. GitHub & Local Workspace Structure (Folder System)

Apne local machine aur GitHub ko exact **1:1 Mirroring** se manage karein:

### Local Disk Structure:

Create a folder in your largest drive partition (e.g., `D:\DevWorkspaces` or `C:\DevWorkspaces`):

```text
DevWorkspaces/
│
├── 01-Personal-Trading/
│   └── swing-trading-engine/       # Python + Zerodha Data Engine
│
├── 02-Commercial-SaaS/
│   └── businesshub-ai/             # Monorepo: FastAPI Backend + Angular Frontend
│
└── 03-Prototypes-Labs/
    └── ecommerce-legacy/           # Aapka current local e-commerce project

```

---

## 4. End-to-End Daily Workflow (Tools & Discussion Flow)

Kaam karte waqt confuse hone ke bajaye ye daily execution routine follow karein:

```
[ NotebookLM ] --------> [ AI Chat / Discussion ] --------> [ VS Code / Antigravity ] --------> [ Jules & GitHub ]
(Architecture Specs)      (Brainstorming with Gemini)       (Coding Core Logic)                 (Automated PRs & Tests)

```

1. **Planning Phase (NotebookLM + Gemini Chat):**
* Module ka rule ya business logic NotebookLM se retrieve karein.
* Gemini/Antigravity chat mein requirement refine karke exact task prompt banayein.


2. **Development Phase (VS Code / Antigravity IDE):**
* Feature branch kholein (`git checkout -b feature/crm-leads`).
* Antigravity Agents se core code/endpoints generate aur refine karwayein.


3. **Background Automation Phase (Jules Agent):**
* Unused/repetitive code updates, Unit testing, Docker setup, ya documentation ke liye task Jules ko assign karein.
* Jules PR (Pull Request) submit karega -> Review karein aur Merge karein.



---

## Aapke Next Steps:

1. Sabse pehle **`docker system prune -a --volumes`** chalayein taaki C: Drive ka 17 GB space immediate 30-40 GB tak khul jaye.
2. NotebookLM par upar bataye gaye **4 Notebooks** create kar lein.
