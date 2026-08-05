### **Issue 1: Database Schema Extensions & Alembic Migrations (Stripe Billing Integration)**
*   **Type:** 🛠️ Refactor / Migration (Backend)
*   **Track:** `track/6-stripe-billing`
*   **Description:** Extend the `organizations` database schema to support Indian market requirements (GSTIN, Billing State, INR processing), decoupled billing lifecycles, and webhook out-of-order protection.

#### **Technical Scope & Specifications**
1.  **Alembic Migration:** Add the following columns to the `organizations` table:
    *   `subscription_tier` (VARCHAR(20), default `'FREE'`, not null) — Decoupled from payment status.
    *   `subscription_status` (VARCHAR(20), default `'INACTIVE'`, not null) — e.g., `'ACTIVE'`, `'TRIALING'`, `'PAST_DUE'`, `'CANCELED'`.
    *   `stripe_customer_id` (VARCHAR(100), unique, indexed, nullable).
    *   `stripe_subscription_id` (VARCHAR(100), unique, indexed, nullable).
    *   `gstin` (VARCHAR(15), nullable) — Captures India's 15-character B2B Tax Identification Number.
    *   `billing_state` (VARCHAR(50), nullable) — Used to determine CGST/SGST vs. IGST.
    *   `ai_credits_used` (INTEGER, default `0`, not null).
    *   `bonus_ai_credits` (INTEGER, default `0`, not null) — Decouples subscription credits from promo grants.
    *   `last_billing_event_ts` (TIMESTAMPTZ, nullable) — Webhook order protection timestamp.
2.  **Safety Downgrade Path:** Ensure the downgrade script cleanly drops these columns without cascading into core tenant metadata.

#### **Definition of Done (DoD)**
- [ ] `alembic upgrade head` and `alembic downgrade -1` run with zero errors.
- [ ] Integration test confirms column presence and default values on newly provisioned organizations.

---

### **Issue 2: Stripe Customer Portal Redirection & Checkout Session Endpoint**
*   **Type:** 🔒 Feature (Backend)
*   **Track:** `track/6-stripe-billing`
*   **Dependencies:** Issue 1

#### **Description**
Expose endpoints to securely redirect B2B tenant owners to Stripe Checkout and the Stripe Billing Portal, configured strictly for INR native pricing, 3D Secure mandates, and Indian tax compliance.

#### **Technical Scope & Specifications**
1.  **Authorization Scope:** Protect both endpoints with the `tenant:billing` permission dependency (restricted to `TENANT_OWNER`).
2.  **Stripe Customer Provisioning:**
    *   If the organization lacks a `stripe_customer_id`, provision them dynamically via the Stripe API using their tenant owner email.
    *   Update PostgreSQL with the generated `stripe_customer_id` within an async transaction.
3.  **POST `/api/v1/billing/checkout` (Checkout Session):**
    *   Generate a Checkout Session restricted strictly to **INR currency**.
    *   Enforce **3D Secure** card authentication to comply with RBI e-Mandate rules (`payment_method_options={"card": {"request_three_d_secure": "any"}}`).
    *   Pass `allow_promotion_codes=True` to support promotional discounts.
    *   If B2B metadata (`gstin`, `billing_state`) is configured in the database, inject it as Customer tax IDs or enable Stripe Tax (`automatic_tax={"enabled": True}`) to enforce the mandatory **18% GST** invoicing.
4.  **POST `/api/v1/billing/portal` (Customer Billing Portal):**
    *   Generate a Stripe Billing Portal Session redirection URL linking to the tenant's `stripe_customer_id`.

#### **Definition of Done (DoD)**
- [ ] Endpoints return URLs wrapped in our standard response envelope.
- [ ] Integration tests verify that users without `tenant:billing` scopes are blocked with `ERR_RBAC_001` (HTTP 403).

---

### **Issue 3: Idempotent, Ordered Webhook Receiver with 3-State Redis Locking**
*   **Type:** 🔒 Security & Infrastructure (Backend)
*   **Track:** `track/6-stripe-billing`
*   **Dependencies:** Issue 1

#### **Description**
Implement an idempotent webhook receiver endpoint `/api/v1/billing/webhooks` with HMAC signature verification, a 3-State Redis Lock, and out-of-order payload protection.

#### **Technical Scope & Specifications**
1.  **Signature Verification:** Validate payload authenticity using the `Stripe-Signature` header matching the `STRIPE_WEBHOOK_SECRET`.
2.  **3-State Redis Locking Protocol:**
    *   **Locking State:** Attempt to acquire a short-lived processing lock: `SET stripe_lock:{event_id} "PROCESSING" NX EX 10`. If locked, return `423 Locked` or retry.
    *   **Transaction Execution:** Execute the database transaction. On success, commit and transition to:
    *   **Finalized State:** Save the permanent processing key: `SET stripe_evt:{event_id} "SUCCESS" EX 86400` (24-hour TTL).
    *   If the database transaction throws an error, delete `stripe_lock:{event_id}` to allow safe automated retries from Stripe.
