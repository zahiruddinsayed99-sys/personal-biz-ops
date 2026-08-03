# System Technical Contracts (`02_System_Contracts.md`)

**Document Version:** 1.0.0

**Project Name:** BusinessHub AI

**Target Execution Environment:** Local Docker Compose / Production Staging (Vercel + Render + Supabase + Upstash + Cloudflare R2)

**Classification:** Primary Reference for Database Schemas, API Specs, and Integration Contracts

---

## 1. Global Standards & Conventions

To eliminate ambiguity across human developers and AI agents, all technical implementations must strictly adhere to the following contract standards:

### 1.1 Database Naming & Architectural Rules

* **Tables & Columns:** Lowercase `snake_case`. Table names must be pluralized (e.g., `organizations`, `users`, `crm_deals`).


* **Primary Keys:** UUID v4 for all tables (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`).
* **Foreign Keys:** `{singular_table_name}_id` (e.g., `organization_id`, `contact_id`).
* **Tenant Isolation:** Every tenant-bound table **MUST** include an `organization_id UUID NOT NULL` column with a foreign key referencing `organizations(id)` ON DELETE CASCADE.


* **Audit Columns:** Every table must include standard timestamp fields:


* `created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`

* `updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`



* **Soft Delete Strategy:** Business entities (e.g., `contacts`, `deals`, `products`, `courses`) must utilize soft deletes via a nullable timestamp:
* `deleted_at TIMESTAMPTZ NULL DEFAULT NULL`
* Active queries must include `deleted_at IS NULL`. Hard deletes are strictly forbidden except via automated retention purge policies.



### 1.2 API Standards & Error Code Catalog

* **URL Structure:** `/api/v1/{module}/{resource}`.


* **Standard HTTP Response Wrapper:** All REST API outputs must conform to a single contract envelope:

```json
{
  "status": "success",
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  },
  "error": null,
  "timestamp": "2026-08-03T16:00:00Z"
}

```

#### Error Code Catalog

| Error Code | HTTP Status | Description | Action Required |
| --- | --- | --- | --- |
| `ERR_AUTH_001` | `401 Unauthorized` | Missing or invalid JWT Access Token.

 | Re-authenticate or invoke `/api/v1/auth/refresh`. |
| `ERR_TENANT_001` | `403 Forbidden` | User lacks access to requested `organization_id`.

 | Verify `X-Organization-Id` header context.

 |
| `ERR_RBAC_001` | `403 Forbidden` | Role lacks necessary permission scope.

 | Request elevated role permissions from Tenant Owner.

 |
| `ERR_VALIDATION_001` | `422 Unprocessable` | Input fails Pydantic schema validation rules. | Review payload parameters against OpenAPI spec. |
| `ERR_BILLING_001` | `402 Payment Required` | Tenant credit limit or subscription tier breached.

 | Upgrade subscription tier via Stripe Customer Portal. |
| `ERR_RATE_LIMIT_001` | `429 Too Many Requests` | Redis rate limiter threshold exceeded. | Exponential backoff before retry. |
| `ERR_NOT_FOUND_001` | `404 Not Found` | Entity missing or soft-deleted under tenant context. | Verify entity UUID and tenant ownership. |

---

## 2. Complete Database Contracts & DDL Schema

### 2.1 Entity Relationship Diagram (ASCII Representation)

```text
               ┌────────────────────────────────────────────────────────┐
               │                     ORGANIZATIONS                      │
               └───────────────┬────────────────────────┬───────────────┘
                               │ 1                      │ 1
                               │                        │
                               ▼ N                      ▼ N
                       ┌───────────────┐        ┌───────────────┐
                       │     USERS     │        │ SUBSCRIPTIONS │
                       └───────┬───────┘        └───────────────┘
                               │ 1
                               │
            ┌──────────────────┼──────────────────┬──────────────────┐
            │ 1                │ 1                │ 1                │ 1
            ▼ N                ▼ N                ▼ N                ▼ N
    ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
    │  CRM_DEALS    │  │   PRODUCTS    │  │  LMS_COURSES  │  │ AI_DOCUMENTS  │
    └───────────────┘  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘
                               │ 1                │ 1                │ 1
                               ▼ N                ▼ N                ▼ N
                       ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
                       │INVENTORY_LEVEL│  │  LMS_QUIZZES  │  │ AI_EMBEDDINGS │
                       └───────────────┘  └───────────────┘  └───────────────┘

