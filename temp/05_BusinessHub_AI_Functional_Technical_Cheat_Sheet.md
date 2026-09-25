# BusinessHub AI --- Functional to Technical Cheat Sheet

## 1. Purpose

This document provides a compact mapping between the business
capabilities explicitly described in the supplied Master Reference and
the technical mechanisms associated with them.

It is intended for offline revision, onboarding, architecture
discussions, and interview preparation.

------------------------------------------------------------------------

## 2. Capability Map

  Business capability        Technical mechanism
  -------------------------- -------------------------------------------
  Workspace isolation        Multi-tenancy + `X-Organization-Id`
  Authentication             JWT + RS256
  Authorization              RBAC
  Billing                    Stripe subscriptions + plan enforcement
  CRM                        Leads, contacts, Kanban stages, ownership
  LMS                        Course/catalog separation + AI quizzes
  RAG                        Embeddings + pgvector + retrieval
  Async AI work              BackgroundTasks
  Distributed coordination   Redis locks
  API consistency            Global error handling
  Database evolution         Alembic
  Monitoring                 structlog + health endpoint
  Recovery                   Supabase PITR

------------------------------------------------------------------------

## 3. Auth Mapping

``` text
User credentials
      |
      v
/auth/login
      |
      v
JWT
      |
      v
Protected API
      |
      +--> Authorization
      |
      +--> Tenant context
```

------------------------------------------------------------------------

## 4. CRM Mapping

Business concepts identified by the source:

-   leads
-   contacts
-   Kanban stage tracking
-   lead scoring
-   ownership

A key access rule is that standard users can modify CRM deals explicitly
assigned to them through `owner_user_id`.

------------------------------------------------------------------------

## 5. LMS Mapping

``` text
Author
  |
  +--> /courses
  |
  +--> Course content
       |
       v
Learner
  |
  +--> /catalog
  |
  +--> Quiz
       |
       v
80% passing requirement
```

The exact endpoint and permission matrix should be confirmed against the
authoritative functional/API specifications.

------------------------------------------------------------------------

## 6. Billing Mapping

``` text
Subscription
     |
     v
Stripe
     |
     v
Webhook
     |
     v
Signature verification
     |
     v
Subscription synchronization
     |
     v
Plan / AI credit enforcement
```

The source identifies:

``` text
BR-PLT-002
```

as the soft-lock overage business rule.

------------------------------------------------------------------------

## 7. RAG Mapping

``` text
Business action
      |
      v
Upload document
      |
      v
AiJob
      |
      v
Background task
      |
      v
Gemini embedding
      |
      v
1536-dimensional vector
      |
      v
pgvector
      |
      v
Retrieval
      |
      v
AI answer
```

------------------------------------------------------------------------

## 8. API Contract Mapping

### Protected request

``` http
Authorization: Bearer <token>
X-Organization-Id: <uuid>
```

### Authentication

``` http
POST /auth/login
```

### Onboarding

``` http
POST /auth/onboard
```

### AI upload

``` http
POST /ai/documents/upload
```

### Job polling

``` http
GET /api/v1/ai/jobs/{job_id}
```

### Billing webhook

``` http
POST /billing/webhooks
```

------------------------------------------------------------------------

## 9. Data Technology Mapping

  Data requirement         Technology
  ------------------------ ----------------------
  Business records         PostgreSQL
  Vector embeddings        pgvector
  ORM                      SQLAlchemy 2.0 Async
  DB driver                asyncpg
  Temporary coordination   Redis
  Migration management     Alembic

------------------------------------------------------------------------

## 10. Security Mapping

``` text
Authentication
      ↓
JWT / RS256
      ↓
Authorization
      ↓
RBAC
      ↓
Tenant context
      ↓
Tenant-scoped data
      ↓
Webhook signature verification
```

The layers address different security questions and should not be
treated as interchangeable.

------------------------------------------------------------------------

## 11. Frontend Mapping

The source identifies:

``` text
Angular 19
Standalone Components
Signals
Tailwind / dark-scoped UI
Vercel
```

The frontend communicates with the FastAPI backend through HTTPS/REST.

------------------------------------------------------------------------

## 12. Backend Mapping

The source identifies:

``` text
FastAPI
Python 3.11
SQLAlchemy 2.0 Async
asyncpg
BackgroundTasks
Redis
Pydantic validation
Global exception handling
```

------------------------------------------------------------------------

## 13. Deployment Mapping

``` text
Angular
  → Vercel

FastAPI
  → Render

PostgreSQL + pgvector
  → Supabase

Redis
  → Render

AI
  → Google Gemini
```

------------------------------------------------------------------------

## 14. Business-to-Technical Explanation Pattern

When asked how a feature is implemented, explain it in this order:

``` text
Business requirement
       ↓
API boundary
       ↓
Authentication / authorization
       ↓
Tenant context
       ↓
Service logic
       ↓
Persistence / external integration
       ↓
Async processing if required
       ↓
Response / job status
       ↓
Operational monitoring
```

This creates a complete explanation instead of describing only the UI or
database.

------------------------------------------------------------------------

## 15. Final Revision Matrix

  Topic          Remember
  -------------- ---------------------------
  Platform       Multi-tenant SaaS
  Frontend       Angular 19
  Backend        FastAPI
  Database       Supabase PostgreSQL 16
  Vector         pgvector, 1536 dimensions
  AI             Gemini
  Async          BackgroundTasks
  Coordination   Redis
  Auth           JWT / RS256
  Access         RBAC
  Tenant         `X-Organization-Id`
  Billing        Stripe
  Migration      Alembic
  Logging        structlog
  Health         `/api/v1/healthz`
  Recovery       Supabase PITR
