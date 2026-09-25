# BusinessHub AI --- Offline Master Reference

> **Purpose:** A structured, offline-readable reference for
> understanding, explaining, testing, and discussing the BusinessHub AI
> platform.
>
> **Source basis:** This document is an enhanced and reformatted version
> of the supplied `Master Reference.md`. Where the source provides
> explicit facts, those facts are preserved. Additional explanatory text
> is framed as interpretation rather than silently introduced as project
> facts.

------------------------------------------------------------------------

## 1. Platform at a Glance

**BusinessHub AI** is described as an enterprise-grade, multi-tenant
SaaS platform combining:

-   Workspace and organization management
-   Authentication and role-based access control
-   Billing and subscription enforcement
-   CRM workflows
-   Learning Management System (LMS)
-   Retrieval-Augmented Generation (RAG)
-   Centralized AI capabilities
-   Operational and deployment infrastructure

The central architectural idea is that multiple business capabilities
operate inside a shared, tenant-isolated platform rather than as
unrelated applications.

### Core technology stack

  -----------------------------------------------------------------------
  Layer                   Technology              Role
  ----------------------- ----------------------- -----------------------
  Frontend                Angular 19              SPA/UI

  Frontend architecture   Standalone Components + Component and state
                          Signals                 model

  UI styling              Tailwind / dark-scoped  Presentation
                          UI                      

  Frontend hosting        Vercel                  Web deployment

  Backend                 FastAPI                 REST API

  Backend runtime         Python 3.11             Application runtime

  ORM                     SQLAlchemy 2.0 Async    Database access

  Database                Supabase PostgreSQL 16  Relational persistence

  Vector search           pgvector                Embedding
                                                  storage/search

  Async work              FastAPI BackgroundTasks Background processing

  Coordination/cache      Render Redis            Locks, rate-limiting
                                                  primitives, webhooks

  AI                      Google Gemini SDK       Generation + embeddings

  Embeddings              `text-embedding-004`    Vector representation

  Generation              `gemini-2.0-flash`      AI generation
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 2. Document Map

The supplied reference identifies seven supporting documents.

  -----------------------------------------------------------------------
  Document                            Primary purpose
  ----------------------------------- -----------------------------------
  `README.md`                         Project overview, stack,
                                      prerequisites, local setup

  `Functional_Specifications.md`      Business functionality and
                                      role-wise flows

  `Technical_Specifications.md`       Backend, async processing,
                                      pgvector, security, CORS

  `Functional_Technical_Map.md`       Feature → route → model → service →
                                      frontend mapping

  `Architecture_Framework.md`         Topology, deployment, data flows,
                                      security perimeter

  `RUNBOOK.md`                        Day-2 operations, migrations,
                                      monitoring, DR, secrets

  `API_DOCUMENTATION.md`              API contracts, headers, errors,
                                      Stripe webhooks
  -----------------------------------------------------------------------

### How to use the document set

A useful reading sequence is:

1.  **README** --- understand what exists.
2.  **Functional Specifications** --- understand what the product does.
3.  **Architecture Framework** --- understand how major pieces connect.
4.  **Technical Specifications** --- understand implementation
    mechanisms.
5.  **Functional Technical Map** --- connect business behavior to
    code/API/UI.
6.  **API Documentation** --- learn external integration contracts.
7.  **RUNBOOK** --- learn how the deployed system is operated.

------------------------------------------------------------------------

## 3. Multi-Tenancy: The Central Security Concept

The platform requires organization-aware request processing.

For protected requests, the reference specifies:

``` http
Authorization: Bearer <token>
X-Organization-Id: <uuid>
```

The described `TenantContext` mechanism ensures that
application/database operations are scoped to the active organization.

### Conceptual request flow

``` text
Client
  |
  | Authorization + X-Organization-Id
  v
FastAPI
  |
  v
Authentication
  |
  v
Tenant Context
  |
  v
Tenant-scoped Service
  |
  v
Tenant-scoped Repository / Query
  |
  v
PostgreSQL
```

### Why this matters

Multi-tenancy is not merely a UI feature. It is a data-isolation
requirement. A request should not be able to accidentally retrieve or
modify records belonging to another organization.

The supplied reference explicitly excludes public onboarding and
webhooks from the normal protected-request requirement.

------------------------------------------------------------------------

## 4. Authentication and Authorization

The platform uses:

-   JWT authentication
-   RSA-based asymmetric signing
-   `RS256`
-   RBAC

The important conceptual distinction is:

**Authentication** answers:

> Who is making this request?

**Authorization** answers:

> What is this authenticated user allowed to do?

**Tenant isolation** answers:

> Which organization/workspace may this request access?

