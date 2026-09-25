# BusinessHub AI — Complete Developer Handbook

> **Personal Portfolio Project • Junior Developer Learning Guide • Skill Mastery • Interview Preparation**
>
> **Purpose:** This is the consolidated, readable handbook for understanding the BusinessHub AI project from business idea to architecture, implementation, testing, operations, and interview explanation.
>
> **Implementation baseline used in this handbook:** Angular 19, FastAPI, Python 3.11, SQLAlchemy 2.0 Async, PostgreSQL 16 / Supabase, pgvector, Redis, FastAPI `BackgroundTasks`, Gemini, Stripe, Alembic, Pytest, Angular unit testing, and Playwright.
>
> **Important:** Celery was considered in some earlier/reference material but was **not implemented** in the project. It is therefore not part of the implemented architecture described here.

---

## How to Use This Handbook

This is deliberately **not written like a formal enterprise specification**.

Read it as a journey:

```text
What did I build?
      ↓
Why did I build it?
      ↓
How does the system work?
      ↓
How does one request travel through it?
      ↓
How are users and tenants secured?
      ↓
How do CRM, LMS, Billing and AI work?
      ↓
How do I test it?
      ↓
How do I troubleshoot it?
      ↓
How do I explain it in an interview?
```

Look for these recurring boxes:

- **💡 Understand** — the concept in simple language
- **🔧 How it works** — implementation view
- **🧪 Test it** — verification idea
- **⚠️ Common mistake** — what can go wrong
- **🎯 Interview** — how to explain it

---

# Table of Contents

