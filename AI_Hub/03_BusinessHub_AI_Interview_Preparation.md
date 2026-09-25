# BusinessHub AI --- Interview Preparation Guide

## 1. Project Introduction

### 30-second answer

> BusinessHub AI is an enterprise-oriented multi-tenant SaaS platform
> combining authentication, billing, CRM, LMS, and RAG-powered AI. The
> frontend uses Angular 19 and the backend uses FastAPI with
> asynchronous SQLAlchemy. PostgreSQL with pgvector provides relational
> and vector persistence, Redis provides coordination, and Google Gemini
> provides embedding and generation capabilities.

### 2-minute answer

> The main engineering challenge is coordinating several business
> domains while maintaining tenant isolation and predictable API
> behavior. Every protected request carries JWT authentication and an
> organization identifier. The backend uses RBAC and tenant-scoped
> database access. CRM, billing, LMS, and AI capabilities share the same
> platform foundation.
>
> For AI document ingestion, the API creates an asynchronous job and
> returns a job identifier. Background processing generates embeddings
> and stores them in PostgreSQL using pgvector. Redis is used for
> distributed locking and related coordination. Stripe webhooks
> synchronize subscription changes. Operationally, the system uses
> Alembic migrations, structured logging, health checks, and Supabase
> PITR.

------------------------------------------------------------------------

## 2. Likely Interview Questions

### Q1. Why multi-tenancy?

**Answer:**

Multi-tenancy allows multiple organizations/workspaces to use the same
application infrastructure while keeping their data logically isolated.
The platform uses an organization identifier in protected requests and
tenant-scoped database operations.

------------------------------------------------------------------------

### Q2. How do you prevent cross-tenant access?

**Answer:**

The request includes `X-Organization-Id`, and the platform uses a tenant
context to scope database operations to the active organization. This is
combined with authentication and RBAC.

------------------------------------------------------------------------

### Q3. What is the difference between JWT authentication and RBAC?

**Answer:**

JWT authentication identifies the user and carries authenticated
identity information. RBAC determines which actions the authenticated
user is allowed to perform.

------------------------------------------------------------------------

### Q4. Why RS256?

**Answer:**

The supplied reference specifies RSA-based asymmetric JWT authentication
using RS256. Asymmetric signing separates the signing private key from
the public verification key, which is useful in architectures where
verification can be distributed.

------------------------------------------------------------------------

### Q5. Why use BackgroundTasks?

**Answer:**

The project intentionally avoids Celery for the described
short-to-medium asynchronous tasks. FastAPI BackgroundTasks combined
with Redis distributed locks provides the required background execution
and coordination without introducing Celery's additional operational
complexity.

------------------------------------------------------------------------

### Q6. Why Redis if PostgreSQL already exists?

**Answer:**

They serve different purposes. PostgreSQL is the durable business-data
store. Redis is used for fast operational coordination such as
distributed locks and rate-limiting primitives.

------------------------------------------------------------------------

### Q7. What is pgvector?

**Answer:**

`pgvector` extends PostgreSQL with vector storage and similarity-search
capabilities. In this platform it stores 1536-dimensional embeddings
used by the RAG workflow.

------------------------------------------------------------------------

### Q8. Explain the RAG pipeline.

**Answer:**

``` text
Upload document
→ create AiJob
→ background processing
→ Gemini embedding
→ 1536-dimensional vector
→ PostgreSQL/pgvector
→ retrieve relevant context
→ generate contextual response
```

------------------------------------------------------------------------

### Q9. Why is asynchronous processing useful for AI?

**Answer:**

Embedding generation and other AI operations may take longer than a
normal API transaction. Returning a job identifier allows the API to
acknowledge the request quickly while processing continues in the
background.

------------------------------------------------------------------------

### Q10. How does the client know the AI job is complete?

**Answer:**

The API provides a polling endpoint:

``` http
GET /api/v1/ai/jobs/{job_id}
```

