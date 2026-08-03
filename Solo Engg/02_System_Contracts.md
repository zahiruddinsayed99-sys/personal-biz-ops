# Technical Specification Document (TSD)

**Document Version:** 1.0.0

**Project Name:** BusinessHub AI

**System Architecture:** Multi-Tenant Modular Monolith with Centralized AI Microservices

**Target Execution Environment:** Local Docker Compose / Zero-Cost Cloud Staging (Vercel + Render + Supabase + Upstash + Cloudflare R2)

**Status:** Approved Engineering Baseline

---

## 1. Executive Summary & Architectural Overview

BusinessHub AI is a commercial-grade, multi-tenant Business Operating Platform. It consolidates enterprise-grade business domains—**CRM**, **E-Commerce**, **Inventory Management**, and **LMS**—into a unified platform anchored by a shared **Multi-Tenant Authentication & Organization Engine**, a **Stripe Subscriptions Module**, and a cross-cutting **Centralized AI Platform**.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   ANGULAR 20+ FRONTEND CLIENT                                   │
│            Signals • RxJS • Standalone Components • Material/Tailwind • HTTP Interceptors        │
└────────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                 │ HTTPS / JSON API / WebSockets
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   FASTAPI BACKEND GATEWAY                                       │
│          Gunicorn/Uvicorn • OpenAPI 3.1 • CORS • Rate Limiting • Structlog • Sentry               │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                   MIDDLEWARE & CORE SERVICES                                    │
│       TenantContextMiddleware • JWT RBAC Guard • Billing Metering Guard • Audit Logger          │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                  MODULAR DOMAIN BOUNDARIES                                      │
│  ┌──────────────────┬──────────────────┬──────────────────┬──────────────────┬───────────────┐  │
│  │ Core / Auth      │ CRM Module       │ E-Commerce       │ Inventory        │ LMS Engine    │  │
│  │ Orgs & Users     │ Deals & Leads    │ Orders & Cart    │ Stocks & POs     │ Quizzes & RAG │  │
│  └────────┬─────────┴────────┬─────────┴────────┬─────────┴────────┬─────────┴───────┬───────┘  │
│           │                  │                  │                  │                 │          │
│           └──────────────────┴─────────┬────────┴──────────────────┴─────────────────┘          │
│                                        │ Clean Architecture Service / Repository Layers          │
└────────────────────────────────────────┼────────────────────────────────────────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │ Database & Messaging Layer     │ External API Integrations      │ AI Engine Layer
        ▼                                ▼                                ▼
┌───────────────────────┐    ┌───────────────────────┐    ┌───────────────────────┐
│ PostgreSQL 16         │    │ Stripe API            │    │ Gemini / OpenAI API   │
│ Async SQLAlchemy      │    │ Billing & Webhooks    │    │ LLM & Vision Models   │
│ pgvector Embeddings   │    └───────────────────────┘    └───────────────────────┘
├───────────────────────┤    ┌───────────────────────┐    ┌───────────────────────┐
│ Redis 7               │    │ Cloudflare R2 / S3    │    │ Central AI Gateway    │
│ Cache & Celery Queue  │    │ Multi-Tenant Storage  │    │ RAG, OCR & Prompts    │
└───────────────────────┘    └───────────────────────┘    └───────────────────────┘

