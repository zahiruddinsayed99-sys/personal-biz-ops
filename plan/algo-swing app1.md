# BusinessHub AI — Standard Operating Procedure (SOP): Production Module Development Workflow

**Document Owner:** Principal Architect

**Target Platform:** BusinessHub AI (Multi-Tenant Commercial SaaS)

**Architecture Style:** Modular Monolith | Clean Architecture | Lightweight Domain-Driven Design (DDD)

**Tech Stack:** Python 3.12, FastAPI (Pydantic v2), PostgreSQL 17, Redis 8, SQLAlchemy 2.x, Angular 20+ (Signals/Standalone), Docker Compose

---

## Phase 1: Architecture & Planning Blueprint

Before writing a single line of code or generating prompts, every new module (e.g., CRM, Inventory, Billing) must be modeled against the core modular monolith boundary.

```
┌───────────────────────────────────────────────────────────────────────┐
│                    API Gateway / Router Layer                         │
│         (FastAPI APIRouter — DTO Validation via Pydantic v2)          │
└───────────────────────────────────┬───────────────────────────────────┘
                                    │
┌───────────────────────────────────▼───────────────────────────────────┐
│                       Service / Domain Layer                          │
│     (Business Logic, DDD Aggregates, Orchestration, Event Pub/Sub)    │
└───────────────────────────────────┬───────────────────────────────────┘
                                    │
┌───────────────────────────────────▼───────────────────────────────────┐
│                          Repository Layer                             │
│     (SQLAlchemy 2.x Async — Data Access & Multi-Tenant Scoping)       │
└───────────────────────────────────┬───────────────────────────────────┘
                                    │
┌───────────────────────────────────▼───────────────────────────────────┐
│                         Persistence Layer                             │
│       (PostgreSQL 17 Database / Redis 8 Cache & Event Store)          │
└───────────────────────────────────────────────────────────────────────┘

```

### 1. Module Boundary & Lightweight DDD Definition

1. **Identify the Aggregate Root:** Define the primary domain entity that controls lifecycle consistency (e.g., `SalesOrder` in E-commerce, `Customer` in CRM).
2. **Define Bounded Context Boundaries:** Map out explicit cross-module dependencies. A module must never directly import SQLAlchemy models from another module; communication across boundaries occurs exclusively via:
* **Synchronous:** Module Service Interface (public-facing service contracts).
* **Asynchronous:** Redis 8 Event Streams (domain event publishing).


3. **Draft Schema & Alembic Migration Plan:**
* Design tables with mandatory multi-tenant isolation columns: `tenant_id` (UUID, Indexed), `created_at`, `updated_at`, `deleted_at` (soft delete support), and `version_uuid` (optimistic locking).
* Ensure Foreign Keys across tenant-scoped tables always compound-include `tenant_id`.



---

## Phase 2: Context Injection (Non-Negotiable Principles Checklist)

When preparing context for engineering execution (human or AI), enforce the following non-negotiable principles as a baseline prompt injection.

### Backend Checklist (Python 3.12 / FastAPI / SQLAlchemy 2.x)

* **Strict Clean Architecture Layering:** Routers only handle HTTP protocol and validation. Services encapsulate all business rules. Repositories handle exclusively data persistence.
* **Strict Type Safety (`MyPy --strict`):** All functions must have explicit parameter and return type hints. No `Any` typing permitted.
* **SQLAlchemy 2.x Async Syntax:** Exclusively use modern `select()`, `update()`, and `delete()` constructs with `AsyncSession`. Legacy `Query` usage is strictly forbidden.
* **Pydantic v2 Schemas (DTOs):** Absolute separation between ORM Models and REST API payloads. Use Pydantic `ConfigDict(from_attributes=True)` for outbound serialization.
* **Multi-Tenant Scoping:** Every repository method must enforce `.where(Model.tenant_id == current_tenant_id)` at the base query level.
* **Historical Integrity (Snapshotting):** Transactional records (e.g., invoices, order items, stock adjustments) must capture point-in-time pricing, descriptions, and tax rates as immutable snapshots—never rely on joins to mutable reference tables.