1. [Project Story](#1-project-story)
2. [Technology Stack](#2-technology-stack)
3. [Business Modules and Users](#3-business-modules-and-users)
4. [Architecture](#4-architecture)
5. [Request Lifecycle](#5-request-lifecycle)
6. [Authentication, RBAC and Multi-Tenancy](#6-authentication-rbac-and-multi-tenancy)
7. [Backend Architecture](#7-backend-architecture)
8. [PostgreSQL, SQLAlchemy and Alembic](#8-postgresql-sqlalchemy-and-alembic)
9. [Redis and Background Processing](#9-redis-and-background-processing)
10. [CRM](#10-crm)
11. [LMS](#11-lms)
12. [Billing and Stripe](#12-billing-and-stripe)
13. [Central AI Gateway and RAG](#13-central-ai-gateway-and-rag)
14. [Angular 19 Frontend](#14-angular-19-frontend)
15. [API Reference](#15-api-reference)
16. [Testing and Quality Engineering](#16-testing-and-quality-engineering)
17. [Manual QA and Security Testing](#17-manual-qa-and-security-testing)
18. [Operations and Troubleshooting](#18-operations-and-troubleshooting)
19. [Indian Business Case Studies](#19-indian-business-case-studies)
20. [Developer Skill-Mastery Matrix](#20-developer-skill-mastery-matrix)
21. [Interview Preparation](#21-interview-preparation)
22. [Project Explanation Scripts](#22-project-explanation-scripts)
23. [Consolidated Vocabulary](#23-consolidated-vocabulary)
24. [Quick Reference](#24-quick-reference)
25. [Final Developer Checklist](#25-final-developer-checklist)

---

# 1. Project Story

## 1.1 What is BusinessHub AI?

BusinessHub AI is a **multi-tenant SaaS business platform** that combines several business workflows into one application:

- Workspace and user management
- Authentication and RBAC
- Billing and subscriptions
- CRM
- Learning Management System (LMS)
- AI-generated quizzes
- Document ingestion
- Retrieval-Augmented Generation (RAG)
- AI-assisted business workflows

The central idea is simple:

> A business should be able to operate inside one secure workspace while using ordinary business software and AI capabilities without creating separate systems for every workflow.

The functional specification groups the application into Core/Auth, Billing, CRM, LMS, and RAG/Centralized AI. 

## 1.2 Why this is a useful portfolio project

This project is valuable because it demonstrates more than CRUD.

A typical CRUD portfolio application proves that a developer can:

```text
Frontend → API → Database
```

BusinessHub AI goes further:

```text
Frontend
   ↓
Authentication
   ↓
Tenant isolation
   ↓
RBAC
   ↓
Business rules
   ↓
Database transactions
   ↓
Redis coordination
   ↓
Background processing
   ↓
External AI
   ↓
Testing
   ↓
Production operations
```

That makes it useful as a **full-stack engineering learning project**.

## 1.3 What the project teaches

The project provides hands-on examples of:

- Modular monolith architecture
- Clean Architecture
- REST APIs
- FastAPI
- async SQLAlchemy
- PostgreSQL
- Redis
- JWT/RS256
- RBAC
- multi-tenancy
- background processing
- AI integration
- embeddings
- pgvector
- RAG
- Stripe webhooks
- concurrency protection
- Angular Signals
- optimistic UI
- automated testing
- security testing
- deployment and operations

---

# 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Angular 19 | SPA user interface |
| Frontend architecture | Standalone Components | Component organization without NgModules |
| Frontend state | Angular Signals | Reactive UI state |
| Rendering | OnPush | Efficient change detection |
| Backend | FastAPI | REST API and application layer |
| Runtime | Python 3.11 | Backend language/runtime baseline |
| ORM | SQLAlchemy 2.0 Async | Database access |
| Validation | Pydantic v2 | Request/response validation |
| Database | PostgreSQL 16 | Primary relational database |
| Vector search | pgvector | AI embedding storage/search |
| Database migrations | Alembic | Schema versioning |
| Cache/state | Redis | Sessions, locks, rate-limit primitives |
| Async work | FastAPI BackgroundTasks | Short/medium background operations |
| AI | Google Gemini | Generation and embeddings |
| Payments | Stripe | Subscription/billing integration |
| Backend hosting | Render | FastAPI deployment |
| Frontend hosting | Vercel | Angular deployment |
| Database hosting | Supabase | Managed PostgreSQL |
| Backend tests | Pytest | Unit/integration testing |
| Browser tests | Playwright | E2E testing |
| Angular tests | Karma/Jasmine | Frontend unit tests |

The technical specification explicitly defines Angular 19, FastAPI, async SQLAlchemy, PostgreSQL 16, pgvector, Redis and FastAPI BackgroundTasks. 

## 2.1 Important architecture decision: no Celery

Some supplementary documentation discusses Celery as a possible architecture pattern. That is **not the implemented project architecture**.

The actual technical specification states:

```text
FastAPI
   ↓
BackgroundTasks
   +
Redis distributed locks
```

Celery was intentionally removed from the application footprint.

Use this distinction in interviews:

> "For this portfolio project I deliberately kept asynchronous work lightweight by using FastAPI BackgroundTasks with Redis locks rather than introducing Celery."

---

# 3. Business Modules and Users

## 3.1 Core modules

```text
BusinessHub AI
│
├── Core / Authentication
├── Multi-Tenancy
├── Billing
├── CRM
├── LMS
└── Central AI / RAG
```

## 3.2 Tenant Owner / Admin

The Tenant Owner/Admin has broad organizational responsibilities:

- Onboard the workspace
- Manage users
- Manage billing
- Upgrade subscription
- Manage CRM
- Author LMS courses
- Trigger AI quiz generation
- Manage AI knowledge documents

## 3.3 Domain Member

A Domain Member is a normal workspace user.

Typical capabilities include:

- View organization contacts
- Modify only deals assigned to the user
- Browse LMS courses
- Read lessons
- Take quizzes
- Use organization-scoped RAG chat

The functional specification explicitly applies `owner_user_id` restrictions to Domain Member CRM deal updates.

## 3.4 System processes

Some operations are performed asynchronously:

- Document embedding
- AI quiz generation
- Stripe subscription synchronization
- Redis lock coordination

---

# 4. Architecture

## 4.1 Modular Monolith

The project intentionally uses a **Modular Monolith**.

That means:

> One deployable application, but internally separated into meaningful feature boundaries.

Conceptually:

```text
BusinessHub AI
│
├── Auth
├── Billing
├── CRM
├── LMS
└── AI
```

The reason is practical.

For a personal/small-team application, microservices would introduce:

- More deployments
- More network calls
- Distributed transaction problems
- More infrastructure
- More operational complexity

The modular monolith keeps deployment simple while preserving internal boundaries.

## 4.2 Clean Architecture

The basic flow is:

```text
HTTP Request
     ↓
FastAPI Router
     ↓
Service Layer
     ↓
Repository
     ↓
PostgreSQL
```

The important rule is:

> **Routers handle HTTP concerns. Services handle business logic. Repositories handle persistence.**

### Router

Responsible for:

- HTTP request
- authentication dependencies
- request DTOs
- response DTOs
- status codes

### Service

Responsible for:

- business rules
- orchestration
- transactions
- calls to repositories
- calls to external services where appropriate

### Repository

Responsible for:

- database queries
- persistence
- retrieval
- update/delete operations

## 4.3 High-level topology

```text
                    ┌─────────────────────┐
                    │    Angular 19 SPA   │
                    │ Standalone + Signals│
                    └──────────┬──────────┘
                               │ HTTPS / REST
                               │ JWT + Tenant ID
                               ▼
                    ┌─────────────────────┐
                    │    FastAPI API      │
                    │  Router → Service   │
                    │      → Repository   │
                    └───────┬───────┬─────┘
                            │       │
                  ┌─────────┘       └──────────┐
                  ▼                            ▼
        ┌──────────────────┐         ┌────────────────┐
        │ PostgreSQL 16    │         │ Redis          │
        │ + pgvector       │         │ Sessions/Locks │
        └──────────────────┘         └────────────────┘
                  │
                  ▼
             Gemini AI
```

The documented deployment topology places Angular on Vercel, FastAPI on Render, PostgreSQL on Supabase, and Redis as the ephemeral coordination/state layer.

---

# 5. Request Lifecycle

Understanding one request is more important than memorizing dozens of files.

Suppose a user calls:

```http
GET /api/v1/crm/deals
```

The request travels approximately like this:

```text
Angular
  │
  │ Authorization: Bearer <JWT>
  │ X-Organization-Id: <tenant>
  ▼
FastAPI
  │
  ├── JWT validation
  ├── Tenant validation
  ├── RBAC validation
  │
  ▼
Router
  │
  ▼
CRM Service
  │
  ▼
CRM Repository
  │
  ▼
PostgreSQL
  │
  ▼
Repository
  │
  ▼
Service
  │
  ▼
Router / DTO
  │
  ▼
Angular
```

## 5.1 Why this matters

When debugging a problem, trace the same path in reverse:

```text
Wrong UI?
   ↓
Check API response

Wrong API?
   ↓
Check service

Wrong service behavior?
   ↓
Check business rule

Wrong data?
   ↓
Check repository/database

Authorization failure?
   ↓
Check JWT / tenant / RBAC
```

This is one of the most transferable skills in the entire project.

---

# 6. Authentication, RBAC and Multi-Tenancy

## 6.1 Authentication vs Authorization

**Authentication:**

> Who are you?

**Authorization:**

> What are you allowed to do?

The project uses JWT-based authentication and role/permission checks.

## 6.2 RS256 JWT

The project uses asymmetric RSA signing:

```text
Private RSA Key
      ↓
Signs JWT

Public RSA Key
      ↓
Verifies JWT
```

This is useful because the private key is kept secret while the public key can be used for verification.

## 6.3 Dual-token lifecycle

The project documentation describes:

- Short-lived access token
- Longer-lived refresh token
- Redis-backed session tracking

Redis allows logout/session invalidation even though JWT itself is normally stateless.

## 6.4 RBAC

Role-Based Access Control maps users to permissions.

Examples:

```text
crm:read
crm:write
crm:delete
ai:write
```

A route can require a permission through a FastAPI dependency such as:

```text
RequiresPermission(...)
```

## 6.5 Multi-tenancy

A tenant is the organization/workspace.

The critical identifier is:

```text
organization_id
```

Every protected request carries:

```http
X-Organization-Id: <uuid>
```

The backend verifies that the authenticated user belongs to that organization.

## 6.6 Tenant isolation flow

```text
Request
   ↓
JWT
   ↓
User identity
   ↓
X-Organization-Id
   ↓
Tenant membership check
   ↓
TenantContext
   ↓
Tenant-scoped database query
```

A query must never accidentally become:

```sql
SELECT * FROM crm_deals;
```

when the correct logical scope is:

```sql
SELECT *
FROM crm_deals
WHERE organization_id = :current_org_id;
```

## 6.7 IDOR prevention

An attacker might guess another record's UUID.

The protection is not:

> "UUIDs are hard to guess."

The protection is:

> "Even if the UUID is known, the query remains tenant-scoped."

That is much stronger.

## 6.8 Security checklist

For every protected feature ask:

- Is the user authenticated?
- Is the tenant identified?
- Does the user belong to the tenant?
- Does the role have permission?
- Does the query include tenant scope?
- Does ownership need to be checked?
- Can a guessed UUID cross the tenant boundary?

---

# 7. Backend Architecture

## 7.1 Suggested structure

The technical documentation describes a structure along these lines:

```text
backend/
└── app/
    ├── api/
    │   └── routers/
    ├── core/
    │   ├── config
    │   ├── database
    │   ├── security
    │   ├── redis
    │   └── middleware
    ├── domain/
    │   ├── auth/
    │   ├── billing/
    │   ├── crm/
    │   ├── lms/
    │   └── ai/
    ├── tasks/
    └── main.py
```

## 7.2 Pydantic DTOs

DTOs define the API contract.

They provide:

- validation
- predictable request shape
- predictable response shape
- automatic OpenAPI documentation

Example concept:

```python
class DealCreate(BaseModel):
    title: str
    value_amount: Decimal
    currency: str
```

The DTO should not become the place for database persistence.

## 7.3 Service layer

A service should answer questions such as:

- Is this operation allowed?
- Is the user the owner?
- Is billing status sufficient?
- Does a stage transition satisfy business rules?
- Should an AI credit be consumed?
- Should a background task be created?

## 7.4 Repository layer

Repositories answer:

> How do I read/write this information?

They should not decide business policy.

This separation makes testing easier.

---

# 8. PostgreSQL, SQLAlchemy and Alembic

## 8.1 PostgreSQL

PostgreSQL is the primary source of record.

It stores:

- organizations
- users
- roles
- CRM data
- LMS data
- billing state
- AI jobs
- documents
- embeddings

## 8.2 SQLAlchemy 2.0 Async

The project uses modern SQLAlchemy syntax such as:

```python
select(...)
```

with asynchronous sessions.

The conceptual flow is:

```text
AsyncSession
    ↓
select()
    ↓
execute()
    ↓
scalars()
    ↓
entities
```

## 8.3 Foreign keys and tenant ownership

Tenant-owned records carry an organization relationship.

This allows the database model to support isolation consistently.

## 8.4 pgvector

`pgvector` extends PostgreSQL to store vector embeddings.

The project documents:

```text
Vector(1536)
```

for document embeddings.

## 8.5 Alembic

Alembic tracks database schema changes.

Common commands:

```bash
alembic upgrade head
```

Apply all migrations.

```bash
alembic downgrade -1
```

Roll back one migration.

A migration should have a reversible `downgrade()`.

---

# 9. Redis and Background Processing

## 9.1 What Redis does in this project

Redis is not the primary database.

It is used for:

- session state
- JWT/session TTL tracking
- distributed locks
- Stripe webhook coordination
- rate-limit primitives
- temporary coordination

## 9.2 BackgroundTasks

The project uses FastAPI `BackgroundTasks`.

Typical flow:

```text
POST /ai/documents/upload
       ↓
Create AiJob = PENDING
       ↓
Return 202 + job_id
       ↓
BackgroundTasks starts
       ↓
Redis lock
       ↓
Gemini
       ↓
PostgreSQL
       ↓
AiJob = SUCCESS
```

## 9.3 Why return 202?

AI work can take longer than a normal API request.

Instead of keeping the client waiting:

```text
Request
   ↓
Do everything
   ↓
Response
```

the application does:

```text
Request
   ↓
Create job
   ↓
202 Accepted
   ↓
Client polls job
```

## 9.4 Job states

The documented `AiJob` lifecycle includes:

```text
PENDING
   ↓
SUCCESS

or

PENDING
   ↓
FAILURE
```

The frontend polls:

```http
GET /api/v1/ai/jobs/{job_id}
```

## 9.5 Redis locks

A distributed lock helps prevent duplicate concurrent processing.

Conceptually:

```text
SET lock:key NX EX
```

If the lock is acquired:

```text
process job
```

Otherwise:

```text
another process is already handling it
```

---

# 10. CRM

## 10.1 What CRM does

The CRM module manages:

- contacts
- deals
- sales stages
- ownership
- AI lead scoring

## 10.2 Deal lifecycle

A documented sales pipeline is:

```text
LEAD
  ↓
QUALIFIED
  ↓
PROPOSAL
  ↓
CLOSED_WON
```

or:

```text
PROPOSAL
  ↓
CLOSED_LOST
```

## 10.3 Ownership

Domain Members cannot freely modify every deal.

The backend verifies:

```text
deal.owner_user_id
        ==
authenticated_user.id
```

where required.

## 10.4 Kanban UI

The Angular UI presents stages visually.

The project uses optimistic UI:

```text
User drags card
      ↓
UI changes immediately
      ↓
PATCH API request
      ↓
Success → keep state

Failure → rollback previous state
```

This makes the application feel responsive while still maintaining backend authority.

## 10.5 AI lead scoring

The AI gateway can calculate lead intent/score from business information.

The important architectural point is:

```text
CRM
  ↓
AI Gateway
  ↓
Gemini
```

rather than allowing every CRM component to directly call Gemini.

---

# 11. LMS

## 11.1 LMS hierarchy

```text
Course
  ↓
Module
  ↓
Lesson
  ↓
Quiz
  ↓
Quiz Attempt
  ↓
Score
  ↓
Certificate
```

## 11.2 Author vs learner APIs

The API separates:

```text
/courses
```

for authoring and:

```text
/catalog
```

for learner access.

This reduces RBAC collisions.

## 11.3 Course authoring

Authorized users can:

- create courses
- create lessons
- publish learning content
- trigger AI quiz generation

## 11.4 AI quiz generation

The flow is:

```text
Lesson
  ↓
Generate Quiz
  ↓
AiJob = PENDING
  ↓
BackgroundTasks
  ↓
Gemini
  ↓
Quiz + Questions
  ↓
AiJob = SUCCESS
```

## 11.5 80% passing rule

The documented business rule is:

> Learners must achieve at least 80%.

Example:

```text
5 questions
4 correct
= 80%
= Pass
```

Below 80%:

```text
Fail
Certificate remains locked
```

---

# 12. Billing and Stripe

## 12.1 Subscription model

The project uses Free/Pro subscription concepts.

The Free tier has a documented AI-credit limit:

```text
100 AI credits / month
```

## 12.2 Soft-lock

Soft-lock is deliberately non-destructive.

When a tenant exceeds a plan constraint:

```text
Read access
    ↓
continues

Write operations
    ↓
blocked
```

The goal is to avoid deleting data simply because the subscription state changed.

## 12.3 Example

If a Free tenant has more active users than its allowed seat capacity:

```text
GET reports       → allowed
GET CRM           → allowed
GET LMS           → allowed

Create user       → 402
Create deal       → 402
AI operation      → 402
```

After the tenant returns within the allowed limit, write operations can resume.

## 12.4 Stripe webhook

Stripe sends events such as:

```text
customer.subscription.updated
customer.subscription.deleted
```

The backend:

```text
Stripe
  ↓
Webhook endpoint
  ↓
Signature validation
  ↓
Redis coordination/lock
  ↓
Database transaction
  ↓
Organization subscription state
```

## 12.5 Idempotency mindset

External systems can retry.

Therefore webhook handling must assume:

```text
same event
same event
same event
```

may arrive more than once.

The system should not perform duplicate state-changing work.

## 12.6 Concurrency and TOCTOU

A classic bad pattern is:

```text
Check credits
    ↓
Do work
    ↓
Increment usage
```

Two requests can both pass the check.

A safer pattern is atomic database logic:

```text
UPDATE ...
WHERE usage + cost <= limit
RETURNING ...
```

The database decides whether the operation succeeds.

---

# 13. Central AI Gateway and RAG

## 13.1 Why a central AI gateway?

Instead of:

```text
CRM → Gemini
LMS → Gemini
RAG → Gemini
```

the architecture encourages:

```text
CRM ─┐
LMS ─┼──→ AI Gateway → Gemini
RAG ─┘
```

Benefits:

- one integration boundary
- centralized prompts
- centralized credit handling
- easier testing
- easier provider changes
- consistent error handling

## 13.2 What is RAG?

RAG means:

> Retrieval-Augmented Generation.

Instead of asking the AI model to answer from general knowledge alone:

```text
Question
   ↓
Gemini
   ↓
Answer
```

the application first retrieves relevant tenant-owned documents:

```text
Question
   ↓
Vector Search
   ↓
Relevant Context
   ↓
Gemini
   ↓
Grounded Answer
```

## 13.3 Document ingestion

The project flow is:

```text
Document
   ↓
POST /ai/documents/upload
   ↓
Create OrganizationDocument
   ↓
Create AiJob(PENDING)
   ↓
BackgroundTasks
   ↓
Redis lock
   ↓
Gemini embedding
   ↓
1536-dimensional vector
   ↓
PostgreSQL pgvector
   ↓
AiJob(SUCCESS)
```

## 13.4 RAG query

```text
User question
      ↓
Tenant context
      ↓
Vector similarity search
      ↓
Only current organization's documents
      ↓
Relevant context
      ↓
Gemini generation
      ↓
Answer
```

## 13.5 The most important security rule

RAG must be tenant-aware.

Bad:

```sql
SELECT documents
ORDER BY similarity
LIMIT 5;
```

Good concept:

```sql
SELECT documents
WHERE organization_id = :current_org
ORDER BY similarity
LIMIT 5;
```

Otherwise one tenant could retrieve another tenant's knowledge.

## 13.6 Embeddings

An embedding converts content into a numerical vector.

Conceptually:

```text
"GST invoice deadline"
        ↓
[0.012, -0.228, 0.991, ...]
```

Semantically related text produces vectors that can be compared using similarity measures.

---

# 14. Angular 19 Frontend

## 14.1 Standalone Components

The frontend uses Angular 19 Standalone Components rather than an NgModule-heavy structure.

A component imports the dependencies it needs directly.

## 14.2 Signals

Signals provide reactive state.

Conceptually:

```typescript
deals = signal<Deal[]>([]);
```

Derived state:

```typescript
qualifiedDeals = computed(() =>
  this.deals().filter(d => d.stage === 'QUALIFIED')
);
```

## 14.3 OnPush

`ChangeDetectionStrategy.OnPush` reduces unnecessary UI work.

The project combines OnPush with Signals for reactive UI updates.

## 14.4 HTTP interceptor

The frontend needs to send:

```http
Authorization: Bearer <token>
X-Organization-Id: <organization>
```

A functional interceptor can add these automatically.

## 14.5 Route guards

Route guards protect frontend navigation.

The project also encountered token/navigation timing issues, so the documented stabilization strategy includes ensuring token state is written before navigation.

## 14.6 Optimistic UI

For CRM stage changes:

```text
Previous state
      ↓
Update UI immediately
      ↓
API call
      ↓
Success → done
Failure → restore previous state
```

This is a UX technique, not a replacement for backend validation.

## 14.7 Markdown and XSS

AI-generated Markdown is rendered using Markdown tooling and sanitized with DOMPurify.

The important rule:

> Never trust generated HTML simply because it came from your own AI service.

---

# 15. API Reference

## 15.1 Base URL

Local:

```text
http://localhost:8000/api/v1
```

## 15.2 Protected headers

Most protected endpoints require:

```http
Authorization: Bearer <access_token>
X-Organization-Id: <organization_uuid>
```

Public authentication/onboarding and public Stripe webhook handling are exceptions.

## 15.3 Authentication

### Login

```http
POST /auth/login
```

JSON body:

```json
{
  "email": "admin@example.com",
  "password": "..."
}
```

### Self-service onboarding

```http
POST /auth/onboard
```

### Internal tenant onboarding

```http
POST /tenants/onboard
```

## 15.4 Billing

```http
POST /billing/checkout
POST /billing/webhooks
```

Webhook signature:

```http
Stripe-Signature: ...
```

## 15.5 CRM

```http
GET  /crm/contacts
POST /crm/contacts

GET  /crm/deals
POST /crm/deals
PATCH /crm/deals/{id}
```

Exact routes should be checked against the current API implementation when modifying the code.

## 15.6 LMS

Authoring:

```text
/api/v1/lms/courses
```

Learner catalog:

```text
/api/v1/lms/catalog
```

AI quiz:

```http
POST /lms/lessons/{id}/quiz
```

## 15.7 AI

Document upload:

```http
POST /ai/documents/upload
```

Job polling:

```http
GET /ai/jobs/{job_id}
```

RAG chat:

```http
POST /ai/chat
```

## 15.8 Standard errors

| Code | HTTP | Meaning |
|---|---:|---|
| `ERR_AUTH_001` | 401 | Missing/expired/revoked JWT |
| `ERR_TENANT_001` | 403 | Invalid/missing tenant membership |
| `ERR_RBAC_001` | 403 | Permission denied |
| `ERR_BILLING_001` | 402 | Billing/soft-lock limit |
| `ERR_VALIDATION_001` | 422 | Invalid request |
| `ERR_RATE_LIMIT_001` | 429 | Rate limit exceeded |
| `ERR_NOT_FOUND_001` | 404 | Entity not available in accessible scope |

---

# 16. Testing and Quality Engineering

## 16.1 Testing pyramid

```text
             E2E
            /   \
       Integration
        /        \
       Unit Tests
```

Each layer answers a different question.

### Unit

> Does this component/function work by itself?

### Integration

> Do multiple application layers work together?

### E2E

> Can a real user complete the workflow?

## 16.2 Backend Pytest

The project documented a stable backend suite of:

```text
39 / 39 passing
```

Key stabilization techniques:

- `NullPool`
- `db_cleanup`
- dependency overrides
- async fixtures
- `AsyncMock`
- isolated external AI calls

## 16.3 Why NullPool in tests?

Connection pooling can cause connections to survive between async test contexts.

Using:

```python
poolclass=NullPool
```

reduces connection reuse problems.

## 16.4 Database cleanup

A test cleanup fixture truncates tables after each test.

Conceptually:

```text
Test A
  ↓
Database
  ↓
cleanup

Test B
  ↓
clean database
```

This prevents test poisoning.

## 16.5 Mocking Gemini

Tests should not repeatedly call the real Gemini service.

Reasons:

- slow tests
- external dependency
- quota consumption
- nondeterministic output

Use `AsyncMock` to simulate AI responses.

## 16.6 Angular tests

The project uses headless Angular unit tests with Karma/Jasmine.

Example:

```bash
ng test --watch=false --browsers=ChromeHeadless
```

## 16.7 Playwright

Playwright validates complete browser workflows.

Important principle:

> Prefer stable selectors tied to application behavior rather than fragile CSS styling.

The documented suite targets Angular reactive controls such as:

```text
formControlName="email"
formControlName="password"
```

## 16.8 Critical E2E flows

The documented critical paths include:

1. Login and tenant bootstrap
2. CRM deal creation
3. CRM stage movement
4. LMS course enrollment
5. LMS quiz completion
6. RAG-related workflows

---

# 17. Manual QA and Security Testing

## 17.1 Happy path vs negative path

Good QA does not stop after:

```text
200 OK
```

For each feature ask:

```text
Happy path
+
Validation failure
+
Authentication failure
+
Authorization failure
+
Tenant isolation
+
Duplicate request
+
Boundary value
+
External dependency failure
```

## 17.2 Tenant security test

Attempt:

```http
X-Organization-Id: another-tenant
```

Expected behavior:

```text
403
ERR_TENANT_001
```

## 17.3 RBAC test

Authenticated user without permission:

```text
403
ERR_RBAC_001
```

## 17.4 Billing boundary test

Free plan exceeding its allowed limit:

```text
402
ERR_BILLING_001
```

## 17.5 Validation

Invalid input should produce:

```text
422
ERR_VALIDATION_001
```

## 17.6 Stripe webhook

Test:

- valid signature
- invalid signature
- repeated event
- out-of-order event
- malformed payload

## 17.7 RAG security

Test:

1. Tenant A uploads document.
2. Tenant B attempts to query it.
3. Tenant B must not receive Tenant A's content.

This is one of the most important security tests in the project.

---

# 18. Operations and Troubleshooting

## 18.1 Migrations

Apply:

```bash
alembic upgrade head
```

Rollback one:

```bash
alembic downgrade -1
```

Always verify that downgrade operations are reversible.

## 18.2 Health check

```text
GET /api/v1/healthz
```

Use this as a basic application responsiveness check.

## 18.3 Logging

The project uses structured JSON logging with `structlog`.

Useful production debugging questions:

- When did the failure happen?
- Which user?
- Which tenant?
- Which endpoint?
- Which job ID?
- Which error code?
- Did Redis lock acquisition succeed?
- Did the external AI/payment provider respond?

## 18.4 Redis failure

Redis is treated as ephemeral.

A Redis restart can affect:

- sessions
- locks
- currently executing background coordination

The PostgreSQL database remains the primary persistent store.

## 18.5 Database recovery

Supabase Point-in-Time Recovery (PITR) is documented for production database recovery.

## 18.6 Secrets

Never commit:

```text
.env
RSA private keys
temporary PEM files
Stripe secrets
Gemini API keys
```

Production secrets belong in the deployment platform's secret/environment configuration.

## 18.7 JWT key rotation

If RSA JWT keys are compromised:

```text
Generate new key pair
       ↓
Update environment variables
       ↓
Restart backend
       ↓
Existing sessions become invalid
```

## 18.8 Common failures

| Symptom | Likely cause | Investigation |
|---|---|---|
| 401 | JWT/session | Check token + Redis session |
| 403 | Tenant/RBAC | Check org membership + permission |
| 402 | Billing soft-lock | Check subscription/limits |
| 422 | DTO validation | Check request payload |
| 429 | Rate limit | Check Redis rate state |
| RAG job stuck | Background task/lock | Check `AiJob`, Redis, logs |
| Gemini 429 | External quota | Verify mocking in tests / provider quota |
| Event loop closed | Async resource reuse | Check Redis/test client lifecycle |
| Tests contaminate each other | Shared DB state | Check `db_cleanup` |
| AuthGuard loop | Token/navigation timing | Check storage before route navigation |

---

# 19. Indian Business Case Studies

These scenarios make the technical features easier to remember because they connect software to business.

## 19.1 Case Study — B2B Consulting / RAG

Problem:

A consulting business has internal SOPs, tax guidance and operational documents.

Solution:

```text
Documents
   ↓
Embeddings
   ↓
pgvector
   ↓
Tenant-scoped retrieval
   ↓
Gemini
   ↓
Grounded answer
```

Business lesson:

> RAG is useful when the answer must be grounded in company-specific knowledge.

## 19.2 Case Study — Solar EPC CRM

Scenario:

A solar EPC company manages high-value deals through long sales cycles.

The CRM represents:

```text
LEAD
 ↓
QUALIFIED
 ↓
PROPOSAL
 ↓
CLOSED_WON / CLOSED_LOST
```

AI can assist with:

- lead scoring
- intent signals
- follow-up drafts

The business rule prevents arbitrary closure without required proposal evidence.

## 19.3 Case Study — Regulatory Training LMS

Scenario:

Employees must complete regulatory training.

The system:

```text
Course
 ↓
Lesson
 ↓
AI Quiz
 ↓
Attempt
 ↓
80% threshold
 ↓
Certificate
```

The important lesson is that the AI feature is still governed by deterministic business rules.

AI creates content.

The backend decides whether the learner passed.

---

# 20. Developer Skill-Mastery Matrix

Use this as a self-assessment.

| Skill | Beginner | Working Developer | Mastery |
|---|---|---|---|
| FastAPI | Understand route | Build API | Design secure API boundaries |
| Pydantic | Define schema | Validate payloads | Design stable API contracts |
| SQLAlchemy | CRUD | Repository queries | Async transactions/concurrency |
| PostgreSQL | Tables/queries | Relationships | Indexing/transaction design |
| Alembic | Run migration | Write migration | Safely migrate/rollback |
| Redis | Know cache | Use key/value | Locks/session/rate coordination |
| JWT | Understand token | Implement auth | Secure token lifecycle |
| RBAC | Understand roles | Protect routes | Design permission boundaries |
| Multi-tenancy | Understand tenant | Scope queries | Threat-model isolation |
| Angular | Components | Build feature | Signals/performance architecture |
| RAG | Understand idea | Build retrieval | Tenant-safe production flow |
| Gemini | Call API | Integrate service | Centralize/test AI boundary |
| Stripe | Understand checkout | Implement webhook | Idempotent event processing |
| Testing | Write unit test | Integration testing | Isolation and E2E strategy |
| Playwright | Browser basics | Write workflow | Stable production E2E suite |
| Operations | Start app | Read logs | Diagnose production failures |

---

# 21. Interview Preparation

## 21.1 Junior-level questions

### What is FastAPI?

FastAPI is the Python web framework used to build the BusinessHub REST API, with request validation, dependency injection and OpenAPI support.

### What is SQLAlchemy?

SQLAlchemy is the Python database toolkit/ORM used to interact with PostgreSQL.

### What is JWT?

A signed token carrying authentication claims that the backend verifies.

### What is RBAC?

Role-Based Access Control. Users receive permissions based on their roles.

### What is Redis?

An in-memory data store used here for session state, distributed locks and coordination.

### What is RAG?

Retrieval-Augmented Generation: retrieve relevant knowledge first, then provide it as context to the AI model.

---

## 21.2 Developer-level questions

### Why Modular Monolith?

It keeps deployment and operations simple while preserving feature boundaries.

### Why Repository Pattern?

It separates persistence concerns from business logic and makes services easier to test.

### Why BackgroundTasks instead of Celery?

For this portfolio project, the asynchronous workloads are short/medium-lived. FastAPI BackgroundTasks plus Redis locks provides the required behavior without introducing another distributed worker system.

### Why pgvector?

It allows embeddings to live alongside normal PostgreSQL data and supports tenant-scoped vector retrieval.

### How does tenant isolation work?

The request identifies the organization, middleware validates membership, tenant context is established, and database operations are scoped to that organization.

---

# 22. Project Explanation Scripts

## 22.1 30-second version

> "BusinessHub AI is a multi-tenant SaaS portfolio project that combines CRM, LMS, billing and AI/RAG capabilities. The frontend is Angular 19 and the backend is FastAPI with async SQLAlchemy and PostgreSQL. I used a modular-monolith architecture with a clear Router → Service → Repository separation. Security is based on RS256 JWT authentication, RBAC and tenant isolation using organization-scoped queries. Redis handles session state and distributed locks, while FastAPI BackgroundTasks handles asynchronous AI work. Gemini and pgvector provide the AI/RAG capabilities, Stripe handles subscriptions, and the project is covered by Pytest, Angular tests and Playwright."

## 22.2 Two-minute version

> "The project is designed as a multi-tenant business platform where each organization gets an isolated workspace. The major modules are authentication, billing, CRM, LMS and centralized AI/RAG.
>
> Architecturally I chose a modular monolith instead of microservices because the project benefits from simple deployment while still maintaining strict internal boundaries. The backend follows a Router → Service → Repository pattern. FastAPI handles the API, SQLAlchemy 2.0 Async handles PostgreSQL access, and Redis provides session and coordination capabilities.
>
> Security is a major part of the design. Authentication uses RS256 JWTs, authorization uses RBAC, and every protected request carries an organization identifier. Tenant membership is validated before database operations are performed, and queries remain tenant-scoped to prevent IDOR and cross-tenant data access.
>
> AI operations use Gemini. Documents are embedded into 1536-dimensional vectors stored using pgvector. The application creates an AiJob, performs the embedding work through FastAPI BackgroundTasks, uses Redis locks to avoid duplicate processing, and allows the frontend to poll the job status.
>
> CRM provides contacts, deals, stages and AI lead scoring. LMS provides course/lesson authoring and AI quizzes with an 80% passing rule. Stripe handles subscription changes and webhooks. Testing uses Pytest with database isolation, AsyncMock for external AI calls, Angular unit tests and Playwright E2E workflows."

## 22.3 "Tell me about a difficult technical problem"

Use this structure:

```text
Problem
   ↓
Root cause
   ↓
Solution
   ↓
Why this solution
   ↓
Trade-off
   ↓
Result
```

Good project examples:

1. AI credit race conditions
2. Tenant isolation
3. Background job duplication
4. Async test contamination
5. Redis/event-loop lifecycle
6. Stripe webhook retries
7. Angular authentication/navigation timing
8. Optimistic UI rollback

---

# 23. Consolidated Vocabulary

This is the quick-reference dictionary for the project.

## A

**ADR — Architectural Decision Record**  
A record explaining an important architectural decision and its trade-offs.

**Alembic**  
Database migration tool used to version and apply PostgreSQL schema changes.

**Angular Signals**  
Angular reactive primitives such as `signal()` and `computed()` used for state and derived state.

**API**  
Application Programming Interface; the contract through which frontend and backend communicate.

**ASGI**  
Asynchronous Server Gateway Interface; the interface used by FastAPI/Uvicorn.

**AsyncSession**  
SQLAlchemy asynchronous database session used for non-blocking database operations.

**Atomic Check-and-Increment**  
A database operation that checks a condition and updates a value as one atomic operation, helping prevent race conditions.

## B

**BackgroundTasks**  
FastAPI's built-in mechanism for executing work after an HTTP response.

**Bearer Token**  
A token supplied in the `Authorization` header to authenticate a request.

## C

**Clean Architecture**  
An architectural approach that separates framework/API concerns from business logic and persistence.

**ContextVar**  
Python context-local storage used to carry request-specific tenant context safely through asynchronous execution.

**CRM**  
Customer Relationship Management; the project module for contacts, deals and sales workflows.

**CRUD**  
Create, Read, Update and Delete operations.

## D

**DTO — Data Transfer Object**  
A structured object used to transfer validated data between API boundaries and application layers.

**Distributed Lock**  
A lock shared through a coordination system such as Redis so multiple processes do not perform the same operation simultaneously.

## E

**Embedding**  
A numerical vector representation of content used for semantic similarity.

**E2E — End-to-End Testing**  
Testing a complete user workflow through the real application interface.

## G

**Gemini**  
The Google AI service used by the project for text generation and embeddings.

**GSTIN**  
Indian Goods and Services Tax Identification Number used for business tax identification.

## H

**HttpOnly Cookie**  
A cookie flag that prevents browser JavaScript from directly reading the cookie.

## I

**IDOR — Insecure Direct Object Reference**  
A vulnerability where a user can access another user's/tenant's object by changing an identifier.

**Integration Test**  
A test that verifies multiple application components working together.

## J

**JWT — JSON Web Token**  
A signed token carrying claims used by the application for authentication.

## K

**Kanban Deal Pipeline**  
Visual CRM representation of deals moving through sales stages.

## L

**LMS — Learning Management System**  
The module for courses, lessons, quizzes, learning and certification.

## M

**Modular Monolith**  
A single deployable application with clearly separated internal feature modules.

**Middleware**  
Code that runs around request processing and can perform cross-cutting tasks such as authentication and tenant resolution.

## N

**NullPool**  
SQLAlchemy configuration that disables connection reuse, particularly useful in tests to prevent async connection lifecycle problems.

## O

**OnPush**  
Angular change-detection strategy that reduces unnecessary component checking.

**Optimistic UI**  
Updating the UI immediately and rolling back if the backend operation fails.

**ORM — Object Relational Mapper**  
A library that maps application objects/classes to relational database records.

## P

**Pydantic**  
Python validation/modeling library used for API request and response schemas.

**pgvector**  
PostgreSQL extension that stores and searches vector embeddings.

**PITR — Point-in-Time Recovery**  
Database recovery capability allowing restoration to a previous point in time.

**Playwright**  
Browser automation framework used for end-to-end tests.

## R

**RAG — Retrieval-Augmented Generation**  
AI pattern where relevant application knowledge is retrieved and supplied to the generation model as context.

**RBAC — Role-Based Access Control**  
Authorization model where permissions are assigned through roles.

**Redis**  
In-memory data store used here for session state, locks, coordination and rate-limit primitives.

**Repository**  
Application layer responsible for persistence/data access.

**REST**  
API architectural style based on resources and HTTP operations.

**RS256**  
RSA-based asymmetric signing algorithm used for JWT signing/verification.

## S

**Service Layer**  
Application layer containing business rules and orchestration.

**Signal**  
Angular reactive state primitive.

**Soft Delete**  
Marking a record as deleted, commonly with `deleted_at`, rather than physically removing it.

**Soft Lock**  
Restricting new write operations because of a business-plan constraint while preserving existing readable data.

**Standalone Component**  
Angular component that manages its own imports without relying on an NgModule.

## T

**Tenant**  
An organization/workspace inside the multi-tenant application.

**Tenant Isolation**  
Ensuring one organization's data cannot be accessed by another organization.

**TenantContext**  
Request-scoped information identifying the active organization.

**TOCTOU — Time Of Check To Time Of Use**  
A race condition where a resource is checked and then changes before the operation uses it.

## V

**Vector**  
A numerical array representing content in embedding space.

**Vector Similarity Search**  
Finding vectors that are mathematically close to a query vector.

## W

**Webhook**  
An HTTP callback sent by an external service to notify the application about an event.

---

# 24. Quick Reference

## 24.1 Core request headers

```http
Authorization: Bearer <access_token>
X-Organization-Id: <organization_uuid>
Content-Type: application/json
```

## 24.2 Core commands

### Backend

```bash
cd backend
pytest tests/ -v
```

### Coverage

```bash
pytest --cov=app --cov-report=term-missing tests/
```

### Angular tests

```bash
cd frontend
ng test --watch=false --browsers=ChromeHeadless
```

### Playwright

```bash
cd e2e
npx playwright test
```

### Playwright UI

```bash
npx playwright test --ui
```

### Playwright report

```bash
npx playwright show-report
```

### Database migration

```bash
alembic upgrade head
```

### Database rollback

```bash
alembic downgrade -1
```

## 24.3 Core async flow

```text
POST request
   ↓
Create AiJob
   ↓
202 Accepted
   ↓
BackgroundTasks
   ↓
Redis lock
   ↓
Gemini
   ↓
PostgreSQL
   ↓
AiJob SUCCESS/FAILURE
   ↓
Frontend polling
```

## 24.4 Core security flow

```text
JWT
 ↓
User identity
 ↓
X-Organization-Id
 ↓
Membership validation
 ↓
RBAC
 ↓
Tenant-scoped query
 ↓
Response
```

## 24.5 Core architecture rule

```text
Router
  ↓
Service
  ↓
Repository
  ↓
Database
```

Remember:

> **Router = HTTP**  
> **Service = Business**  
> **Repository = Persistence**

---

# 25. Final Developer Checklist

Before saying "I understand BusinessHub AI", you should be able to explain all of these without opening another document.

## Architecture

- [ ] Why modular monolith?
- [ ] What is Clean Architecture?
- [ ] Why Router → Service → Repository?
- [ ] How does a request travel through the system?

## Security

- [ ] Authentication vs authorization
- [ ] JWT
- [ ] RS256
- [ ] RBAC
- [ ] Tenant isolation
- [ ] IDOR prevention
- [ ] `X-Organization-Id`

## Backend

- [ ] FastAPI
- [ ] Pydantic
- [ ] SQLAlchemy Async
- [ ] PostgreSQL
- [ ] Alembic
- [ ] Redis
- [ ] BackgroundTasks

## CRM

- [ ] Contacts
- [ ] Deals
- [ ] Ownership
- [ ] Pipeline stages
- [ ] AI scoring
- [ ] Optimistic UI

## LMS

- [ ] Courses
- [ ] Lessons
- [ ] Learner vs author
- [ ] AI quizzes
- [ ] 80% passing rule
- [ ] Certificates

## Billing

- [ ] Free/Pro
- [ ] AI credits
- [ ] Soft-lock
- [ ] Stripe Checkout
- [ ] Stripe webhooks
- [ ] Idempotency
- [ ] Concurrency

## AI

- [ ] Gemini
- [ ] AI Gateway
- [ ] Embeddings
- [ ] pgvector
- [ ] RAG
- [ ] AiJob
- [ ] Polling
- [ ] Tenant-scoped retrieval

## Frontend

- [ ] Angular 19
- [ ] Standalone Components
- [ ] Signals
- [ ] computed
- [ ] OnPush
- [ ] Interceptors
- [ ] Guards
- [ ] Optimistic UI
- [ ] DOMPurify

## Testing

- [ ] Unit tests
- [ ] Integration tests
- [ ] NullPool
- [ ] db_cleanup
- [ ] AsyncMock
- [ ] Angular tests
- [ ] Playwright
- [ ] Negative testing
- [ ] Tenant security tests

## Operations

- [ ] Alembic upgrade
- [ ] Alembic downgrade
- [ ] Health check
- [ ] Structured logs
- [ ] Redis failure implications
- [ ] PITR
- [ ] Secret management
- [ ] JWT key rotation

---

# Final Mental Model

If you remember only one diagram, remember this:

```text
                         BUSINESSHUB AI
                              │
                              ▼
                    ┌───────────────────┐
                    │    Angular 19     │
                    │ Signals / OnPush  │
                    └─────────┬─────────┘
                              │
                         HTTPS / REST
                              │
                              ▼
                    ┌───────────────────┐
                    │      FastAPI      │
                    │ Auth / Tenant/RBAC│
                    └─────────┬─────────┘
                              │
                     Router → Service
                              │
                              ▼
                    ┌───────────────────┐
                    │    Repository     │
                    └───────┬───────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
      ┌──────────────────┐       ┌─────────────────┐
      │ PostgreSQL 16    │       │     Redis       │
      │ + pgvector       │       │ Sessions/Locks  │
      └────────┬─────────┘       └─────────────────┘
               │
               ▼
        Tenant-scoped data

             AI path
               │
               ▼
        ┌──────────────┐
        │ AI Gateway   │
        └──────┬───────┘
               ▼
            Gemini
               │
               ▼
       Embeddings / RAG

             Async path
               │
               ▼
       FastAPI BackgroundTasks
               │
               ▼
            Redis Lock
               │
               ▼
            AiJob
               │
               ▼
         Frontend polling
```

The project can therefore be understood as five connected ideas:

```text
1. BUSINESS
   CRM + LMS + Billing

2. SECURITY
   JWT + RBAC + Tenant Isolation

3. ENGINEERING
   FastAPI + SQLAlchemy + PostgreSQL + Redis

4. AI
   Gemini + Embeddings + pgvector + RAG

5. QUALITY
   Pytest + Angular Tests + Playwright + QA
```

Once these five areas make sense, most of the project becomes a matter of tracing how they connect.

---

# Source Consolidation Note

This handbook consolidates the project's available reference material rather than simply concatenating the source files.

The source set included the original `Master Reference.md`, which indexed the project's original README, Functional Specifications, Technical Specifications, Functional/Technical Map, Architecture Framework, RUNBOOK and API Documentation, plus the later architecture/interview, vocabulary/competency, Indian business case, manual QA, code architecture and automated testing documents.

Repeated explanations were intentionally merged. Where the source documents contained architecture alternatives that were not implemented, this handbook follows the confirmed project baseline: **Angular 19 + FastAPI BackgroundTasks + Redis, with no Celery implementation**.

For actual code changes, the repository source code remains the authority for exact implementation details such as filenames, current function signatures and current endpoint behavior. This handbook is the consolidated knowledge/reference layer for learning, understanding, testing, operating and explaining the project.

---

# Closing Note

This project is more than a collection of technologies.

The real engineering lesson is the connection between:

```text
Business Requirement
        ↓
Business Rule
        ↓
Architecture
        ↓
API
        ↓
Service
        ↓
Repository
        ↓
Database / Redis / AI
        ↓
Frontend
        ↓
Tests
        ↓
Production Operations
```

That is the mindset to carry into your next project.

**Build it → understand it → test it → explain it.**