```

---

## 2. Technology Stack & Architectural Tradeoffs

### 2.1 Stack Components & Explicit Versions

| Technology Layer | Component / Library | Version | Selection Justification & Tradeoff |
| --- | --- | --- | --- |
| **Frontend Framework** | Angular | `^20.0.0` | Enterprise-grade Angular Signal reactive primitives, strict TypeScript integration, standalone component architectures.

 |
| **UI Library** | Angular Material + Tailwind CSS | `^20.0.0` / `^3.4.0` | Accessible pre-built UI components merged with rapid utility-first styling. |
| **State Management** | Angular Signals + RxJS | `^20.0.0` / `^7.8.0` | Fine-grained reactive state without NgRx boilerplate. |
| **Backend Framework** | FastAPI (Python) | `^0.111.0` | Native async runtime, Pydantic v2 data validation, OpenAPI specification autogeneration.

 |
| **ASGI Server** | Uvicorn / Gunicorn | `^0.30.0` / `^22.0.0` | High-throughput asynchronous HTTP processing. |
| **Database ORM** | Async SQLAlchemy + Alembic | `^2.0.30` / `^1.13.0` | Full async database I/O, strict schema typing, robust migration tracking.

 |
| **Relational Storage** | PostgreSQL + pgvector | `16-alpine` | Acid-compliant multi-tenant data engine with vector embedding extension.

 |
| **Cache & Message Broker** | Redis | `7-alpine` | Distributed cache, rate-limiting store, and Celery task broker.

 |
| **Async Task Engine** | Celery | `^5.4.0` | Background task distribution for AI document processing, OCR, and email delivery.

 |
| **Object Storage** | MinIO (Dev) / Cloudflare R2 (Prod) | Latest | S3-compatible, zero-egress fee multi-tenant media/document storage.

 |
| **Payment Gateway** | Stripe Python SDK | `^9.10.0` | Industry-standard multi-tenant subscription sandbox and webhook management. |

### 2.2 System Architecture Decisions (ADR Matrix)

#### ADR-001: Modular Monolith vs. Microservices

* **Decision:** Implement a **Modular Monolith** using strict Python package boundaries (`app/domain/{module}`).
* **Rationale:** Eliminates network latency, distributed transaction complexity, and deployment overhead for a solo engineer while allowing logical domain separation that can be split into microservices if scale requires.

#### ADR-002: Row-Level Multi-Tenant Isolation

* **Decision:** Enforce row-level tenant context isolation using a compulsory `organization_id` column across every domain entity.


* **Rationale:** Schema-per-tenant or Database-per-tenant architectures introduce heavy migration maintenance and overhead on free-tier PostgreSQL setups (Supabase/Neon). Row-level isolation with ORM-enforced session filters guarantees security at minimal operational cost.

---

## 3. Repository Topology & Folder Structure

```text
businesshub-ai/
├── .github/
│   ├── AGENTS.md                          # Directives for AI Coding Agents (Antigravity/Jules)
│   ├── ISSUE_TEMPLATE/                    # Machine-readable issue forms
│   └── workflows/
│       └── production-gatekeeper.yml      # CI/CD Pipeline
├── apps/
│   ├── api/                               # FastAPI Python Backend
│   │   ├── alembic/                       # Database Migration Scripts
│   │   │   └── versions/
│   │   ├── app/
│   │   │   ├── api/                       # API Route Controllers (v1)
│   │   │   │   ├── v1/
│   │   │   │   │   ├── auth.py
│   │   │   │   │   ├── billing.py
│   │   │   │   │   ├── crm.py
│   │   │   │   │   ├── ecommerce.py
│   │   │   │   │   ├── inventory.py
│   │   │   │   │   ├── lms.py
│   │   │   │   │   └── ai.py
│   │   │   ├── core/                      # Global Singletons & Middlewares
│   │   │   │   ├── config.py              # Pydantic BaseSettings
│   │   │   │   ├── database.py            # Async Engine & Session Local
│   │   │   │   ├── security.py            # JWT Hash & RBAC Logic
│   │   │   │   └── tenant_middleware.py   # Organization Context Filter
│   │   │   ├── domain/                    # Domain Driven Core Logic
│   │   │   │   ├── auth/
│   │   │   │   ├── billing/
│   │   │   │   ├── crm/
│   │   │   │   ├── ecommerce/
│   │   │   │   ├── inventory/
│   │   │   │   ├── lms/
│   │   │   │   └── ai/
│   │   │   ├── repositories/              # Async Database Operations
│   │   │   ├── schemas/                   # Pydantic v2 Request/Response DTOs
│   │   │   ├── services/                  # External Integrations (Stripe, S3, AI)
│   │   │   └── workers/                   # Celery Background Workers
│   │   ├── tests/                         # Pytest Suites
│   │   ├──Dockerfile
│   │   └── pyproject.toml
│   └── web/                               # Angular 20 Frontend SPA
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/                  # Interceptors, Guards, Services
│       │   │   │   ├── guards/
│       │   │   │   │   ├── auth.guard.ts
│       │   │   │   │   └── rbac.guard.ts
│       │   │   │   ├── interceptors/
│       │   │   │   │   ├── jwt.interceptor.ts
│       │   │   │   │   └── tenant.interceptor.ts
│       │   │   │   └── services/
│       │   │   ├── features/              # Lazy-Loaded Module Features
│       │   │   │   ├── auth/
│       │   │   │   ├── billing/
│       │   │   │   ├── crm/
│       │   │   │   ├── ecommerce/
│       │   │   │   ├── inventory/
│       │   │   │   ├── lms/
│       │   │   │   └── ai-copilot/
│       │   │   ├── layout/                # Shell Navigation Sidebar/Header
│       │   │   └── shared/                # UI Components (Signals Based)
│       ├── Dockerfile
│       └── angular.json
├── docker/
│   ├── postgres/
│   │   └── init.sql                       # Enables pgvector extension
│   └── nginx/
│       └── default.conf
├── docker-compose.yml                     # Local Development Orchestration
├── Makefile                               # Developer CLI Commands
└── README.md