```

### 2.2 PostgreSQL 16 DDL Module Schemas

```sql
-- Initialize Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- =============================================================================
-- MODULE 0: CORE PLATFORM & AUTHENTICATION
-- =============================================================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'FREE',
    stripe_customer_id VARCHAR(255) UNIQUE NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Domain Member',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL,
    CONSTRAINT uq_user_org_email UNIQUE (organization_id, email)
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    changes_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- MODULE 1: BILLING & SUBSCRIPTIONS
-- =============================================================================

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL, -- ACTIVE, PAST_DUE, CANCELED
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    ai_credit_balance INT NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- MODULE 2: CRM (CUSTOMER RELATIONSHIP MANAGEMENT)
-- =============================================================================

CREATE TABLE crm_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NULL,
    website VARCHAR(255) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

CREATE TABLE crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    company_id UUID NULL REFERENCES crm_companies(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    job_title VARCHAR(100) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

CREATE TABLE crm_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    contact_id UUID NULL REFERENCES crm_contacts(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    stage VARCHAR(50) NOT NULL DEFAULT 'QUALIFICATION',
    lead_score INT NOT NULL DEFAULT 0,
    expected_close_date DATE NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

-- =============================================================================
-- MODULE 3: E-COMMERCE & INVENTORY
-- =============================================================================

CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location_code VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL,
    CONSTRAINT uq_org_sku UNIQUE (organization_id, sku)
);

CREATE TABLE inventory_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    quantity_on_hand INT NOT NULL DEFAULT 0,
    quantity_reserved INT NOT NULL DEFAULT 0,
    reorder_threshold INT NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_prod_warehouse UNIQUE (product_id, warehouse_id)
);

-- =============================================================================
-- MODULE 4: LMS (LEARNING MANAGEMENT SYSTEM)
-- =============================================================================

CREATE TABLE lms_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

CREATE TABLE lms_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    questions_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- MODULE 5: CENTRALIZED AI GATEWAY & VECTOR STORE
-- =============================================================================

CREATE TABLE ai_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    storage_path VARCHAR(512) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES ai_documents(id) ON DELETE CASCADE,
    content_chunk TEXT NOT NULL,
    embedding vector(1536) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- INDEXES & PERFORMANCE OPTIMIZATIONS
-- =============================================================================

CREATE INDEX idx_users_org_email ON users(organization_id, email);
CREATE INDEX idx_audit_org_created ON audit_logs(organization_id, created_at DESC);
CREATE INDEX idx_deals_org_stage ON crm_deals(organization_id, stage) WHERE deleted_at IS NULL;
CREATE INDEX idx_inventory_org_prod ON inventory_levels(organization_id, product_id);
CREATE INDEX idx_embeddings_org_vector ON ai_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

```

---

## 3. OpenAPI 3.1 Representative API Contracts

Below is the OpenAPI specification defining endpoint contracts for Core Auth, CRM Deals, and the AI Gateway:

```yaml
openapi: 3.1.0
info:
  title: BusinessHub AI Engine Specifications
  version: 1.0.0
  description: Multi-tenant technical contract API specs.
paths:

  /api/v1/auth/login:
    post:
      summary: User Authentication
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Authentication Successful
          headers:
            Set-Cookie:
              schema:
                type: string
                example: refresh_token=xyz123; HttpOnly; Secure; SameSite=Strict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthSuccessResponse'
        '401':
          $ref: '#/components/responses/401Unauthorized'

  /api/v1/crm/deals:
    get:
      summary: List Pipeline Deals
      operationId: listDeals
      parameters:
        - $ref: '#/components/parameters/X-Organization-Id'
        - name: stage
          in: query
          required: false
          schema:
            type: string
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: Deals List Retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DealListResponse'

    post:
      summary: Create New Deal
      operationId: createDeal
      parameters:
        - $ref: '#/components/parameters/X-Organization-Id'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DealCreateRequest'
      responses:
        '201':
          description: Deal Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DealSingleResponse'

  /api/v1/ai/rag/query:
    post:
      summary: Execute Multi-Tenant RAG Vector Search
      operationId: queryRAG
      parameters:
        - $ref: '#/components/parameters/X-Organization-Id'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [prompt]
              properties:
                prompt:
                  type: string
                  example: "What is our standard cancellation policy?"
                top_k:
                  type: integer
                  default: 3
      responses:
        '200':
          description: Grounded AI Synthesized Response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RAGResponse'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  parameters:
    X-Organization-Id:
      name: X-Organization-Id
      in: header
      required: true
      schema:
        type: string
        format: uuid

  responses:
    401Unauthorized:
      description: Authentication Failed
      content:
        application/json:
          example:
            status: "error"
            message: "Missing or invalid access token."
            error: "ERR_AUTH_001"

  schemas:
    LoginRequest:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
          format: email
          example: "sarah.techlead@apexlogistics.com"
        password:
          type: string
          format: password
          example: "SuperSecretPass123!"

    AuthSuccessResponse:
      type: object
      properties:
        status:
          type: string
          example: "success"
        data:
          type: object
          properties:
            access_token:
              type: string
            token_type:
              type: string
              example: "Bearer"
            user:
              type: object
              properties:
                id:
                  type: string
                  format: uuid
                email:
                  type: string
                organizations:
                  type: array
                  items:
                    type: string
                    format: uuid

    DealCreateRequest:
      type: object
      required: [title, value, contact_id]
      properties:
        title:
          type: string
          example: "Fleet Tracking Renewal Contract"
        value:
          type: number
          format: double
          example: 45000.00
        currency:
          type: string
          default: "USD"
        contact_id:
          type: string
          format: uuid

    DealSingleResponse:
      type: object
      properties:
        status:
          type: string
          example: "success"
        data:
          type: object
          properties:
            id:
              type: string
              format: uuid
            organization_id:
              type: string
              format: uuid
            title:
              type: string
            value:
              type: number
            stage:
              type: string
            lead_score:
              type: integer

    DealListResponse:
      type: object
      properties:
        status:
          type: string
          example: "success"
        data:
          type: array
          items:
            $ref: '#/components/schemas/DealSingleResponse/properties/data'

    RAGResponse:
      type: object
      properties:
        status:
          type: string
          example: "success"
        data:
          type: object
          properties:
            answer:
              type: string
              example: "Orders may be canceled within 24 hours of placement without penalty."
            citations:
              type: array
              items:
                type: object
                properties:
                  document_id:
                    type: string
                    format: uuid
                  file_name:
                    type: string
                  relevance_score:
                    type: number