3.  **Out-of-Order Webhook Protection:**
    *   Compare the event payload timestamp (`created`) against `last_billing_event_ts`.
    *   If the incoming timestamp is older than the stored value, silently discard the payload with a `200 OK`.
4.  **Billing Event Router:**
    *   `customer.subscription.updated`: Update `subscription_status` (e.g., `'ACTIVE'`, `'TRIALING'`) and `subscription_tier` based on active price IDs.
    *   `customer.subscription.deleted`: Gracefully demote organization tier to `'FREE'` and status to `'CANCELED'`.

#### **Definition of Done (DoD)**
- [ ] Webhook validation rejects spoofed signatures with HTTP 401.
- [ ] Concurrency tests prove that duplicate webhook hits trigger the Redis idempotency guard, processing the event exactly once.

---

### **Issue 4: Atomic Usage Metering Middleware & Soft-Lock Downgrade Policy**
*   **Type:** 🔒 Security & Middleware (Backend)
*   **Track:** `track/6-stripe-billing`
*   **Dependencies:** Issue 1, Issue 3

#### **Description**
Develop the usage-metering security layer to enforce subscription limits (active seats and AI credits) using atomic check-and-increment operations, and implement a soft-lock downgrade policy.

#### **Technical Scope & Specifications**
1.  **Atomic Metering Guard (TOCTOU Fix):**
    *   Avoid reading credits into Python memory before incrementing.
    *   Implement an **Atomic SQL Check-and-Increment query** that evaluates remaining credits and records consumption in a single database step:
        ```sql
        UPDATE organizations 
        SET ai_credits_used = ai_credits_used + :requested_credits
        WHERE id = :org_id 
          AND (subscription_tier = 'PRO' 
               OR subscription_tier = 'ENTERPRISE' 
               OR (ai_credits_used + :requested_credits <= 100 + bonus_ai_credits))
        RETURNING id;
        ```
    *   If the query returns empty (no rows updated), throw an HTTP 402 with code **`ERR_BILLING_001`**.
2.  **Soft-Lock Overage Policy:**
    *   Do **NOT** delete user roles or entities if a tenant downgrades from `'PRO'` to `'FREE'` with an active seat count exceeding the Free limit ($\le 3$ active users).
    *   Instead, intercept user registration and invitation endpoints: if active seats $> 3$, freeze write operations and block new invites with `ERR_BILLING_001` (HTTP 402) while preserving read access to their data.

#### **Definition of Done (DoD)**
- [ ] Integration tests verify that concurrent AI execution requests cannot bypass the monthly credit cap.
- [ ] Downgraded organizations with overage seat counts are soft-locked from adding users, but can read existing resources.

---

### **Issue 5: Angular Standalone Billing Dashboard & Stripe Redirect Integration**
*   **Type:** 🎨 Feature (Frontend)
*   **Track:** `track/6-stripe-billing`
*   **Dependencies:** Issue 2

#### **Description**
Create the standalone Angular Settings Billing Dashboard displaying active pricing tiers, dynamic B2B tax parameter forms (GSTIN & State), usage metering visualizations, and portal redirects.

#### **Technical Scope & Specifications**
1.  **UI Components & Architecture:**
    *   Implement a standalone `BillingDashboardComponent` with `ChangeDetectionStrategy.OnPush`.
    *   Incorporate glassmorphism dark aesthetics matching our design guidelines.
2.  **Usage Visualizations (Angular Signals):**
    *   Expose reactive Signals tracking: User Seats (current vs. maximum) and Monthly AI Credit consumption (credits used vs. credits remaining).
    *   Display a warning toast if the organization has triggered a **Soft-Lock Overage** state.
3.  **GSTIN & Billing State Form:**
    *   Expose a B2B profiling form with synchronous validation matching the 15-character alphanumeric **GSTIN regex format**.
    *   Patch modifications securely to the `/api/v1/organizations/me` endpoint.
4.  **Stripe Redirect Integration:**
    *   Pipe clicks on "Manage Billing" or "Upgrade Now" to the backend portal sessions and checkout session endpoints.
    *   Redirect the browser smoothly to Stripe's hosted session on a successful response.

#### **Definition of Done (DoD)**
- [ ] Component compiles cleanly within style constraints, keeping budgets under 10kB.
- [ ] Frontend successfully redirects users to Stripe Test Mode checkout and brings them back to the application dashboard.

---

### 📋 Copy-Paste Prompt for Jules / Antigravity