```

---

## 4. Multi-Tenant Architecture & Auth Subsystem

### 4.1 Token Security Design

Authentication relies on short-lived JWT Access Tokens paired with Refresh Tokens rotated via secure HttpOnly cookies.

```
Client (Angular)                  FastAPI Gateway                   PostgreSQL / Redis
    │                                   │                                  │
    ├─── POST /api/v1/auth/login ──────►│                                  │
    │    {email, password}              ├── Validate Credentials ─────────►│
    │                                   │◄── User & Org Context Record ────┤
    │◄── 200 OK + JWT Access Token ─────┤                                  │
    │    Set-Cookie: refresh_token      │── Store Active Session Hash ────►│ (Redis)
    │                                   │                                  │
    ├─── GET /api/v1/crm/deals ────────►│                                  │
    │    Header: Bearer <JWT>           ├── TenantContextMiddleware        │
    │    Header: X-Organization-Id      │   Extracts JWT & Validates Org   │
    │                                   ├── Appends Tenant Filter ────────►│
    │◄── 200 OK (Isolated Deals) ───────┤                                  │

```

### 4.2 FastAPI Tenant Isolation Middleware Implementation (`tenant_middleware.py`)

```python
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
import jwt
from app.core.config import settings

class TenantContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Exclude public & auth routes
        if request.url.path.startswith(("/api/v1/auth", "/docs", "/openapi.json", "/healthz", "/api/v1/billing/webhooks")):
            return await call_next(request)
        
        auth_header = request.headers.get("Authorization")
        org_header = request.headers.get("X-Organization-Id")

        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid authentication token")

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
            user_orgs = payload.get("orgs", [])
            
            # Enforce selected tenant context
            if org_header and org_header not in user_orgs:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized organization access attempt")
            
            request.state.user_id = payload.get("sub")
            request.state.organization_id = org_header or (user_orgs[0] if user_orgs else None)
            request.state.roles = payload.get("roles", [])

        except jwt.PyJWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalid or expired")

        response = await call_next(request)
        return response

```

---

## 5. Database Schema & Data Models

### 5.1 Entity Relationship Diagram (ERD Schema Text)

```text
[organizations] 1 ──── N [users]
[organizations] 1 ──── N [subscriptions]
[organizations] 1 ──── N [crm_deals]
[organizations] 1 ──── N [products] 1 ──── N [inventory_levels]
[organizations] 1 ──── N [warehouses] 1 ──── N [inventory_levels]
[organizations] 1 ──── N [lms_courses] 1 ──── N [lms_quizzes]
[organizations] 1 ──── N [ai_documents] 1 ──── N [ai_embeddings]

```

### 5.2 Core DDL Schema (PostgreSQL 16)

```sql
-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- 1. Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'FREE',
    stripe_customer_id VARCHAR(255) UNIQUE NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Domain Member',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_org_email UNIQUE (organization_id, email)
);

-- 3. CRM Deals
CREATE TABLE crm_deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    stage VARCHAR(50) NOT NULL DEFAULT 'QUALIFICATION',
    contact_email VARCHAR(255) NOT NULL,
    lead_score INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Inventory Warehouses
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location_code VARCHAR(50) NOT NULL
);