```

---

## 4. External Integration Contracts

### 4.1 Stripe Subscription Sandbox Integration

```
Stripe Gateway                  FastAPI (/billing/webhooks)                 PostgreSQL
     │                                      │                                   │
     ├─── customer.subscription.updated ───►│                                   │
     │    Header: Stripe-Signature          ├── Validate HMAC Signature          │
     │                                      ├── Extract Metadata.org_id         │
     │                                      ├── Update Sub Record ─────────────►│
     │◄── 200 OK (Event Processed) ─────────┤                                   │

```

* **Webhook Endpoint:** `/api/v1/billing/webhooks`
* **Security Validation:** HMAC SHA-256 signature verification via `Stripe-Signature` header matching `STRIPE_WEBHOOK_SECRET`.
* **Idempotency Rule:** Webhook events are checked against Redis (`SETNX stripe_evt_{event_id} 1 EX 86400`) before execution. Duplicate event IDs return immediate `200 OK`.

### 4.2 Cloudflare R2 / S3 Object Storage Contract

* **Bucket Layout Strategy:** Multi-tenant prefix isolation: `s3://businesshub-media/{organization_id}/{module}/{year}/{uuid}_{filename}`.
* **Pre-Signed Upload Request:**
* **Endpoint:** `POST /api/v1/storage/presigned-upload`
* **Request Payload:** `{"file_name": "contract.pdf", "mime_type": "application/pdf", "module": "crm"}`
* **Response Output:** `{"upload_url": "[https://r2.cloudflare.com/](https://r2.cloudflare.com/)...", "storage_path": "org_123/crm/2026/doc_456.pdf", "expires_in": 900}`



---

## 5. Caching & Background Task Contracts

### 5.1 Redis Cache Key Conventions

| Purpose / Scope | Key Pattern Template | TTL / Expiry | Cache Eviction Trigger |
| --- | --- | --- | --- |
| **User Session Hash** | `sess:{user_id}:{token_id}` | 7 Days | User Logout / Password Reset |
| **Tenant Metadata** | `org:{organization_id}:meta` | 1 Hour | Organization Settings Update |
| **User RBAC Scope** | `org:{org_id}:usr:{user_id}:perms` | 15 Minutes | Role Change / User Deactivation |
| **API Rate Limiter** | `ratelimit:{org_id}:{endpoint}` | 60 Seconds | Sliding Window Expiry |
| **Stripe Idempotency** | `stripe_evt:{event_id}` | 24 Hours | Key Expiration |

### 5.2 Async Background Tasks (Celery / Redis)

#### Task Contract 1: Document Embedding Pipeline (`ai.process_document_embeddings`)

```json
{
  "task": "ai.process_document_embeddings",
  "args": [],
  "kwargs": {
    "document_id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "organization_id": "org_987a654b",
    "storage_path": "org_987a654b/ai/2026/doc_991.pdf"
  }
}

```

#### Task Contract 2: AI Lead Scoring Asynchronous Computation (`crm.calculate_lead_score`)

```json
{
  "task": "crm.calculate_lead_score",
  "args": [],
  "kwargs": {
    "deal_id": "deal_778899",
    "organization_id": "org_987a654b"
  }
}

```