### Frontend Checklist (Angular 20+ / Material 3)

* **Standalone Architecture Exclusively:** Zero `NgModule` usage. All components, directives, and pipes must be standalone.
* **Reactive Signals:** State management and view binding must prioritize Angular Signals (`signal()`, `computed()`, `effect()`, `input()`, `output()`). RxJS is reserved for complex asynchronous streams and HTTP communication.
* **Strict Type Safety (No `any`):** TypeScript compiler must run with `noImplicitAny: true` and `strict: true`. Every API response must map to a strong interface.
* **Change Detection:** All components must explicitly set `changeDetection: ChangeDetectionStrategy.OnPush`.

---

## Phase 3: Execution — The Zero-Friction Prompt Template

Use the following standardized prompt template when instructing an AI Implementation Engineer to scaffold or implement any feature within BusinessHub AI.

```markdown
### TASK
Implement the [MODULE_NAME] -> [FEATURE_NAME] feature following Clean Architecture and Lightweight DDD.

### CONTEXT
- Platform: BusinessHub AI (Multi-tenant commercial SaaS).
- Architecture: Modular Monolith (Routers -> Services -> Repositories -> Models).
- Backend Stack: Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2.x (AsyncSession), PostgreSQL 17.
- Frontend Stack: Angular 20+ Standalone Components, Angular Signals, RxJS, Angular Material 3.
- Current Tenant ID Injection: Provided via FastAPI dependency `get_current_tenant()`.

### TECHNICAL REQUIREMENTS
1. **Database & Model (SQLAlchemy 2.x):**
   - Table name: `[TABLE_NAME]`
   - Required Columns: `id` (UUID PK), `tenant_id` (UUID FK, indexed), [SPECIFY_DOMAIN_COLUMNS], `created_at`, `updated_at`.
   - Historical Integrity: [SPECIFY_SNAPSHOT_FIELDS_IF_ANY, e.g., "Must freeze unit_price at time of creation"].

2. **Repository Layer (`[Module]Repository`):**
   - Implement async methods: `create`, `get_by_id_and_tenant`, `list_by_tenant`, `update`.
   - Enforce mandatory `tenant_id` filtering on all SELECT/UPDATE/DELETE queries.

3. **Service Layer (`[Module]Service`):**
   - Implement domain validation: [SPECIFY_BUSINESS_RULES, e.g., "Cannot cancel an order already marked as SHIPPED"].
   - Handle transaction boundaries and raise domain-specific exceptions.

4. **Router Layer (`[Module]Router`):**
   - Expose REST endpoints under `/api/v1/[module]/...`.
   - Use Pydantic v2 Request/Response DTO schemas.
   - Return appropriate HTTP status codes (201 Created, 200 OK, 400 Bad Request, 404 Not Found).

5. **Frontend (Angular 20+ Standalone Component):**
   - Create an Angular Material 3 interface for [FEATURE_VIEW, e.g., "Data Table with slide-out drawer for editing"].
   - Use Signal-based inputs/outputs and `ChangeDetectionStrategy.OnPush`.
   - Manage local component state using Signals (`signal`, `computed`).

### VERIFICATION EXPECTATIONS
- Generate unit test scaffolds for the Service Layer using `pytest` and `pytest-asyncio`.
- Ensure strict MyPy compliance (no unannotated definitions or `Any` types).

```

---

## Phase 4: Verification & Review — Definition of Done (DoD)

A module or feature is only accepted into `main` when it passes every gate in the DoD matrix.

### 1. QA & Testing Matrix

| Test Level | Tooling | Coverage Target | Mandatory Requirement |
| --- | --- | --- | --- |
| **Unit Testing** | `pytest`, `pytest-asyncio` | ≥ 85% Service Layer | Mock repository layer; verify business rules, edge cases, and state transitions. |
| **Integration Testing** | `pytest`, Testcontainers (PG 17) | 100% Repository & Router | Execute against real PostgreSQL containers; verify SQL queries and `tenant_id` isolation. |
| **Component Testing** | Angular Test Bed / Jasmine | ≥ 75% UI Components | Test signal reactivity, DOM rendering, and user input validation. |
| **E2E Testing** | Playwright | Critical User Journeys (CUJs) | Verify complete end-to-end flows (e.g., create order -> deduct stock -> render table). |

