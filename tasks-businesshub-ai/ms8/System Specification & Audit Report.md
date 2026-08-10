System Specification & Audit Report: BusinessHub AI (Modules 0, 1, 2, 5)

1. EXECUTIVE SUMMARY

The BusinessHub AI platform has achieved a milestone state with the successful merging of Milestones 1 through 8 into the develop branch. This technical audit confirms that the platform now possesses a production-ready foundation for a multi-tenant AI SaaS ecosystem. By orchestrating identity management, Indian-market compliant billing, and centralized intelligence into a unified architecture, the system is verified to support enterprise-grade operations with high scalability and zero-trust security.

Project Status Dashboard

Module ID	Module Name	Completion Status (%)	Integration State
Module 0	Core Platform, Auth & Multi-Tenancy	100%	Fully Integrated
Module 1	Billing & Subscription Engine	100%	Fully Integrated
Module 2	CRM Engine	100%	Fully Integrated
Module 5	Centralized AI Platform	100%	Fully Integrated

Core Architectural Mandate The system implementation was audited against three non-negotiable architectural pillars:

1. Clean Architecture: Verified separation of concerns (Domain → Application → Infrastructure → API), eliminating network latency and ensuring logical domain boundaries.
2. Row-Level Isolation: A robust multi-tenant strategy where every entity is bound to an organization_id, enforced via FastAPI middleware and SQLAlchemy query scopes.
3. AI-First Design: A centralized gateway pattern providing grounded Retrieval-Augmented Generation (RAG) and document intelligence across all modules.

The following sections provide a rigorous technical audit and functional specification for these verified system components.

2. MODULE 0: CORE PLATFORM, AUTHENTICATION & MULTI-TENANCY

Strategic Context The BusinessHub AI ecosystem operates on a "Zero-Trust" multi-tenant architecture. This design ensures that tenant data is never leaked across boundaries, serving as the non-negotiable security baseline for enterprise-grade compliance.

2.1 Functional Specification: Onboarding & Tenant Bootstrapping Under the FR-CORE-01 requirement, the system enforces strict validation for organization slugs using the regex ^[a-z0-9]+(?:-[a-z0-9]+)*$, with a mandatory length of 3–30 characters. The audit verified that the creation of the User, Organization, and the TENANT_OWNER role is executed within a single, atomic database transaction. This prevents orphaned records and ensures the tenant creator is granted universal administrative privileges ("TENANT_OWNER": ["*"]) immediately upon registration.

2.2 Technical Specification: Cryptography & Session Management Authentication is handled via an RS256 asymmetric cryptosystem utilizing 2048-bit RSA keys. The implementation enforces Refresh Token Rotation with automatic revocation upon reuse detection. Access tokens are short-lived (15 minutes), while refresh tokens (7-day TTL) are served strictly via HttpOnly, SameSite=Strict, and Secure cookies. Session state is tracked in Redis using the contract sess:{user_id}:{token_id}, enabling immediate session revocation and granular lifecycle management.

2.3 Middleware & Context Isolation The FastAPI ASGI Multi-Tenant Isolation Middleware intercepts all requests to extract the X-Organization-Id header. It utilizes thread-safe ContextVars to store the current_tenant_id, which is then bound to the SQLAlchemy session via db.info["tenant_id"]. This ensures that every database query automatically appends a WHERE organization_id = :current_org_id filter, preventing data leakage at the ORM layer.

2.4 RBAC Engine & Caching Strategy Access control is enforced through the RequiresPermission declarative dependency. To optimize performance, the system utilizes a Redis-cached RBAC contract (org:{org_id}:usr:{user_id}:perms) with a 15-minute TTL. The audit confirmed that the evict_user_permissions_cache routine is successfully triggered by database role updates to ensure real-time security enforcement.

2.5 Standardized Security Error Envelopes

Error Code	HTTP Status	Trigger Condition
ERR_AUTH_001	401 Unauthorized	Missing, expired, or invalid JWT/session.
ERR_TENANT_001	403 Forbidden	Missing X-Organization-Id or cross-tenant access attempt.
ERR_RBAC_001	403 Forbidden	Authenticated user lacks the required permission scope.

The security foundation established here enables the secure deployment of the commercial monetization layer described in the next section.

3. MODULE 1: BILLING & SUBSCRIPTION ENGINE

Strategic Context Global SaaS scalability requires a compliant billing engine. For BusinessHub AI, this involves addressing the complexities of the Indian regulatory landscape (RBI/GST) to ensure financial transactions are secure and legally sound.

3.1 Functional Specification: Multi-Tier Subscriptions The platform implements a three-tier model integrated with the Stripe Customer Portal:

* Free: 1 Organization, 3 Users, 100 AI Credits/mo.
* Pro: Unlimited Users, 5,000 AI Credits/mo, Full CRM access.
* Enterprise: Custom limits, Dedicated Storage, and all operational modules.

3.2 Indian Market Regulatory Compliance The engine is adapted for the Indian market through:

* Currency & Compliance: All transactions are locked to INR. 3D Secure e-Mandates are enforced for RBI AFA compliance.
* Tax Logic: The system captures 15-character GSTINs and Billing States. It programmatically determines CGST/SGST vs. IGST (18% B2B GST) based on the organization's location relative to the service provider state, ensuring valid tax invoicing.

3.3 Webhook Hardening & Concurrency Control To mitigate double-spending, the system employs a 3-State Redis Webhook Lock (stripe_lock:{event_id} vs stripe_evt:{event_id}). Out-of-order protection is managed via the last_billing_event_ts field. For credit consumption, the system uses Atomic SQL Check-and-Increment queries utilizing the UPDATE ... RETURNING pattern, solving TOCTOU (Time-of-Check to Time-of-Use) race conditions during concurrent AI requests.

3.4 Soft-Lock Overage Policy (BR-PLT-002) The system enforces a "Soft-Lock" policy for plan downgrades. If active seat counts exceed tier limits (e.g., >3 users on Free), the system freezes write and invitation flows, returning ERR_BILLING_001 (HTTP 402) while maintaining read-only access. This state persists until the tenant upgrades or reduces their seat count.

This billing status (ACTIVE/PAST_DUE) directly governs the availability of CRM write-access, transitioning the system from financial management to operational execution.

4. MODULE 2: CRM ENGINE

Strategic Context The CRM is the primary engagement engine, combining a reactive UI with strict isolation to provide a high-performance sales environment.

4.1 Functional Specification: Kanban Pipeline & Team Management The CRM utilizes an Angular-based Kanban board with stages: LEAD, QUALIFIED, PROPOSAL, WON, and LOST. The audit verified the functional flow of team invitations, allowing Tenant Owners to scale their workforce within tiered RBAC constraints.

4.2 Technical Specification: Secure Invitation Engine Team expansion is secured via one-way SHA-256 database token_hash keys rather than plaintext URL tokens. Invitations expire after 48 hours. Upon acceptance, the system executes the automated permission cache eviction routine to synchronize the new user's access rights.

4.3 Multi-Tenant Isolation (Horizontal & Vertical) Horizontal isolation is enforced through mandatory organization_id and deleted_at filters. For cross-tenant UUID misses, the system is configured to return ERR_NOT_FOUND_001 (HTTP 404) rather than 403 Forbidden; this is a critical security measure to prevent attackers from performing metadata scanning to verify the existence of specific record IDs.

4.4 Frontend Reactive Architecture The frontend is built exclusively using Standalone Components, rejecting NgModules for better tree-shaking and performance. Angular Signals and the ChangeDetectionStrategy.OnPush mandate (applied to every component) ensure fine-grained reactivity. The "Optimistic Update" pattern in the Kanban board includes an automated local Signal rollback mechanism to handle backend write errors.

The structured data within the CRM provides the necessary grounded context for the AI processing capabilities detailed in the final section.

5. MODULE 5: CENTRALIZED AI PLATFORM

Strategic Context The centralized AI Gateway reduces provider coupling and ensures that intelligence remains grounded and securely isolated across all tenant organizations.

5.1 The AI Gateway Pattern The AiGatewayService isolates provider API keys and manages versioned prompt templates (e.g., lead_scoring_v1). All interactions utilize the Standard API Response Wrapper to ensure a consistent envelope across the platform.

5.2 Row-Level Vector Isolation Vector search is implemented via PostgreSQL pgvector utilizing 1536-dimension embeddings. The search logic is verified to enforce tenant filtering within cosine similarity queries. Any unauthenticated or cross-tenant search attempt is intercepted, throwing ERR_RBAC_001.

5.3 Asynchronous Processing Pipeline Document ingestion utilizes a Celery/Redis pipeline with idempotent locks (ai_lock:doc:{document_id}). The pipeline handles LLM rate limits (HTTP 429) through exponential backoff logic.

5.4 Job Status API & Reactive Integration The contract for GET /api/v1/ai/jobs/{job_id} is integrated into the Angular frontend using Signals. Status polling is achieved via the toSignal() or effect() reactive patterns, providing real-time updates on background processing.

5.5 Integrated Copilot Features The AI Platform delivers two verified functional outputs for Module 2:

* Lead Scoring Copilot: Generates intent signals and 0–100 scores based on interaction history.
* Draft Follow-Up: Synthesizes context-aware email drafts from historical deal notes.

This report confirms a fully integrated, secure, and production-grade system across Modules 0, 1, 2, and 5.