These are related but separate controls.

------------------------------------------------------------------------

## 5. Functional Modules

### 5.1 Core Foundation & Auth

Responsibilities described in the source:

-   Multi-tenant workspace isolation
-   RBAC
-   RSA JWT authentication

------------------------------------------------------------------------

### 5.2 Billing & Compliance

The platform integrates Stripe subscriptions and distinguishes Free and
Pro tiers.

The reference gives an example of:

-   Free-plan AI credit limits
-   Soft-lock overage policy
-   Business rule `BR-PLT-002`
-   Stripe webhook synchronization

The important architectural point is that billing state influences
feature access rather than being treated as a completely separate
subsystem.

------------------------------------------------------------------------

### 5.3 CRM

The CRM engine provides:

-   Lead management
-   Contact management
-   Kanban stage tracking
-   Smart lead scoring
-   Ownership-based modification rules

The source describes a standard user as being able to work with CRM
deals explicitly assigned through `owner_user_id`.

------------------------------------------------------------------------

### 5.4 LMS

The LMS separates:

-   Authoring endpoints such as `/courses`
-   Learner/catalog endpoints such as `/catalog`

It includes:

-   Course catalog
-   AI-generated quizzes
-   Mandatory 80% passing-grade logic
-   Role-sensitive authoring/learning flows

Business rule:

``` text
BR-LMS-001
```

------------------------------------------------------------------------

### 5.5 RAG and Centralized AI

The RAG capability consists conceptually of:

``` text
Document
   |
   v
Text ingestion
   |
   v
AiJob = PENDING
   |
   v
Background processing
   |
   v
Gemini embedding generation
   |
   v
1536-dimensional vector
   |
   v
PostgreSQL + pgvector
   |
   v
Context retrieval
   |
   v
AI response
```

------------------------------------------------------------------------

## 6. Asynchronous Processing

The project intentionally uses FastAPI `BackgroundTasks` rather than
Celery.

The supplied reference explains that Redis is paired with background
processing to provide distributed locking.

Conceptually:

``` text
API request
    |
    +--> create job record
    |
    +--> return job ID
    |
    +--> background task starts
             |
             +--> acquire Redis lock
             |
             +--> execute AI work
             |
             +--> persist result
             |
             +--> mark SUCCESS / FAILURE
```

This pattern is particularly suitable for the short-to-medium
asynchronous tasks explicitly described by the project.

------------------------------------------------------------------------

## 7. RAG Job State Model

The API reference identifies asynchronous job states including:

-   `PENDING`
-   `SUCCESS`
-   `FAILURE`

The client can use a polling endpoint:

``` http
GET /api/v1/ai/jobs/{job_id}
```

This creates a clear separation between:

1.  accepting a request,
2.  processing the work,
3.  retrieving final status.

------------------------------------------------------------------------

## 8. Database and Vector Architecture

The platform uses PostgreSQL through Supabase.

Vector functionality is provided through `pgvector`.

The reference specifies:

``` text
Vector dimension = 1536
```

and identifies the Gemini embedding model:

``` text
text-embedding-004
```

SQLAlchemy uses the asynchronous stack:

``` text
SQLAlchemy 2.0
      +
async_sessionmaker
      +
asyncpg
```

The migration scripts require the pgvector integration to be imported
where vector columns are created.

------------------------------------------------------------------------

## 9. Error Handling

The platform defines centralized error handling.

The source identifies:

-   Pydantic validation errors
-   HTTP exceptions
-   Uniform custom error payloads
-   Error identifiers such as:
    -   `ERR_VALIDATION_001`
    -   `ERR_BILLING_001`

A useful mental model is:

``` text
Application exception
        |
        v
Global error handler
        |
        v
Normalized API error
        |
        v
Frontend / API consumer
```

This reduces the need for every endpoint to invent its own error format.

------------------------------------------------------------------------

## 10. Deployment Topology

The supplied architecture can be summarized as:

``` text
                    Internet
                       |
              HTTPS / REST
                       |
              +----------------+
              | Angular SPA    |
              | Vercel         |
              +----------------+
                       |
                       v
              +----------------+
              | FastAPI API    |
              | Render         |
              +----------------+
                 |          |
                 |          |
                 v          v
        +---------------+  +---------------+
        | Supabase      |  | Render Redis  |
        | PostgreSQL    |  | Locks/cache   |
        | + pgvector    |  | primitives    |
        +---------------+  +---------------+
                 ^
                 |
          Google Gemini
        embeddings / AI
```

This diagram is a conceptual rendering of the topology stated in the
supplied reference.

------------------------------------------------------------------------

## 11. Role-Based Process Flows

