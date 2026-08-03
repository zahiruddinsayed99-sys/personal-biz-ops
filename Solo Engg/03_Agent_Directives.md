# Agent Engineering Conventions & Rules (`03_Agent_Directives.md`)

**Document Version:** 1.0.0

**Project Name:** BusinessHub AI

**Target Audience:** Autonomous AI Coding Agents (Google Antigravity, Jules, Copilot Workspace) & Human Developers

**Scope:** Universal Engineering Standards, Architecture Conventions, and Quality Gate Mandates

---

## 1. Core Operating Principles & Directives

All AI agents working on **BusinessHub AI** operate as **untrusted automated contributors**. You must adhere strictly to the following core directives:

1. **Non-Negotiable Human-in-the-Loop (HITL):** Never attempt to push directly to `main` or `develop` branches. All work must be delivered via an isolated git feature branch and submitted as a Draft Pull Request.


2. **Complete Context Preservation:** Do not introduce architectural patterns, dependencies, or structural changes that violate the baseline specs (`BusinessHub_Enhanced.md`, Technical Specification Document, or SRS).


3. **No Hallucinated Packages:** Do not add third-party dependencies (`pip` or `npm`) without explicit instruction or approval in the assigned GitHub Issue.


4. **Zero-Tolerance Quality Gates:** Any pull request with failing lint checks, broken type checks (`mypy`, TypeScript), unhandled exceptions, or missing tests will be automatically rejected by CI gates.



---

## 2. Naming & Style Conventions

Adhere strictly to standard naming conventions across all layers of the stack:

| Entity / Asset Layer | Naming Convention | Example |
| --- | --- | --- |
| **Python Files & Packages** | `snake_case` | `tenant_middleware.py`, `crm_deal_repository.py` |
| **Python Classes** | `PascalCase` | `TenantContextMiddleware`, `CrmDealService` |
| **Python Functions / Methods** | `snake_case` | `get_deal_by_id()`, `calculate_lead_score()` |
| **Database Tables & Columns** | `snake_case` (plural tables) | `crm_deals`, `organization_id`, `created_at` |
| **Angular Components / Directives** | `kebab-case.component.ts` | `deal-pipeline.component.ts` |
| **Angular Component Classes** | `PascalCase` + Suffix | `DealPipelineComponent`, `AuthInterceptor` |
| **Angular Signals & Variables** | `camelCase` | `activeTenant = signal<Organization | null>(null)` |
| **TypeScript Interfaces / Types** | `PascalCase` (No `I` prefix) | `CrmDeal`, `TenantUserContext` |
| **API Endpoints** | `kebab-case` (plural nouns) | `/api/v1/crm/deals`, `/api/v1/ai/rag-query` |
| **Git Branches** | `track/issue-id-short-desc` | `ai/issue-12-tenant-middleware` |

---

## 3. Backend Engineering Standards (FastAPI, SQLAlchemy 2.x, Pydantic v2)

### 3.1 Architecture & Layer Responsibilities

Follow a **Clean Architecture** pattern. Dependencies must flow **inward only**:

$$\text{API Controllers / Routes} \longrightarrow \text{Application Services} \longrightarrow \text{Domain Logic / Models} \longleftarrow \text{Repositories}$$

```
app/
├── api/v1/          # HTTP Controllers: Parsing requests, response formats, route definitions
├── domain/          # Core Business Logic: Pure domain rules, entities, state changes
├── services/        # Orchestration: Multi-repository assembly, external API integrations
├── repositories/    # Data Access: Async SQLAlchemy queries and persistence operations
├── schemas/         # DTOs: Pydantic v2 request/response validation schemas
└── core/            # Infrastructure: Security, JWT, middleware, global configuration

```

* **MUST:** Keep API endpoints thin. Route functions must only handle request parsing, dependency injection, service calls, and returning HTTP responses.
* **MUST:** Use **SQLAlchemy 2.0 async syntax** (`select()`, `scalars()`, `execute()`) with `AsyncSession`. Legacy `session.query()` syntax is strictly forbidden.
* **MUST:** Use **Pydantic v2** for all Data Transfer Objects (DTOs), using `model_config = ConfigDict(from_attributes=True)` for ORM mapping.
* **AVOID:** Putting raw SQL or database queries inside API routes or domain services. Database operations belong exclusively in the `repositories/` layer.

### 3.2 FastAPI Controller & Service Template

#### Schema (`app/schemas/crm.py`)

```python
from pydantic import BaseModel, ConfigDict, Field, EmailStr
from uuid import UUID
from datetime import datetime
from decimal import Decimal

class DealCreateSchema(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    value: Decimal = Field(..., ge=0)
    currency: str = Field(default="USD", max_length=3)
    contact_email: EmailStr

class DealResponseSchema(DealCreateSchema):
    id: UUID
    organization_id: UUID
    stage: str
    lead_score: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

```

#### Repository (`app/repositories/crm_repository.py`)

```python
from uuid import UUID
from typing import Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.domain.crm.models import CrmDeal

class CrmDealRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, deal_id: UUID, organization_id: UUID) -> CrmDeal | None:
        stmt = select(CrmDeal).where(
            CrmDeal.id == deal_id,
            CrmDeal.organization_id == organization_id
        )
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create(self, deal: CrmDeal) -> CrmDeal:
        self.db.add(deal)
        await self.db.flush()
        await self.db.refresh(deal)
        return deal

```

---

## 4. Frontend Engineering Standards (Angular 20+, Signals, Standalone Components)

### 4.1 Angular Architecture Rules

* **MUST:** Use **Standalone Components** exclusively. NgModules are completely deprecated in this repository.


* **MUST:** Use **Angular Signals** (`signal()`, `computed()`, `effect()`) for local and shared component state management.


