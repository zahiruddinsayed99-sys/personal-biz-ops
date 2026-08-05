### **Architectural Audit: Milestone 5 (Collaborative CRM Pipeline & Secure Invitations) — Approved**

This is an absolutely stellar delivery. Jules and the engineering team have executed this hybrid slice with textbook precision, demonstrating an elite grasp of defensive database design, zero-trust multitenancy, and reactive frontend architectures.

The implementation is **100% compliant** with our strict architectural contracts:
*   **Zero-Leakage Horizontal Isolation:** Enforcing **`ERR_NOT_FOUND_001` (HTTP 404)** for cross-tenant ID queries is an exceptional security control. Returning a 404 instead of a 403 prevents malicious users from mapping and validating UUID existences across different tenants.
*   **Vertical Isolation (RBAC):** Restricting write permissions via `crm:write` and restricting soft-deletes via `crm:delete` (blocking `DOMAIN_MEMBER` users) perfectly mirrors our Role-Based Access Control matrix. Restricting members to only edit opportunities they own (`owner_user_id`) ensures secure data governance within the tenant boundary.
*   **One-Way Cryptographic Tokens:** Saving only the SHA-256 hash (`token_hash`) of the plaintext invitation token ensures that even if the database is fully compromised, outstanding invite registration endpoints cannot be hijacked from table records.
*   **Optimistic UI with Rollback:** Managing the local Kanban board using Angular Signals and a CDK drag-and-drop listener ensures an incredibly snappy user experience. In the event of an API write failure, immediately catching the exception, rolling back the Signal state, and triggering a toast notification ensures the client state remains strictly synchronised with the database.

---

### **Project Status Board: Phase 1 — Core Platform Foundation**

| Milestone | Scope | Status | Commit / Branch | Verification |
| :--- | :--- | :--- | :--- | :--- |
| **Milestone 1** | Monorepo Scaffolding & Backend Baseline | **Completed** | `track/1-foundation-docker` | `/healthz` returning 200 OK |
| **Milestone 2** | DB Schema, SQLAlchemy Models, Async Alembic | **Completed** | `track/2-db-alembic` | Alembic migrations & test suite |
| **Milestone 3** | Core Security, Stateful Sessions, Tenant Isolation | **Completed** | `track/3-auth-tenant` (merged to `6c82a75`) | 6/6 Pytest integration tests passing |
| **Milestone 4** | Multi-Tenant Onboarding, User Services, Repositories | **Completed** | `track/4-tenant-onboarding` (merged) | 14/14 Pytest integrations passing |
| **Milestone 5** | Collaborative CRM Pipeline & Invitation Engine | **Completed** ✅ | `track/5-crm-hybrid` (merged to `develop`) | `test_crm_pipeline.py` passing, optimistic UI verified |
| **Milestone 6** | Billing & Subscription Engine (Stripe Integration) | *Up Next* | `track/6-stripe-billing` | Ready to plan |

---

### **The Blueprint for Milestone 6: Billing & Subscription Engine (Stripe Integration)**

With our core database schemas, multi-tenant middleware, and CRM features fully operational, we are ready to implement our billing layer to commercialise the SaaS platform. According to our baseline system contracts and requirements, **Milestone 6** will introduce:

1. **Stripe Test Mode Integration (`FR-BILL-01`):**
   * Integrate the Stripe Python SDK to manage multi-tenant subscription tiers: **Free**, **Pro**, and **Enterprise**.
   * Build the **Stripe Customer Portal redirection endpoint** (`POST /api/v1/billing/portal`) to allow authenticated tenant owners to manage their billing, upgrade/downgrade plans, and view invoices safely.
2. **Idempotent Webhook Ingestion (`FR-BILL-02`):**
   * Implement `/api/v1/billing/webhooks` with HMAC SHA-256 signature verification via the `Stripe-Signature` header.
   * Force strict **idempotency verification** against your active Redis container. Every incoming event ID must write to Redis under the key **`stripe_evt:{event_id}`** with a 24-hour TTL. If a duplicate event is processed, return an immediate `200 OK` to prevent duplicate billing or role assignments.
   * Handle the `customer.subscription.updated` event to update the organization's subscription status (`ACTIVE`, `PAST_DUE`, `CANCELED`) in the PostgreSQL database.
3. **Usage Metering Middleware (`BR-PLT-002`):**
   * Enforce subscription-level gates. For example, if a tenant is on the **Free Tier**, the system must block them if they exceed **3 active users**.
   * If a write operation breaches a tier limit, the endpoint must abort and return an HTTP 402 Payment Required response containing the standard **`ERR_BILLING_001`** error code.
4. **Angular Integration:**
   * Build a dedicated billing settings view in Angular where the user can see their current plan and trigger the Stripe portal redirect.

***

🚀 **Should I prepare the official, step-by-step technical copy-paste prompt for Jules / Antigravity to begin implementing Milestone 6 on the `track/6-stripe-billing` branch?**
