# Software Requirements Specification (SRS)

**Document Version:** 1.0.0

**Project Name:** BusinessHub AI

**Project Classification:** Enterprise Multi-Tenant Modular Business Operating Platform

**Status:** Approved for Baseline Implementation

---

## 1. System Vision & Overview

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional, non-functional, data, and architectural requirements for **BusinessHub AI**. It serves as the single source of truth for design, development, testing, security audits, and production deployment.

### 1.2 System Scope

BusinessHub AI is an enterprise-grade, multi-tenant Software-as-a-Service (SaaS) platform built on a **Modular Monolith** architecture. It provides a unified operating system for businesses, integrating core tenant management, billing, and four core business engines—**CRM**, **E-Commerce**, **Inventory Management**, and **LMS**—backed by a centralized, cross-cutting **AI Engine**.

```
                                 BusinessHub AI Core Platform
                                              │
 ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
 │                                            │                                            │
Auth & Tenant Context Middleware     Billing & Subscriptions (Stripe)            Centralized AI Microservice
(JWT, RBAC, Orgs, Users)[cite: 1]       (Tiered Usage, Webhooks)                    (RAG, Chat, OCR, Summaries)[cite: 1]
 │                                            │                                            │
 └────────────────────────────────────────────┼────────────────────────────────────────────┘
                                              │
                 ┌────────────────────────────┴────────────────────────────┐
                 │                Modular Business Domains                 │
                 ├────────────────┬────────────────┬───────────────────────┤
                 │  CRM Module    │ E-Commerce Engine│ Inventory Management  │
                 │  LMS Engine    │ Analytics Hub  │ Notification Service  │[cite: 1]
                 └────────────────┴────────────────┴───────────────────────┘

```

---

## 2. User Roles & Permission Matrix (RBAC)

The system enforces strict Role-Based Access Control (RBAC) isolated per organization context.

### 2.1 Role Definitions

* **Platform SuperAdmin:** Global operator managing global platform health, tenant approvals, and billing defaults.
* **Tenant Owner:** Organization creator with unlimited operational and billing administrative capabilities within their tenant context.


* **Tenant Admin:** Organization administrator managing users, roles, and module settings.


* **Domain Manager (CRM / E-Com / Inventory / LMS):** Operational lead managing domain-specific entities and workflows.
* **Domain Member:** Operational user with create/read/update capabilities restricted to assigned modules.
* **Read-Only Auditor:** Viewing privileges restricted to audit logs, financial reports, and read-only views.



### 2.2 Permissions Matrix