* **MUST:** Set `changeDetection: ChangeDetectionStrategy.OnPush` on **every** component.
* **MUST:** Inject dependencies using the `inject()` function instead of constructor injection.
* **AVOID:** Manual `.subscribe()` calls in components. Use `toSignal()` or the `async` pipe when working with RxJS streams.



### 4.2 Angular Component Template (`deal-list.component.ts`)

```typescript
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CrmService, Deal } from '../../services/crm.service';

@Component({
  selector: 'app-deal-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Pipeline Deals ({{ totalValue() | currency }})</h2>
      @if (loading()) {
        <p>Loading pipeline data...</p>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          @for (deal of deals(); track deal.id) {
            <mat-card>
              <mat-card-header>
                <mat-card-title>{{ deal.title }}</mat-card-title>
                <mat-card-subtitle>{{ deal.contact_email }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content class="mt-2">
                <p class="text-lg font-semibold">{{ deal.value | currency:deal.currency }}</p>
                <span class="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                  {{ deal.stage }}
                </span>
              </mat-card-content>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealListComponent {
  private readonly crmService = inject(CrmService);

  readonly deals = signal<Deal[]>([]);
  readonly loading = signal<boolean>(true);

  readonly totalValue = computed(() =>
    this.deals().reduce((acc, deal) => acc + Number(deal.value), 0)
  );

  constructor() {
    this.loadDeals();
  }

  private async loadDeals(): Promise<void> {
    try {
      const data = await this.crmService.getDeals();
      this.deals.set(data);
    } finally {
      this.loading.set(false);
    }
  }
}

```

---

## 5. Multi-Tenant Security & Tenant Isolation Rules

### 5.1 Enforcing Row-Level Isolation

* **MUST:** Include an `organization_id: UUID` foreign key on **every single database table** created (except system-wide global lookups).


* **MUST:** Extract tenant context via `TenantContextMiddleware` on every non-public HTTP request.


* **MUST:** Append `organization_id == current_user_organization_id` to every SQLAlchemy query. Never rely solely on primary keys (`id`) for lookup queries.



```python
# ❌ DANGEROUS: Vulnerable to cross-tenant data leakage
stmt = select(CrmDeal).where(CrmDeal.id == deal_id)

# ✅ MANDATORY: Strictly isolated by organization context
stmt = select(CrmDeal).where(
    CrmDeal.id == deal_id,
    CrmDeal.organization_id == request.state.organization_id
)

```

---

## 6. AI Platform Engineering Standards (RAG, Vector Search, Prompts)

### 6.1 Central AI Microservice Directives

* **MUST:** Route all LLM requests through the centralized AI Gateway (`app/domain/ai/`). Direct instantiation of OpenAI/Gemini SDKs in feature modules is forbidden.


* **MUST:** Pass `organization_id` as metadata during vector embedding creation and filter vector similarity queries by `organization_id` to prevent cross-tenant knowledge leaks.


* **MUST:** Format all LLM prompts using structured, versioned prompt templates stored in `app/domain/ai/prompts/`.

---

## 7. Database Migrations & Versioning (Alembic)

* **MUST:** Generate Alembic migration scripts for every database schema modification.
* **MUST:** Test both `alembic upgrade head` and `alembic downgrade -1` before opening a pull request.
* **MUST:** Use explicit constraint names for foreign keys, unique indexes, and primary keys.

```bash
# Command to auto-generate schema migration
alembic revision --autogenerate -m "add_crm_deals_table"

```

---

## 8. Git Workflow, CI/CD & Quality Gates

### 8.1 Branching & Commit Conventions

* **Branch Pattern:** `track/issue-number-short-description` (e.g., `ai/issue-42-add-lead-scoring`).


* **Commit Message Format (Conventional Commits):**
* `feat(crm): implement lead scoring algorithm endpoint`
* `fix(auth): correct refresh token cookie expiration time`
* `test(inventory): add unit tests for stock allocation logic`



### 8.2 Pre-Merge Checklist for AI Agents

Before marking any Pull Request as ready for review, the agent must verify:

```
[ ] Code meets Clean Architecture layer restrictions (No DB access in API routes)
[ ] All DB queries enforce `organization_id` tenant isolation
[ ] Unit test coverage on new files is >= 80%
[ ] `ruff check app/` and `mypy app/` report ZERO errors
[ ] `npm run lint` and `npm run build` pass without warnings
[ ] No secrets, API keys, or JWT tokens are committed in code
[ ] OpenAPI/Swagger endpoint descriptions are updated

```

---

## 9. Reusable Implementation Patterns

### 9.1 Standard API Response Wrapper

All FastAPI endpoints must return responses following this standardized shape:

```python
from typing import Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    status: str = "success" # "success" | "error"
    message: Optional[str] = None
    data: Optional[T] = None
    error_code: Optional[str] = None

```

---

## 10. Summary Classification Matrix

| Category | MUST FOLLOW (Mandatory) | RECOMMENDED (Best Practice) | AVOID (Forbidden) |
| --- | --- | --- | --- |
| **Architecture** | Clean Architecture boundaries & Layer isolation

 | Modular monolith domain packaging

 | Microservice splitting without need |
| **Multi-Tenancy** | `organization_id` on all entities & queries

 | Middleware state injection | Global queries missing tenant filters |
| **Frontend** | Angular 20+, Signals, Standalone Components

 | Angular Material + Tailwind styling

 | NgModules, `.subscribe()` in UI

 |
| **Backend** | Async SQLAlchemy 2.0, Pydantic v2

 | Repository-Service Pattern | Raw SQL in route handlers |
| **Security** | JWT Rotation, RBAC, SAST Scanning

 | Parameterized inputs | Committing secrets/keys

 |