The documented states include `PENDING`, `SUCCESS`, and `FAILURE`.

------------------------------------------------------------------------

### Q11. How is Stripe integrated?

**Answer:**

The platform receives Stripe subscription updates through a webhook
endpoint and verifies the `Stripe-Signature` before processing the
event.

------------------------------------------------------------------------

### Q12. How do billing rules affect the application?

**Answer:**

Billing is connected to plan enforcement. The reference describes Free
and Pro tiers, AI credit limits, and a soft-lock overage policy
identified as `BR-PLT-002`.

------------------------------------------------------------------------

### Q13. How do you operate database changes safely?

**Answer:**

Alembic is used for migrations. The reference emphasizes running
`alembic upgrade head` and ensuring downgrade routines are reversible
and tested on clean trial databases.

------------------------------------------------------------------------

### Q14. How do you monitor the application?

**Answer:**

The platform uses structured JSON logging with `structlog` and exposes a
health endpoint:

``` http
/api/v1/healthz
```

------------------------------------------------------------------------

### Q15. What happens if Redis restarts?

**Answer:**

The source treats Redis as ephemeral. Therefore, Redis should not be
considered the authoritative store for durable business state. The
database remains the durable source for business data.

------------------------------------------------------------------------

## 3. Scenario Questions

### Scenario: A user from Organization A requests a record belonging to Organization B.

Expected reasoning:

1.  Authenticate the user.
2.  Resolve the active organization.
3.  Apply tenant-scoped access.
4.  Ensure the query cannot return another organization's record.
5.  Return an appropriate error/not-found response according to the API
    contract.

------------------------------------------------------------------------

### Scenario: An AI ingestion job fails.

Expected reasoning:

1.  The job should be identifiable through its job ID.
2.  Background processing should record failure state.
3.  The polling endpoint should expose the final status.
4.  Logs should provide operational evidence for troubleshooting.
5.  The failure should not silently appear as successful ingestion.

------------------------------------------------------------------------

### Scenario: Stripe sends an invalid webhook.

Expected reasoning:

1.  Verify the Stripe signature.
2.  Reject the webhook if verification fails.
3.  Do not apply subscription state changes from an unverified request.
4.  Record useful operational information for troubleshooting.

------------------------------------------------------------------------

## 4. Architecture Trade-offs

  -----------------------------------------------------------------------
  Decision                Project approach        Engineering implication
  ----------------------- ----------------------- -----------------------
  Background jobs         FastAPI BackgroundTasks Simpler operational
                                                  model

  Coordination            Redis                   Distributed lock
                                                  capability

  Durable state           PostgreSQL              Persistent source of
                                                  truth

  Vector storage          pgvector                Keeps vector capability
                                                  inside PostgreSQL

  Authentication          RS256 JWT               Asymmetric signing

  Frontend                Angular 19              SPA architecture

  Hosting                 Vercel + Render +       Managed deployment
                          Supabase                model

  AI                      Gemini SDK              External AI capability
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 5. Interview Answer Pattern

For technical questions, use:

``` text
Problem
  ↓
Requirement
  ↓
Architecture decision
  ↓
Implementation mechanism
  ↓
Security / reliability consideration
  ↓
Operational impact
```

This keeps answers engineering-focused instead of listing technologies
without context.

------------------------------------------------------------------------

## 6. Rapid-Fire Revision

``` text
Framework       = FastAPI
Frontend        = Angular 19
Database        = Supabase PostgreSQL 16
Vector          = pgvector
Vector size     = 1536
Cache/locks     = Render Redis
AI              = Gemini
Embedding       = text-embedding-004
Generation      = gemini-2.0-flash
Auth            = JWT / RS256
Authorization   = RBAC
Tenant header   = X-Organization-Id
Migration       = Alembic
Logging         = structlog
Health          = /api/v1/healthz
Billing         = Stripe
Async           = BackgroundTasks
```