| Permission Code | SuperAdmin | Tenant Owner | Tenant Admin | Domain Manager | Domain Member | Auditor |
| --- | --- | --- | --- | --- | --- | --- |
| `platform:manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `tenant:billing` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `user:manage` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `crm:write` | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `crm:delete` | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `inventory:write` | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `ai:execute` | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `audit:read` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |

---

## 3. Business Rules & Validation Engine

### 3.1 Platform Business Rules

* **BR-PLT-001 (Tenant Isolation):** All API interactions, SQL queries, cache entries, and storage paths MUST include `organization_id`. Unauthenticated or cross-tenant data requests MUST return an immediate `403 Forbidden` response.


* **BR-PLT-002 (Subscription Limits):** Tenants on the **Free Tier** are restricted to 1 Organization, 3 Active Users, and 100 AI Execution Credits per month. Operations exceeding limits MUST return HTTP `402 Payment Required`.
* **BR-PLT-003 (Audit Integrity):** Any state-changing transaction (`POST`, `PUT`, `DELETE`, `PATCH`) MUST write an immutable record to the `audit_logs` table containing `user_id`, `organization_id`, `ip_address`, `action`, `resource`, and `delta_json`.



### 3.2 Domain Business Rules

* **BR-CRM-001 (Deal State Machine):** A Deal cannot transition directly from `Qualification` to `Closed-Won` without an associated `Proposal Sent` activity log.
* **BR-INV-001 (Negative Stock Prevention):** Fulfilling an order MUST atomicity check stock availability. Stock decrements that yield a negative balance MUST throw a `409 Conflict` domain exception and abort transaction.
* **BR-LMS-001 (Quiz Completion):** Certificates are generated ONLY when a user achieves a aggregate quiz score $\ge 80\%$.

---

## 4. Comprehensive Functional Requirements

### 4.1 Module 0: Core Platform, Auth & Multi-Tenancy

#### FR-CORE-01: Multi-Tenant Self-Service Onboarding

* **Description:** Allows new users to register and bootstrap an Organization.


* **Validation Rules:**
* Work Email must be valid format and unique globally.
* Organization Slug must be lowercase alphanumeric, dashes only, 3–30 characters (`^[a-z0-0-]{3,30}$`).


* **Acceptance Criteria:**
1. System creates User, Organization, and auto-assigns `Tenant Owner` role in a single DB transaction.
2. System issues JWT Access Token (15 min expiry) and Refresh Token (7 days expiry in HttpOnly Cookie).



#### FR-CORE-02: Tenant Isolation Middleware

* **Description:** FastAPI middleware (`app/core/tenant_middleware.py`) extracts JWT token, validates context, and injects `organization_id` into the database session context.


* **Acceptance Criteria:**
1. Every database query automatically appends `WHERE organization_id = :current_org_id`.
2. Attempting to pass a foreign `organization_id` in payload or URL params raises security audit flag.



---

### 4.2 Module 1: Billing & Subscription Engine (Stripe Integration)

#### FR-BILL-01: Plan Tier Subscriptions

* **Description:** Supports Free, Pro, and Enterprise subscription tiers using Stripe Sandbox Test Mode.
* **Acceptance Criteria:**
1. Users can launch the Stripe Customer Portal to upgrade/downgrade subscription tiers.
2. Ingestion of `customer.subscription.updated` webhooks asynchronously updates `organisations.subscription_status`.



#### FR-BILL-02: Webhook Idempotency

* **Description:** Payment webhooks MUST be processed idempotently using the Stripe event ID as an idempotent processing key.

---

### 4.3 Module 2: CRM Engine

#### FR-CRM-01: Lead & Deal Pipeline Management

* **Description:** Visual Kanban and tabular management of sales leads, contacts, and deal stages.


* **Data Fields:** `deal_id`, `title`, `value`, `currency`, `stage`, `expected_close_date`, `contact_id`, `organization_id`.
* **Acceptance Criteria:** Drag-and-drop state changes on the frontend update deal status real-time via WebSocket and persist state to backend.

#### FR-CRM-02: AI Follow-Up & Lead Scoring Copilot

* **Description:** Feeds contact interactions, notes, and activity history into Central AI Service.


* **Acceptance Criteria:**
1. AI outputs lead score (0–100) alongside key intent signals.


2. One-click "Draft AI Follow-Up" generates an email draft contextually customized to deal history.





---

### 4.4 Module 3: E-Commerce & Inventory Management

#### FR-ECIN-01: Product Catalog & Multi-Warehouse Inventory

* **Description:** Inventory tracking across distinct physical warehouses with real-time stock allocation.


* **Data Schema:**
```json
{
  "sku": "SKU-SENS-5001",
  "name": "IoT Telematics Unit",
  "organization_id": "org_987a654b",
  "warehouses": [
    { "warehouse_id": "wh_us_east", "on_hand": 420, "reserved": 15 },
    { "warehouse_id": "wh_eu_west", "on_hand": 85, "reserved": 0 }
  ],
  "reorder_point": 100
}

```



#### FR-ECIN-02: AI Demand Forecasting

* **Description:** Central AI service processes historic sales velocity over 90 days to predict stock depletion dates and auto-generate draft Purchase Orders (POs).



---

### 4.5 Module 4: LMS Engine

#### FR-LMS-01: Course Builder & AI Quiz Generator

* **Description:** Interactive course publishing system with automated AI-driven quiz creation from uploaded documentation.


* **Acceptance Criteria:**
1. Instructor uploads PDF/Markdown course transcript.


2. RAG pipeline extracts text and generates a 5-question multiple-choice assessment.





---

### 4.6 Cross-Cutting Module 5: Centralized AI Engine

#### FR-AI-01: Universal RAG & Document Processing Service

* **Description:** Single, centralized service providing RAG, OCR, document search, and chat capabilities across CRM, E-Commerce, Inventory, and LMS modules.


* **Capabilities:**
* Vector store embeddings (pgvector / RedisVector).
* Asynchronous background job processing via Redis queues for document chunking.





---

## 5. End-to-End System Workflows & User Journeys

### 5.1 Primary User Journey: B2B Lead Conversion to Inventory Allocation

```
[ 1. Prospect Inquiry ] ──► System ingests lead via public API endpoint.
                                   │
                                   ▼
