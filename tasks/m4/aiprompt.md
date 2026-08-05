## Hinglish
Ye lo Milestone 4 (Multi-Tenant Onboarding & User Services) code karne ke liye **Jules / Antigravity** ko dene wala official, production-grade handoff prompt — pure **Hinglish** (with exact technical terms intact) mein translated:

---

### 📋 Copy-Paste Prompt for Jules / Antigravity

**USER_REQUEST:**

Humne `develop` branch par **Milestone 3 (Core Security & Multi-Tenant Framework)** successfully complete aur verify kar liya hai.

Aapka goal **Milestone 4** ke liye Multi-Tenant Self-Service Onboarding aur User Management Services build karna hai, jismein database interactions ko **Async SQLAlchemy 2.0 Repositories** par shift karna hai aur ek unified, transaction-isolated registration pipeline implement karni hai.

Please niche diye gaye tasks complete karein:

#### 1. GIT BRANCH & WORKFLOW

* **New Branch:** `develop` branch se off ho kar ek nayi local feature branch create karein aur uspar switch karein, jiska exact naam ho: `track/4-tenant-onboarding`
* **Strict Human-in-the-Loop Guidelines:** Direct `main` ya `develop` par push karne ki bilkul koshish na karein. Sabhi deliverables **Draft Pull Request** ke liye prepared hone chahiye.
* **Commit Messages:** Sabhi commit messages **Conventional Commits** specification follow karne chahiye (e.g., `"feat(auth): implement unified multi-tenant onboarding with async repositories"`).

---

#### 2. DATA TRANSFER SCHEMAS (Pydantic v2)

`backend/app/schemas/auth.py` (ya ek dedicated schema package) ke andar:

* **Onboarding Request Payload Schema create karein (e.g., `OnboardTenantRequest`):**
* **Organization Fields:** `name` (`str`, 3-100 chars), `slug` (`str`)
* **User Fields:** `email` (`str`), `password` (`str`, minimum 8 characters), `full_name` (`str`)


* **Input Parameters par strict validation rules enforce karein:**
* Email ka format valid hona chahiye (e.g., Pydantic `EmailStr`) aur woh globally unique hona chahiye.
* Organization ka Slug sirf lowercase alphanumeric aur dashes ke sath hona chahiye, aur length 3 se 30 characters ke beech honi chahiye. Regex constraint: `^[a-z0-9-]{3,30}$`
* Agar validation fail hoti hai, toh HTTP `422` ke sath system error code `ERR_VALIDATION_001` return karein.



---

#### 3. ASYNC DATABASE REPOSITORIES

Database queries ko raw inline endpoints se hata kar dedicated repository classes mein migrate karein:

* **`backend/app/repositories/organization_repository.py` create karein:**
* Organization ko save karne aur ID ya slug ke base par query karne ke liye async methods implement karein.


* **`backend/app/repositories/user_repository.py` create karein:**
* User ko save karne, ID ke base par query karne, aur email ke base par query karne ke liye async methods implement karein.


* **Async Syntax Only:** Ensure karein ki sabhi repositories exclusively **Async SQLAlchemy 2.0** select aur execute syntax (e.g., `select()`, `execute()`) ka hi use karein. Legacy `session.query()` use karna strictly forbidden hai.

---

#### 4. UNIFIED SELF-SERVICE ONBOARDING PIPELINE (`POST /api/v1/auth/onboard`)

Functional requirement **FR-CORE-01** ko follow karte hue registration endpoint `POST /api/v1/auth/onboard` create karein:

* Ye endpoint **public** hona chahiye (tenant isolation middleware ko bypass kare).
* **Atomic ACID Transaction Guarantee:** Database operations ko ek single async database transaction context (e.g., `async with db.begin():`) ke andar wrap karein. Is single transaction ke andar ye actions execute karein:
1. Email aur organization slug ki uniqueness verify karein. Agar donon mein se koi bhi exist karta hai, toh HTTP `400` ya HTTP `409` raise karein aur roll back kar dein.
2. `Organization` record create aur persist karein.
3. Password ko hash karein aur `User` record create karein.
4. Newly created organization ke andar user ko `user_roles` junction table mein record insert karke `'TENANT_OWNER'` ka role assign karein.


* *Note: Agar koi bhi step fail hota hai, toh database strictly completely roll back hona chahiye — ensure karein ki koi bhi partial ya orphaned records write na hon.*


* **Automated Authentication Context:** Successful database transaction commit hone par, automatically ye actions perform karein:
1. User details aur active role ke sath ek valid **RS256 JWT Access Token** (15-min expiry) generate karein.
2. Key pattern `sess:{user_id}:{token_id}` par 7-day TTL ke sath ek active stateful **Redis session** create karein.
3. **Refresh Token** (7-day expiry) ko strictly ek secure, `HttpOnly`, `SameSite=Strict` cookie mein inject karein.
4. Hamare standard system contract envelope se match karta hua ek `201 Created` response return karein.



---

#### 5. INTEGRATION TESTING GATES

`backend/tests/test_onboarding.py` mein robust integration tests write karein jo ye assert karein:

* Successful onboarding database records create karta hai, Redis session register karta hai, aur authentication cookies/payload return karta hai.
* Invalid slug payloads ya duplicate emails ke case mein database transaction cleanly roll back ho jata hai (verify karein ki koi orphaned organizations ya users write na hue hon).
* Invalid schema inputs standard HTTP `422` throw karte hain jismein `'ERR_VALIDATION_001'` error code present ho.

Jab kaam complete ho jaye, toh verify karein ki sabhi tests locally pass ho rahe hain (`pytest -v`), apne work ko `track/4-tenant-onboarding` branch par commit karein, aur architectural review ke liye ek **Draft Pull Request** submit karein.

---

Ye prompt self-service onboarding, transaction handling, aur repository patterns ki exact specifications ko Jules ke liye clear steps mein translate karta hai.

📊 **Ek baar jab Jules onboarding endpoint complete kar le, toh kya aap chahenge ki main frontend Angular interceptor ka ek template outline karun jo outbound API requests mein automatically active tenant ID inject kare?**
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