### 2. Automated Quality Gates (CI/CD Pipeline)

* **Backend Linting & Formatting:** `ruff check --fail-on-error` and `black --check .` must pass with zero warnings.
* **Static Type Verification:** `mypy --strict .` must pass with zero type errors.
* **Frontend Checks:** `ng lint`, `ng test --watch=false`, and `tsc --noEmit` must execute cleanly.
* **Security & Migration Check:** Alembic migrations must be idempotent; no schema drift allowed against models (`alembic check`).

### 3. Technical Debt Register Format

If tactical shortcuts are permitted during sprint execution, they must be recorded in `TECH_DEBT.md` within the module root:

```markdown
| Debt ID | Module | Type | Description | Remediation Plan | Severity | Target Release |
|---|---|---|---|---|---|---|
| TD-042 | Inventory | Perf | Missing Redis caching on real-time stock lookup | Implement cache-aside pattern with 60s TTL | Medium | v1.2.0 |

```

---

## Phase 5: Software Requirements Specification (SRS) Outline

Use the following structural template to maintain functional scale (200–300+ requirements) and treat BusinessHub AI as a commercial software product from day one.

```
================================================================================
                    BUSINESSHUB AI — MODULE SRS TEMPLATE
================================================================================

1. INTRODUCTION & SCOPE
   1.1 Module Executive Summary & Business Value
   1.2 Bounded Context Map & Event Dependencies
   1.3 Multi-Tenant Isolation Strategy & RBAC Matrix

2. FUNCTIONAL REQUIREMENTS BACKLOG (SRS-REQ-001 through SRS-REQ-300)
   ├── 2.1 Core Domain Entities & Lifecycle States (State Machines)
   ├── 2.2 Functional Requirements Table
   │    ├── REQ_ID: Uniquely identifiable requirement code (e.g., INV-REQ-014)
   │    ├── Feature Group: Sub-module categorization (e.g., Stock Allocation)
   │    ├── User Story / System Action: "As a [Role], I want to..."
   │    ├── Acceptance Criteria: Given/When/Then (Gherkin-compatible)
   │    ├── Tenant Scope: Globally shared reference vs. Strictly Tenant-Scoped
   │    └── Priority: MoSCoW (Must, Should, Could, Won't)
   └── 2.3 Historical Integrity & Auditing Matrix

3. API CONTRACTS & INTERFACE DEFINITIONS
   3.1 OpenAPI / Swagger Schema Conventions (REST v1)
   3.2 Synchronous Internal Service Interfaces (Python API Contracts)
   3.3 Asynchronous Domain Event Schema (Redis Pub/Sub Payload Definitions)
   3.4 Error Catalog & RFC 7807 Problem Details Mapping

4. DATA PERSISTENCE & SCHEMAS
   4.1 Entity Relationship Diagram (ERD) Textual Spec
   4.2 Multi-Tenant Partitioning & Indexing Strategy
   4.3 Snapshotting & Immutability Rules

5. PHASED IMPLEMENTATION BACKLOG
   ├── 5.1 Phase 1: MVP Core Architecture & Base Aggregates
   ├── 5.2 Phase 2: Inter-Module Integrations & Event Propagation
   └── 5.3 Phase 3: Advanced Optimization, Redis Cache-Aside, & Reporting
================================================================================

```

---

### Step-by-Step Execution Summary for a New Feature

1. **Plan:** Add functional requirements to the module's SRS (Section 2.2) and design the Clean Architecture DTO/Model schemas.
2. **Inject:** Load Phase 2's Non-Negotiable Checklist into your implementation prompt.
3. **Prompt:** Fill in Phase 3's Zero-Friction Prompt Template with the specific schema, business rules, and UI layout.
4. **Validate:** Execute the Phase 4 DoD matrix via CI/CD before submitting the Pull Request.
