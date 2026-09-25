# BusinessHub AI --- Architecture Deep Dive

## 1. Purpose

This document expands the architecture information available in the
supplied Master Reference into an offline-readable engineering
explanation.

It focuses on **boundaries, request flow, data flow, asynchronous
processing, security, and deployment**.

------------------------------------------------------------------------

## 2. Logical Architecture

``` text
+-------------------------------------------------------------+
|                        Angular 19 SPA                       |
|              Standalone Components + Signals               |
+-----------------------------+-------------------------------+
                              |
                              | HTTPS / REST
                              v
+-------------------------------------------------------------+
|                       FastAPI Backend                       |
|                                                             |
|  Auth | Tenant Context | RBAC | Business Services | APIs   |
+----------------------+----------------------+---------------+
                       |                      |
                       |                      |
                       v                      v
             +------------------+    +----------------------+
             | PostgreSQL       |    | Redis                |
             | + pgvector       |    | Locks / coordination |
             +------------------+    +----------------------+
                       |
                       v
             +------------------+
             | Gemini AI        |
             | Embeddings / LLM|
             +------------------+
```

------------------------------------------------------------------------

## 3. Request Processing Model

A protected request can be understood as the following pipeline:

``` text
HTTP Request
    |
    +-- Authorization header
    |
    +-- X-Organization-Id
    |
    v
Authentication
    |
    v
Tenant Context
    |
    v
RBAC / permission checks
    |
    v
Application service
    |
    +---------> PostgreSQL
    |
    +---------> Redis
    |
    +---------> Gemini
    |
    v
Normalized response
```

The exact implementation may differ by endpoint; this is the conceptual
flow supported by the supplied architecture description.

------------------------------------------------------------------------

## 4. Multi-Tenant Boundary

The organization identifier is a critical request-level context value.

``` http
X-Organization-Id: <uuid>
```

The architectural goal is:

``` text
User
 |
 +--> Organization A --> permitted data
 |
 +--> Organization B --> permitted only when explicitly authorized
```

A service should not rely solely on frontend filtering to achieve this
isolation.

The source specifically describes tenant-scoped database queries through
`TenantContext`.

------------------------------------------------------------------------

## 5. RAG Architecture

### Ingestion

``` text
User uploads text
       |
       v
FastAPI
       |
       v
Create AiJob(PENDING)
       |
       v
BackgroundTasks
       |
       v
Redis distributed lock
       |
       v
Gemini embedding API
       |
       v
1536-dimensional vector
       |
       v
PostgreSQL / pgvector
       |
       v
AiJob(SUCCESS)
```

### Retrieval

Conceptually:

``` text
User question
     |
     v
Embedding / semantic representation
     |
     v
Vector similarity search
     |
     v
Relevant stored context
     |
     v
Gemini generation
     |
     v
Context-aware answer
```

------------------------------------------------------------------------

## 6. Why Redis Appears in the Architecture

The reference does not position Redis as the primary database.

Instead, it is used for operational coordination such as:

-   distributed locks
-   rate-limiting primitives
-   webhook-related coordination

A useful distinction is:

``` text
PostgreSQL = durable business state
Redis      = fast / ephemeral coordination state
```

The source explicitly treats Redis as ephemeral for disaster-recovery
purposes.

------------------------------------------------------------------------

## 7. Background Processing

The project uses:

``` text
FastAPI BackgroundTasks
```

rather than Celery.

The supplied explanation is that this avoids Celery complexity for the
described short-to-medium asynchronous workloads.

A typical job lifecycle is:

``` text
PENDING
   |
   v
PROCESSING
   |
   +-------> SUCCESS
   |
   +-------> FAILURE
```

Only `PENDING`, `SUCCESS`, and `FAILURE` are explicitly identified in
the API quick reference; `PROCESSING` is shown here as a conceptual
intermediate state and should not be assumed to be an API contract
unless confirmed in the authoritative API documentation.

------------------------------------------------------------------------

## 8. Security Layers

The reference identifies several security mechanisms:

### Layer 1 --- Authentication

JWT + RSA / RS256.

### Layer 2 --- Authorization

RBAC.

### Layer 3 --- Tenant isolation

`X-Organization-Id` + tenant-scoped access.

### Layer 4 --- Webhook verification

Stripe webhook requests use signature verification.

### Layer 5 --- Transport

HTTPS is used between the deployed frontend and backend.

------------------------------------------------------------------------

## 9. Error Architecture

``` text
Validation error
       |
HTTP exception
       |
Application exception
       |
       v
Global handler
       |
       v
Standard error payload
```

The reference gives examples such as:

``` text
ERR_VALIDATION_001
ERR_BILLING_001
```

This provides predictable client-side error handling.

------------------------------------------------------------------------

## 10. Deployment Model

### Frontend

``` text
Angular 19
    |
    v
Vercel
```

### Backend

``` text
FastAPI
    |
    v
Render
```

### Database

``` text
Supabase PostgreSQL 16
       |
       +--> pgvector
```

### Coordination

``` text
Render Redis
```

### AI

``` text
Google Gemini
```

------------------------------------------------------------------------

## 11. Architecture Review Checklist

When reviewing a change, ask:

-   Does the endpoint preserve tenant isolation?
-   Does authentication happen before protected business operations?
-   Is authorization checked at the appropriate boundary?
-   Is durable state stored in PostgreSQL?
-   Is Redis being used only for appropriate coordination/caching
    concerns?
-   Does an asynchronous operation expose a reliable job state?
-   Are database migrations reversible?
-   Are external webhook signatures verified?
-   Does the API return a consistent error shape?
-   Does the change preserve the existing API contract?

------------------------------------------------------------------------

## 12. One-Minute Architecture Explanation

> BusinessHub AI is a multi-tenant SaaS platform built around an Angular
> 19 frontend and FastAPI backend. The frontend is hosted on Vercel, the
> API on Render, and PostgreSQL with pgvector on Supabase. Requests
> carry JWT authentication and an organization identifier so backend
> operations can be tenant-scoped. Business data is persisted in
> PostgreSQL, while Redis provides operational coordination such as
> distributed locks. AI document ingestion is asynchronous: the API
> creates an AI job, a background task generates embeddings through
> Gemini, and the resulting 1536-dimensional vectors are stored in
> pgvector for retrieval. Stripe webhooks synchronize billing state,
> while centralized error handling provides consistent API responses.