-- 5. Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    CONSTRAINT uq_org_sku UNIQUE (organization_id, sku)
);

-- 6. Inventory Stock Levels
CREATE TABLE inventory_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    quantity_on_hand INT NOT NULL DEFAULT 0,
    quantity_reserved INT NOT NULL DEFAULT 0,
    CONSTRAINT uq_prod_warehouse UNIQUE (product_id, warehouse_id)
);

-- 7. AI Knowledge Base & RAG Vector Store
CREATE TABLE ai_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    storage_path VARCHAR(512) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES ai_documents(id) ON DELETE CASCADE,
    content_chunk TEXT NOT NULL,
    embedding vector(1536) NOT NULL, -- Compatible with OpenAI / Gemini Embeddings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Essential Performance Indexes
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_deals_org_stage ON crm_deals(organization_id, stage);
CREATE INDEX idx_inventory_org_prod ON inventory_levels(organization_id, product_id);
CREATE INDEX idx_embeddings_org_vector ON ai_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

```

---

## 6. End-to-End Module API Contracts

All endpoints accept and return `application/json` unless otherwise specified.

### 6.1 CRM Module Contracts

#### `POST /api/v1/crm/deals`

Creates a new deal under the current tenant context.

* **Request Headers:**
* `Authorization: Bearer <jwt_access_token>`
* `X-Organization-Id: <org_uuid>`


* **Request Payload (Pydantic Schema):**
```json
{
  "title": "Enterprise Logistics Contract Renewal",
  "value": 75000.00,
  "currency": "USD",
  "stage": "PROPOSAL_SENT",
  "contact_email": "decisionmaker@apexcorp.com"
}

```


* **Response Payload (HTTP 201 Created):**
```json
{
  "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "organization_id": "org_987a654b",
  "title": "Enterprise Logistics Contract Renewal",
  "value": 75000.00,
  "currency": "USD",
  "stage": "PROPOSAL_SENT",
  "contact_email": "decisionmaker@apexcorp.com",
  "lead_score": 0,
  "created_at": "2026-08-03T15:30:00Z"
}

```



#### `POST /api/v1/crm/deals/{id}/ai-score`

Triggers AI Lead Scoring against historical customer notes and metadata.

* **Response Payload (HTTP 200 OK):**
```json
{
  "deal_id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "lead_score": 88,
  "sentiment_label": "HIGH_INTENT",
  "ai_reasoning": [
    "Contact requested SLA documentation",
    "Opened proposal document 4 times",
    "Budget approval confirmed via email thread"
  ],
  "suggested_next_action": "Send customized renewal addendum with 5% annual volume discount."
}

```



---

### 6.2 Central AI Gateway & RAG Contracts

#### `POST /api/v1/ai/rag/query`

Performs vector search across organization documents and synthesizes a grounded answer.

* **Request Payload:**
```json
{
  "prompt": "What is our company return policy for damaged electronics?",
  "top_k": 3
}

```


* **Response Payload (HTTP 200 OK):**
```json
{
  "answer": "Damaged electronics must be reported within 14 days of receipt. Customers receive a full refund or free replacement once returned in original packaging.",
  "citations": [
    {
      "document_id": "doc_88291",
      "file_name": "Standard_Operating_Procedures_2026.pdf",
      "relevance_score": 0.91
    }
  ]
}

```



---

## 7. Centralized AI Platform Architecture

The AI subsystem operates as a shared gateway service that isolates model provider keys, orchestrates prompts, chunks documents into pgvector embeddings, and provides RAG capabilities to all business modules.

```
[ Domain Modules (CRM/LMS) ] ──► [ AI Gateway Endpoint ] ──► [ Prompt Engine & Token Guard ]
                                                                      │
                                   ┌──────────────────────────────────┴──────────────────────────────────┐
                                   ▼                                                                     ▼
                   [ Async Celery Vector Worker ]                                        [ LLM Provider API ]
                   • Chunk PDF/Text File                                                 • Gemini 1.5 / GPT-4o
                   • Generate Vector Embeddings                                          • Structured Output Parsing
                   • Store in PostgreSQL `pgvector`

