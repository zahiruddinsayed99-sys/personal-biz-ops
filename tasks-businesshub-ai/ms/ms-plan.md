## Milestone 1: Monetization & PRO Tier (Phase 2)

* **Issue 1: Build Pricing & Upgrade Modal (Frontend)**
* Create a pricing tier component outlining PRO benefits.
* Integrate a dummy checkout form simulating a 2-second payment processing state.


* **Issue 2: Implement Billing Upgrade Endpoint (Backend)**
* Create `POST /api/v1/billing/upgrade` to accept dummy payment tokens.
* Update the organization's database record to the `PRO` tier upon success.


* **Issue 3: Seamless Session Refresh (Full Stack)**
* Return a fresh JWT containing the updated PRO role upon successful upgrade.
* Update the Angular session state to unlock PRO UI features instantly without requiring a hard logout.



## Milestone 2: UI/UX Standardization (Phase 1)

* **Issue 4: Sync Tenant Onboarding UI with Auth Flow (Frontend)**
* Extract CSS classes, card layouts, input field designs, and animations from `auth/onboard` into shared SCSS.
* Apply shared styles to `tenant/onboard` to ensure exact visual parity.


* **Issue 5: Implement Global Form Validation (Frontend)**
* Create a unified Angular directive or shared error component for form validation.
* Replace scattered inline error messages across CRM, LMS, and Admin modules.


* **Issue 6: Component Style Audit (Frontend)**
* Standardize primary buttons, secondary buttons, modals, and loading spinners across the entire application to guarantee a unified layout.



## Milestone 3: Automated Testing Architecture (Phase 3)

* **Issue 7: FastAPI Background Task Testing (Backend)**
* Expand the `pytest` suite for LMS and RAG modules.
* Implement `unittest.mock` to isolate `BackgroundTasks` and intercept Gemini API calls so CI/CD runs do not hit the live LLM.


* **Issue 8: Test Database Isolation (Backend)**
* Enforce transactional rollback fixtures in `pytest` to wipe the database state after every test run.


* **Issue 9: Core Journey E2E Automation (Frontend)**
* Integrate Cypress or Playwright into the Angular repository.
* Automate critical paths: User login, CRM deal creation, RAG document upload, and LMS course enrollment.