[ 2. AI Scoring ]       ──► Central AI calculates Lead Score (88/100) & drafts quote[cite: 1].
                                   │
                                   ▼
[ 3. Deal Closure ]     ──► Sales Manager approves AI proposal; deal moves to CLOSED_WON[cite: 1].
                                   │
                                   ▼
[ 4. Payment ]          ──► Stripe Webhook fires `invoice.payment_succeeded`.
                                   │
                                   ▼
[ 5. Stock Deduction ]  ──► Inventory service reserves 50 units from `wh_us_east`[cite: 1].
                                   │
                                   ▼
[ 6. Customer LMS ]     ──► Client auto-enrolled in product onboarding course on LMS[cite: 1].

```

---

## 6. Non-Functional Requirements (NFRs)

### 6.1 Performance & Scalability

* **API Response Time:** 95% of standard REST API endpoints MUST respond in $< 200\text{ ms}$.
* **AI Generation Time:** Streaming response first token delivery (TTFT) MUST occur in $< 1.5\text{ seconds}$.
* **Database Scaling:** PostgreSQL connection pool management via PGBouncer supporting up to 500 concurrent connections.

### 6.2 Security & Compliance

* **Encryption Standards:** Data at rest encrypted via AES-256; Data in transit forced via TLS 1.3.
* **Authentication:** JWT signed with RS256 algorithm; Refresh Token Rotation with automatic revocation upon reuse detection.
* **Static Analysis:** Zero high or critical security alerts in GitHub CodeQL / Snyk scans prior to merge.

### 6.3 Reliability & Availability

* **Service Availability:** $99.9\%$ uptime target for core API routes.
* **Database Recovery:** Point-In-Time Recovery (PITR) enabled on production Postgres database with 7-day retention.

---

## 7. API Architecture & Data Integration Specs

### 7.1 Core Endpoint Standards

All endpoints adhere to OpenAPI 3.1 specifications. Standard URL structure: `/api/v1/{module}/{resource}`.

#### Sample Contract: `POST /api/v1/crm/leads/{lead_id}/score`

* **Request Headers:**
`Authorization: Bearer <jwt_token>`
`X-Organization-Id: org_987a654b`
* **Response Body (HTTP 200 OK):**
```json
{
  "status": "success",
  "data": {
    "lead_id": "lead_9921",
    "lead_score": 88,
    "intent_classification": "HIGH_INTENT",
    "ai_insights": [
      "Opened quote 4 times in 24 hours",
      "Requested custom SLA agreement"
    ],
    "recommended_action": "Send customized contract agreement with 5% volume discount."
  },
  "timestamp": "2026-08-03T15:13:10Z"
}

```



---

## 8. UI/UX Specifications

### 8.1 Design System Requirements

* **Framework:** Angular 20+ with Standalone Components, Signals, and RxJS.


* **UI Components:** Angular Material + Tailwind CSS design system.


* **Responsive Layout:** Responsive layout supporting Desktop ($1920\times1080$), Laptop ($1366\times768$), and Tablet ($1024\times768$).
* **Accessibility:** WCAG 2.1 Level AA compliance across all public and tenant dashboard views.

---

## 9. Assumptions & Constraints

### 9.1 Technical Constraints

* Monorepo directory structure required (`/apps/web`, `/apps/api`, `/docker`).


* Python 3.12+ (FastAPI) backend and Node 20+ / Angular 20+ frontend.


* Zero-cost infrastructure tier utilized for staging environments (Vercel + Render + Supabase + Upstash).

### 9.2 Development Assumptions

* AI Agents (**Google Antigravity** and **Jules**) will write code via isolated feature branches (`ai/*`) under human code review governance.


* All technical execution progress will be tracked in `BusinessHub_Engineering_OS.xlsx`.