### Tenant Owner / Admin

The source describes capabilities including:

-   Organizational control
-   Self-service or super-admin onboarding
-   Stripe upgrade flow
-   User invitations
-   Global CRM management
-   AI document knowledgebase management

### Domain Member / Standard User

The source describes:

-   Restricted workspace access
-   Organization contact visibility
-   Modification of CRM deals when explicitly assigned
-   LMS catalog usage
-   AI quiz usage
-   RAG chat usage

### System Processes

Automated processes include:

-   Vector embedding generation
-   AI quiz extraction
-   Stripe webhook subscription synchronization

------------------------------------------------------------------------

## 12. Operations

### Database migrations

Primary operation:

``` bash
alembic upgrade head
```

The source emphasizes that `downgrade()` routines should be reversible
and tested against clean databases.

### Health checks

``` http
GET /api/v1/healthz
```

### Logging

The platform uses structured JSON logging through `structlog`, with logs
captured on Render.

### Disaster recovery

The source identifies Supabase Point-in-Time Recovery (PITR) for
database rollback/recovery.

Redis is treated as ephemeral.

------------------------------------------------------------------------

## 13. API Quick Reference

### Local base URL

``` text
http://localhost:8000/api/v1
```

### Production base URL

``` text
https://businesshub-ai.onrender.com/api/v1
```

### Required protected-request headers

``` http
Authorization: Bearer <token>
X-Organization-Id: <uuid>
```

### Key endpoints

  Method   Endpoint                 Purpose
  -------- ------------------------ -------------------------------------
  POST     `/auth/login`            Authenticate user
  POST     `/auth/onboard`          Public workspace onboarding
  POST     `/ai/documents/upload`   Start document ingestion
  GET      `/ai/jobs/{job_id}`      Poll async AI job
  POST     `/billing/webhooks`      Receive Stripe subscription updates

------------------------------------------------------------------------

## 14. Interview Explanation Framework

When explaining the project, use this sequence:

### 1. What is it?

> BusinessHub AI is a multi-tenant SaaS platform combining CRM, LMS,
> billing, and RAG-powered AI capabilities.

### 2. What is technically interesting?

> The interesting engineering challenges are tenant isolation, RBAC,
> asynchronous AI processing, vector search, billing enforcement, and
> webhook synchronization.

### 3. How does a request work?

``` text
Client
→ Authentication
→ Tenant identification
→ Authorization
→ Service logic
→ Database / external integration
→ Normalized response
```

### 4. How does AI work?

``` text
Upload
→ Job
→ Background processing
→ Embedding
→ pgvector
→ Retrieval
→ Context-aware generation
```

### 5. How is production operation handled?

Mention:

-   migrations
-   structured logging
-   health checks
-   Redis coordination
-   PITR
-   secret management
-   webhook verification

------------------------------------------------------------------------

## 15. Important Distinctions to Remember

### Authentication vs Authorization vs Tenant Isolation

  Concept            Question
  ------------------ -------------------------------------------
  Authentication     Who are you?
  Authorization      What can you do?
  Tenant isolation   Which organization's data can you access?

### Synchronous vs Asynchronous work

Synchronous:

``` text
Request → Work → Response
```

Asynchronous:

``` text
Request → Job ID
             |
             +→ Background work
             |
             +→ Poll status
```

### Relational data vs vector data

Relational PostgreSQL data represents business entities and
relationships.

`pgvector` stores numerical vector representations used for semantic
retrieval.

------------------------------------------------------------------------

## 16. Source-Supported Facts vs Explanatory Elaboration

The original supplied reference is a consolidated guide rather than the
seven underlying documents themselves. Therefore, this offline package
should be treated as a **master orientation and interview/reference
layer**, not as a replacement for the authoritative individual
specifications.

Where an exact implementation detail is required, consult the
corresponding source document listed in the Document Map.

------------------------------------------------------------------------

## 17. Quick Revision Sheet

``` text
BusinessHub AI
│
├── Angular 19 / Vercel
│
├── FastAPI / Render
│
├── PostgreSQL 16 / Supabase
│   └── pgvector / 1536 dimensions
│
├── Redis / Render
│   └── locks + coordination primitives
│
├── Gemini
│   ├── text-embedding-004
│   └── gemini-2.0-flash
│
├── Auth
│   ├── JWT
│   ├── RS256
│   └── RBAC
│
├── Multi-Tenancy
│   └── X-Organization-Id
│
├── Business Modules
│   ├── Billing
│   ├── CRM
│   ├── LMS
│   └── RAG
│
└── Operations
    ├── Alembic
    ├── structlog
    ├── health checks
    └── PITR
```
