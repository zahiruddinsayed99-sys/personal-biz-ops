### **Subject: Architectural Updates & Indian Market Compliance for Milestone 6 (Stripe Billing Engine)**

Hi [Principal Architect Name / NotebookLM],

As we are in the planning phase of **Milestone 6 (Billing & Subscription Engine)**, we have conducted a technical review of the initial blueprint. Since our SaaS target audience and business operations are India-based, we need to adapt the Stripe integration to comply with Indian regulatory frameworks (RBI & GST) while hardening our system architecture against race conditions and adding promotional trial support.

Please review and incorporate the following strategic modifications into the Milestone 6 Technical Blueprint:

---

### **1. Indian Regulatory Compliance & Financials (INR & Tax Ready)**

* **INR Pricing & RBI e-Mandate Compliance:**
* All Stripe products/prices must be configured in **INR (`INR` currency)**.
* To comply with RBI’s e-Mandate and AFA (Additional Factor of Authentication) regulations for recurring card auto-debits, Stripe Checkout Sessions must be explicitly configured to support **3D Secure (`challenge`)** and recurring mandate registration.


* **18% GST Compliance (B2B Tax Invoicing):**
* Extend tenant billing metadata to capture the organization's **GSTIN** and **Billing State** (for CGST/SGST vs. IGST determination).
* Integrate Stripe Tax (`automatic_tax={"enabled": True}`) or attach an explicit 18% Tax Rate to invoices so B2B customers receive valid GST tax invoices for Input Tax Credit (ITC).



---

### **2. Promotional Strategy & Trial Engine Support**

We need to support limited free promotion options for acquisition and marketing campaigns:

* **Time-Based Free Trials:** Support a 14-day or 30-day trial period (`subscription_status = 'TRIALING'`) mapped via Stripe’s `trial_period_days` without requiring upfront charges.
* **Stripe Promotion Codes:** Ensure `allow_promotion_codes=True` is enabled on the Checkout & Customer Portal endpoints to accept discount coupons (e.g., percentage or fixed-amount off).
* **Manual Promotional Credit Grants:** Add a `bonus_ai_credits` column to decouple base monthly credits from promotional one-off credit grants.

---

### **3. Core Architectural Hardening (Risk Mitigation)**

* **Schema Decoupling:** Separate `subscription_tier` (`FREE`, `PRO`, `ENTERPRISE`) from `subscription_status` (`ACTIVE`, `TRIALING`, `PAST_DUE`, `CANCELED`). Do not conflate commercial tiers with billing lifecycle states.
* **Webhook Idempotency & Order Protection:**
* Implement a short-lived **3-State Redis Lock** (`lock` $\rightarrow$ `DB Transaction` $\rightarrow$ `done` key) so failed DB writes release the lock and allow Stripe automated retries.
* Add a `last_billing_event_ts` column to silently discard out-of-order webhook delivery payloads.


* **Atomic Metering (TOCTOU Fix):**
* In `BR-PLT-002`, replace Python-level credit limit checks with an **Atomic DB Check-and-Increment SQL query** to prevent credit leakage under concurrent AI requests.


* **Downgrade Overage Policy (Soft-Lock):**
* When a tenant downgrades from PRO to FREE, do not automatically delete existing users/resources. Instead, implement a **Soft-Lock Overage Policy**: freeze new user invitations (`402 ERR_BILLING_001`) until the active seat count falls below the FREE limit ($\le 3$).



---

### **4. Revised `organizations` Table Schema Additions (Alembic)**

```sql
ALTER TABLE organizations
  ADD COLUMN stripe_customer_id VARCHAR(255) UNIQUE,
  ADD COLUMN stripe_subscription_id VARCHAR(255) UNIQUE,
  ADD COLUMN stripe_price_id VARCHAR(255),               -- For Plan Versioning / Grandfathering
  ADD COLUMN currency VARCHAR(3) DEFAULT 'INR',
  ADD COLUMN subscription_tier VARCHAR(50) DEFAULT 'FREE',
  ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'ACTIVE',
  ADD COLUMN gstin VARCHAR(15),                          -- B2B GSTIN compliance
  ADD COLUMN billing_state VARCHAR(50),                  -- State code for GST tax routing
  ADD COLUMN trial_ends_at TIMESTAMPTZ,                  -- Promotional free trial anchor
  ADD COLUMN bonus_ai_credits INTEGER DEFAULT 0,         -- One-off promotional credits
  ADD COLUMN ai_credits_used INTEGER DEFAULT 0,
  ADD COLUMN billing_period_end TIMESTAMPTZ,             -- Anchor for monthly credit reset
  ADD COLUMN last_billing_event_ts BIGINT DEFAULT 0;     -- Out-of-order webhook protection

```
Please make a note on this project that, we need to consider Indian business market, so all implement should go in that directions only.
