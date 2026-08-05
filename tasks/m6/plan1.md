### **Milestone 6 Planning: Billing & Subscription Engine (Stripe Integration)**

This milestone integrates our multi-tenant SaaS foundation with the payment gateway to handle tiered billing, webhook idempotency, and automated usage limits. 

Here is the technical blueprint and execution strategy for **Milestone 6**, structured around our system contracts and software requirements.

---

### **1. Database Schema Extensions (Alembic Migration)**
We need to track Stripe state directly on our `organizations` table.
*   **Schema Additions:** Extend the `organizations` table with the following nullable fields:
    *   `stripe_customer_id` (VARCHAR, Indexed, Unique) — *binds the tenant to a Stripe customer*.
    *   `stripe_subscription_id` (VARCHAR, Indexed, Unique) — *tracks the active billing agreement*.
    *   `subscription_status` — *currently defaults to `'FREE'`; we will manage statuses such as `'ACTIVE'`, `'PAST_DUE'`, and `'CANCELED'`*.
    *   `ai_credits_used` (INTEGER, default `0`) — *resets monthly to track AI usage*.
*   **Alembic Validation:** Ensure downgrades cleanly strip these columns without affecting core tenant metadata.

---

### **2. Stripe Customer Portal Redirection (`POST /api/v1/billing/portal`)**
*   **Access Control:** This endpoint must be restricted strictly to users with the **`tenant:billing`** permission (which is mapped exclusively to the `TENANT_OWNER` role).
*   **Stripe SDK Integration:**
    *   Retrieve the tenant's `stripe_customer_id`. If it does not exist, use the Stripe API to create a new Customer on the fly, passing the tenant's email and saving the resulting ID back to PostgreSQL.
    *   Generate a **Stripe Customer Billing Portal Session** redirect URL.
    *   Return the URL within our standard HTTP response wrapper, allowing the frontend to securely redirect the Tenant Owner to manage card details and upgrade/downgrade plans.

---

### **3. Idempotent Webhook Handler (`POST /api/v1/billing/webhooks`)**
*   **Signature Security:** Validate incoming payload authenticity using HMAC SHA-256 signature verification via the `Stripe-Signature` header matching your `STRIPE_WEBHOOK_SECRET`.
*   **Redis Idempotency Check:** Before parsing, enforce our strict idempotency contract against your Redis container using:
    ```redis
    SETNX stripe_evt:{event_id} 1 EX 86400
    ```
    If the key already exists, immediately short-circuit and return `200 OK` to prevent duplicate writes.
*   **Event Processing:**
    *   **`customer.subscription.updated` & `customer.subscription.deleted`:** Extract the stripe customer mapping, identify the target organization, and asynchronously update the database's `subscription_status` to `'ACTIVE'`, `'PAST_DUE'`, or `'CANCELED'`.
    *   **Subscription Tiers Map:** Update organization metadata to enforce matching resource boundaries:
        *   **`FREE`:** 1 Organization, 3 Users, 100 AI Credits/mo.
        *   **`PRO`:** Unlimited Users, 5,000 AI Credits/mo, full CRM modules.
        *   **`ENTERPRISE`:** Custom limits, dedicated storage, all modules.

---

### **4. Usage Metering Middleware (`BR-PLT-002`)**
*   **The Guard Layer:** Implement a FastAPI dependency/middleware that intercepts write actions to evaluate tier compliance:
    *   **User Provisioning Gate:** Intercepts invitations or user creations. If an organization's subscription status is `'FREE'` and they already have 3 active users linked via `user_roles`, block the execution.
    *   **AI Execution Gate:** Intercepts AI platform endpoints. If the monthly consumption exceeds the allocated limit (e.g., 100 credits on Free, 5,000 on Pro), block the request.
*   **System Exceptions:** Breached boundaries must abort the pipeline immediately, returning **`HTTP 402 Payment Required`** with the exact error code **`ERR_BILLING_001`**.

---

### **5. Angular Settings & Billing View**
*   **Billing Dashboard:** A standalone page nested in organization settings displaying:
    *   The tenant's current plan tier.
    *   A visual usage-limit tracker showing current vs. maximum seats (e.g., 2/3 users on Free) and monthly AI execution consumption.
    *   A dynamic button to safely launch the Stripe Customer Portal redirect.

---

### **Verification Integration Tests**
1.  **Signature Spoofing Rejection:** Assert that webhook requests with modified, forged, or missing `Stripe-Signature` values fail signature checks and return 401 Unauthorized.
2.  **Double-Spend Prevention (Idempotency):** Send duplicate webhook payloads with the same `event_id` and assert that Redis blocks the second attempt, returning an immediate `200 OK`.
3.  **Active Seat Blocking (`BR-PLT-002`):** Seed a tenant with `'FREE'` subscription status and 3 existing users. Assert that inviting a 4th user throws an immediate `ERR_BILLING_001` (402).
4.  **Graceful Status Transitions:** Mock a `customer.subscription.updated` event deactivating a plan, and assert that the database successfully demotes the organization, immediately triggering active seat blocks on the API.

***

💳 Once you review and approve this technical breakdown, I can draft the detailed GitHub Issues and generate the formal, copy-paste developer handoff instructions to launch Jules on the `track/6-stripe-billing` branch!