```markdown
USER_REQUEST:
We are launching Milestone 6: Billing & Subscription Engine (Stripe Integration). 
The goal of this track is to implement a robust, idempotent billing lifecycle tailored specifically to the Indian business market (INR currency, RBI e-Mandate compliance, and B2B GST tax billing), complete with atomic usage metering and soft-lock downgrade overage protection.

You must strictly implement this work off the 'develop' branch on a clean feature branch.

Please execute the following tasks:

1. GIT BRANCH & WORKFLOW
- Create and switch to a new local feature branch off 'develop' named exactly: track/6-stripe-billing
- Follow strict Human-in-the-Loop guidelines: Do NOT attempt to push directly to 'main' or 'develop'. All deliverables must be prepared for a Draft Pull Request.
- All commit messages must follow the Conventional Commits specification (e.g., "feat(billing): implement idempotent stripe webhook and atomic usage metering").

2. DATABASE SCHEMA EXTENSIONS & ALEMBIC MIGRATIONS (Stripe Billing Integration)
Create an Alembic database migration to extend our 'organizations' table with these fields:
- subscription_tier (VARCHAR(20), default 'FREE', not null)
- subscription_status (VARCHAR(20), default 'INACTIVE', not null)
- stripe_customer_id (VARCHAR(100), unique, indexed, nullable)
- stripe_subscription_id (VARCHAR(100), unique, indexed, nullable)
- gstin (VARCHAR(15), nullable) — Captures India's 15-character B2B GST Identification Number.
- billing_state (VARCHAR(50), nullable) — Captures the state name (e.g., 'Maharashtra', 'Karnataka') for GST tax mapping.
- ai_credits_used (INTEGER, default 0, not null)
- bonus_ai_credits (INTEGER, default 0, not null)
- last_billing_event_ts (TIMESTAMPTZ, nullable)

3. STRIPE CUSTOMER PORTAL REDIRECTION & CHECKOUT SESSION ENDPOINT
- Expose 'POST /api/v1/billing/checkout' & 'POST /api/v1/billing/portal':
  * Authenticate user session, validate the 'X-Organization-Id' header context, and restrict access strictly to users with 'tenant:billing' permissions (TENANT_OWNER role).
  * Dynamically provision a Stripe customer using their active tenant details if 'stripe_customer_id' is missing.
  * Checkout Sessions must enforce INR pricing, 3D Secure verification (RBI e-Mandate compliance: payment_method_options={"card": {"request_three_d_secure": "any"}}), allow promotional discount codes, and integrate Stripe Tax (automatic_tax={"enabled": True}) or an explicit 18% Tax Rate using the database 'gstin' and 'billing_state'.

4. IDEMPOTENT, ORDERED WEBHOOK RECEIVER WITH 3-STATE REDIS LOCKING
- Expose public endpoint 'POST /api/v1/billing/webhooks':
  * Enforce HMAC SHA-256 Stripe signature verification.
  * Implement the 3-State Redis Lock protocol:
    1. Lock: Acquire 'stripe_lock:{event_id}' NX EX 10. If locked, abort.
    2. Execute: Run async PostgreSQL updates.
    3. Finalize: Set permanent key 'stripe_evt:{event_id}' EX 86400 (24-hr TTL) on successful DB commit. Delete temporary lock on DB failure to allow Stripe retries.
  * Out-of-Order Delivery Protection: Compare incoming event timestamp against organization 'last_billing_event_ts'. If older, discard the payload safely with a 200 OK response.
  * Handle events 'customer.subscription.updated' and 'customer.subscription.deleted' to update PostgreSQL metadata.

5. ATOMIC USAGE METERING MIDDLEWARE & SOFT-LOCK DOWNGRADE POLICY
- In our BR-PLT-002 check, implement an Atomic check-and-increment SQL query to increment and log monthly AI credits in a single transaction step:
  "UPDATE organizations SET ai_credits_used = ai_credits_used + :requested_credits WHERE id = :org_id AND (subscription_tier = 'PRO' OR subscription_tier = 'ENTERPRISE' OR (ai_credits_used + :requested_credits <= 100 + bonus_ai_credits)) RETURNING id;"
- If empty, throw an HTTP 402 with code 'ERR_BILLING_001'.
- Soft-Lock Overage: If a tenant downgrades from PRO to FREE with overage users (active users > 3), do not delete data. Instead, freeze user invites and write operations (returning HTTP 402 'ERR_BILLING_001'), while keeping their existing workspace records readable.

6. ANGULAR STANDALONE BILLING DASHBOARD & STRIPE REDIRECT INTEGRATION
- Create standalone 'BillingDashboardComponent' in our frontend utilizing Angular Signals and ChangeDetectionStrategy.OnPush.
- Display current subscription tier, active plan status, dynamic usage meters (used vs. max seats, used vs. max credits), and a soft-lock warning alert if active.
- Build B2B profiling forms validating the 15-character Indian GSTIN alphanumeric schema.
- Wire button triggers to launch the billing checkout and redirection flows.

7. INTEGRATION TESTING GATES
- Write robust integration tests in 'backend/tests/':
  * Verify forged webhook signatures fail with 401 Unauthorized.
  * Verify Redis webhook double-spend protection (idempotency key matches).
  * Verify atomic credit consumption limits under concurrent test requests.
  * Verify downgraded, over-limit seat structures are soft-locked from inviting users.

When complete, verify all tests pass locally (pytest -v), commit your changes to 'track/6-stripe-billing', and submit a Draft Pull Request.
```

---

🤖 **Jules has all the parameters required to execute Milestone 6 safely and cleanly!** Let me know once the branch is active and you're ready to run an architectural audit of the Redis locks and atomic SQL check-and-increment operations.