```

### Async Document Ingestion Worker (`tasks.py`)

```python
from celery import SharedTask
from app.core.database import SessionLocal
from app.domain.ai.models import AIDocument, AIEmbedding
import langchain_community.document_loaders as loaders
from langchain.text_splitter import RecursiveCharacterTextSplitter
import google.generativeai as genai

@SharedTask(name="ai.process_document_embeddings")
def process_document_embeddings(document_id: str, organization_id: str, file_path: str):
    db = SessionLocal()
    try:
        # 1. Load File Text
        loader = loaders.PyPDFLoader(file_path)
        docs = loader.load()
        
        # 2. Chunk Content
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
        chunks = text_splitter.split_documents(docs)
        
        # 3. Generate Vector Embeddings & Persist
        for chunk in chunks:
            response = genai.embed_content(
                model="models/embedding-001",
                content=chunk.page_content
            )
            embedding_vector = response['embedding']
            
            db_embedding = AIEmbedding(
                organization_id=organization_id,
                document_id=document_id,
                content_chunk=chunk.page_content,
                embedding=embedding_vector
            )
            db.add(db_embedding)
            
        db.commit()
    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        db.close()

```

---

## 8. Angular 20 Frontend Architecture

The Angular application utilizes a **Signal-Driven Reactive State** paradigm, lazy-loaded feature components, and explicit HTTP interceptors for tenant context injection.

### 8.1 Tenant HTTP Interceptor (`tenant.interceptor.ts`)

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const activeOrgId = authService.currentOrganizationId();
  const token = authService.accessToken();

  let modifiedHeaders = req.headers;

  if (token) {
    modifiedHeaders = modifiedHeaders.set('Authorization', `Bearer ${token}`);
  }

  if (activeOrgId) {
    modifiedHeaders = modifiedHeaders.set('X-Organization-Id', activeOrgId);
  }

  const clonedRequest = req.clone({ headers: modifiedHeaders });
  return next(clonedRequest);
};

```

---

## 9. DevSecOps, Infrastructure & Deployment

### 9.1 Local Development Environment (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  postgres:
    image: pgvector/pgvector:pg16
    container_name: businesshub_db
    environment:
      POSTGRES_USER: bh_user
      POSTGRES_PASSWORD: bh_password
      POSTGRES_DB: businesshub_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    container_name: businesshub_redis
    ports:
      - "6379:6379"

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    container_name: businesshub_api
    env_file: .env
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  celery_worker:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    container_name: businesshub_celery
    env_file: .env
    depends_on:
      - postgres
      - redis
    command: celery -A app.workers.celery_app worker --loglevel=info

volumes:
  pgdata:

```

---

## 10. Automated Testing & Production Readiness Checklist

### 10.1 Quality Gates Matrix

```
[ Source Code Commit ]
         │
         ▼
[ Stage 1: Static Code Analysis ] ──► ESLint / Ruff / MyPy (Zero Errors Allowed)
         │
         ▼
[ Stage 2: Security SAST Scan ]   ──► CodeQL Scan (Zero High/Critical Severity Vulnerabilities)
         │
         ▼
[ Stage 3: Automated Unit Tests ] ──► Pytest / Vitest (Line Coverage >= 80%)
         │
         ▼
[ Stage 4: Integration & E2E ]    ──► Playwright Cross-Browser Testing & Multi-Tenant Data Leak Tests
         │
         ▼
[ Stage 5: Production Deployment ]──► Render Web Service + Vercel Static CDN Migration

```

### 10.2 Production Readiness Verification Checklist

* [ ] **Multi-Tenancy Guard:** Automated integration test passes confirming User A from `Org 1` receives `403 Forbidden` when accessing `Org 2` deals.


* [ ] **Database Migrations:** `alembic upgrade head` runs cleanly without manual schema intervention.


* [ ] **Secrets Management:** Zero hardcoded API keys or JWT secrets present in source repositories.
* [ ] **Billing Webhook Verification:** Stripe signature validation middleware enabled on `/api/v1/billing/webhooks`.
* [ ] **Observability Ping:** Sentry error reporting verified active in FastAPI startup logs.


* [ ] **Health Check:** `/healthz` endpoint returns `200 OK` confirming PostgreSQL and Redis socket connectivity.
