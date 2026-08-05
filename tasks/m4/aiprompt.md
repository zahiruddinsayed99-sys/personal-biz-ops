Here is the official, production-grade handoff prompt to give to **Jules / Antigravity** to begin coding **Milestone 4 (Multi-Tenant Onboarding & User Services)**.

This prompt is mapped directly to our core system contracts, functional requirements, and folder conventions, ensuring that the multi-entity registration endpoint is executed as a single, atomic ACID transaction.

***

### 📋 Copy-Paste Prompt for Jules / Antigravity

```markdown
USER_REQUEST:
We have successfully completed and verified Milestone 3 (Core Security & Multi-Tenant Framework) on the 'develop' branch. 

Your goal for Milestone 4 is to build the Multi-Tenant Self-Service Onboarding and User Management Services, shifting database interactions to Async SQLAlchemy 2.0 Repositories and implementing a unified, transaction-isolated registration pipeline.

Please execute the following tasks:

1. GIT BRANCH & WORKFLOW
- Create and switch to a new local feature branch off 'develop' named exactly: track/4-tenant-onboarding
- Follow strict Human-in-the-Loop guidelines: Do NOT attempt to push directly to 'main' or 'develop'. All deliverables must be prepared for a Draft Pull Request.
- All commit messages must follow the Conventional Commits specification (e.g., "feat(auth): implement unified multi-tenant onboarding with async repositories").

2. DATA TRANSFER SCHEMAS (Pydantic v2)
In `backend/app/schemas/auth.py` (or a dedicated schema package):
- Create the onboarding request payload schema (e.g., `OnboardTenantRequest`):
  * Organization Fields: 'name' (str, 3-100 chars), 'slug' (str)
  * User Fields: 'email' (str), 'password' (str, minimum 8 characters), 'full_name' (str)
- Enforce strict validation rules on input parameters:
  * Email must be a valid format (e.g., Pydantic EmailStr) and globally unique.
  * Organization Slug must be lowercase alphanumeric with dashes only, between 3 and 30 characters. Regex constraint: ^[a-z0-9-]{3,30}$
  * If validation fails, return HTTP 422 with system error code 'ERR_VALIDATION_001'.

3. ASYNC DATABASE REPOSITORIES
Migrate database queries away from raw inline endpoints into dedicated repository classes:
- Create `backend/app/repositories/organization_repository.py`:
  * Implement async methods to save an organization and query an organization by ID or slug.
- Create `backend/app/repositories/user_repository.py`:
  * Implement async methods to save a user, query by ID, and query by email.
- Ensure all repositories exclusively use Async SQLAlchemy 2.0 select and execute syntax (e.g., select(), execute()). Legacy session.query() is forbidden.

4. UNIFIED SELF-SERVICE ONBOARDING PIPELINE (POST /api/v1/auth/onboard)
Create the registration endpoint `POST /api/v1/auth/onboard` following functional requirement FR-CORE-01:
- The endpoint must be public (bypass the tenant isolation middleware).
- **Atomic ACID Transaction Guarantee:** Wrap the database operations inside a single async database transaction context (e.g., `async with db.begin():`). Inside this single transaction, execute:
  1. Verify email and organization slug uniqueness. If either exists, raise an HTTP 400 or HTTP 409 and roll back.
  2. Create and persist the `Organization` record.
  3. Hash the password and create the `User` record.
  4. Assign the user the role of 'TENANT_OWNER' within the newly created organization by inserting a record into the 'user_roles' junction table.
  * *If any step fails, the database must roll back completely, ensuring no partial or orphaned records are written.*
- **Automated Authentication Context:** On successful database transaction commit, automatically:
  1. Generate a valid RS256 JWT Access Token (15-min expiry) containing the user's details and active role.
  2. Create an active stateful Redis session on the key pattern `sess:{user_id}:{token_id}` with a 7-day TTL.
  3. Inject the Refresh Token (7-day expiry) strictly into a secure, HttpOnly, SameSite=Strict cookie.
  4. Return a 201 Created response matching our standard system contract envelope.

5. INTEGRATION TESTING GATES
Write robust integration tests in `backend/tests/test_onboarding.py` to assert:
- Successful onboarding creates the database records, registers the Redis session, and returns the authentication cookies and payload.
- Database transaction rolls back cleanly on invalid slug payloads or duplicate emails (verify no orphaned organizations or users are written).
- Invalid schema inputs throw the standard HTTP 422 containing the 'ERR_VALIDATION_001' error code.

When complete, verify all tests pass locally (`pytest -v`), commit your work to 'track/4-tenant-onboarding', and submit a Draft Pull Request for architectural review.
```

***

This prompt translates the exact specifications for self-service onboarding, transaction handling, and repository patterns into clear steps for Jules.

📊 Once Jules has completed the onboarding endpoint, would you like me to outline a template for the frontend Angular interceptor to dynamically inject the active tenant ID into outbound API requests?
