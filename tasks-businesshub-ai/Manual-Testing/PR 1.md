# PR 3
## Pull Request Summary

This Pull Request implements the requested UI features, security improvements, and role-based access controls for the following issues:

* [#63](#63) — Finish LMS Author UI & Quiz Generator
* [#64](#64) — Build Student Quiz Player
* [#66](#66) — Implement UI Role-Based Access Control & Route Guards
* [#67](#67) — Secure Public Onboard Screen (Invite-Only)
* [#68](#68) — Build Super Admin Tenant Creator

---

## Summary of Changes

### 1. Finish LMS Author UI & Quiz Generator — #63

Implemented the `LmsAuthorComponent` to support the complete course authoring workflow.

**Implemented:**

* Create courses, modules, and lessons.

* Added a Markdown editor for lesson content.

* Integrated the following APIs:

  * `POST /api/v1/lms/courses`
  * `POST /api/v1/lms/modules`
  * `POST /api/v1/lms/lessons`

* Added a **Generate AI Quiz** feature using:

  ```text
  POST /api/v1/lms/quizzes/generate
  ```

* Implemented polling behavior to:

  * Track quiz generation progress.
  * Display progress updates.
  * Render the generated quiz once processing is complete.

---

### 2. Build Student Quiz Player — #64

Implemented the `LmsLearnerComponent` to support course enrollment and quiz participation.

**Implemented:**

* Browse available courses.

* Enroll in courses using:

  ```text
  POST /api/v1/lms/enrollments
  ```

* View lesson content rendered from Markdown.

* Take quizzes associated with lessons.

* Submit quiz answers using:

  ```text
  POST /api/v1/lms/quizzes/attempts
  ```

* Enforced business rule **BR-LMS-001**:

  * The frontend reads the final score from the backend.

  * A score of **80% or higher** displays:

    **PASS** 🟢

  * A score below **80%** displays:

    **FAIL** 🔴

---

### 3. Implement UI Role-Based Access Control & Route Guards — #66

Implemented frontend route protection and role-based navigation visibility.

**Added Route Guards:**

* `AdminGuard`
* `SuperAdminGuard`
* `LmsAuthorGuard`

These guards protect restricted routes defined in `app.routes.ts`.

**Updated `MainLayoutComponent`:**

* Decodes the JWT to determine the authenticated user's role dynamically.
* Supports roles such as:

  * `TENANT_OWNER`
  * `DOMAIN_MEMBER`
  * `SUPER_ADMIN`
  * Other supported LMS/admin roles.

**Sidebar Access Control:**

Angular `*ngIf` directives are used to hide restricted navigation items from unauthorized users.

Restricted sections include:

* `/settings`
* `/billing`
* `/lms-author`
* Tenant management functionality

Standard members should not see or access restricted areas.

---

### 4. Secure Public Onboard Screen — Invite-Only — #67

Updated `TenantOnboardingComponent` to enforce invite-only onboarding.

**Implemented:**

* Reads the `code` query parameter from:

  ```text
  /onboard?code=...
  ```

* If no invite code is provided:

  * The onboarding form is completely hidden.
  * An access message is displayed:

    > Signup is invite-only. Contact sales.

* The `invite_code` is included in the onboarding request payload:

  ```text
  POST /api/v1/tenants/onboard
  ```

---

### 5. Build Super Admin Tenant Creator — #68

Created a restricted `TenantOnboardComponent` for Super Admin tenant provisioning.

**Route:**

```text
/admin/tenant
```

**Implemented:**

* Company Name input.
* Tenant Slug input.
* Workspace creation through:

  ```text
  POST /api/v1/tenant/onboard
  ```

This functionality is:

* Accessible only to `SUPER_ADMIN` users.
* Hidden from standard users.
* Hidden from tenant administrators and unauthorized roles.
* Protected through role-based route guards.

---

# Manual Testing & Verification Guide

## Prerequisites

Before starting the tests:

1. From the project root, start the backend services.
2. Ensure the required Docker services and databases are running.

For example:

```bash
docker compose up -d
```

3. Open a new terminal and start the frontend:

```bash
cd frontend
npm start
```

Alternatively:

```bash
cd frontend
npx ng serve
```

4. Open the application:

```text
http://localhost:4200
```

---

## Test 1 — Public Onboard Screen: Invite-Only Access

### Scenario A: Access Without Invite Code

Navigate to:

```text
http://localhost:4200/onboard
```

### Expected Result

Verify that:

* The onboarding form is **not displayed**.
* An access-denied or invite-only message is displayed.
* The user sees a message similar to:

> Signup is invite-only. Contact sales.

---

### Scenario B: Access With Invite Code

Navigate to:

```text
http://localhost:4200/onboard?code=SECRET123
```

### Expected Result

Verify that:

* The onboarding form is displayed.
* The invite code is recognized.
* The user can proceed with the onboarding workflow.

---

## Test 2 — RBAC Guards & Sidebar Route Hiding

### Scenario A: Standard User

Log in as a user with the role:

```text
DOMAIN_MEMBER
```

### Verify Sidebar Visibility

Confirm that the following items are **not visible**:

* Settings
* Billing
* LMS Author
* Tenant Manager

---

### Scenario B: Direct URL Access

Manually enter a restricted route, for example:

```text
http://localhost:4200/settings
```

### Expected Result

Verify that the route guard prevents unauthorized access and redirects the user to an appropriate page, such as:

```text
/crm
```

or:

```text
/login
```

depending on the authentication state and application behavior.

---

### Scenario C: Admin Access

Log in as:

```text
TENANT_OWNER
```

or:

```text
SUPER_ADMIN
```

### Expected Result

Verify that the appropriate restricted navigation items become visible according to the user's role.

---

## Test 3 — Super Admin Tenant Creator

Log in using a:

```text
SUPER_ADMIN
```

account.

### Steps

1. Open **Tenant Manager** from the sidebar.

2. Enter a test company name:

   ```text
   Test Corp
   ```

3. Enter a slug:

   ```text
   test-corp
   ```

4. Click:

   **Create Workspace**

### Expected Result

Verify that:

* The request is successfully sent to the backend.
* The tenant/workspace is created.
* A success confirmation message is displayed.
* Unauthorized users cannot access this page.

---

## Test 4 — LMS Authoring & AI Quiz Generation

Log in with a user that has LMS authoring privileges, such as:

```text
LMS_MANAGER
```

or another authorized administrative role.

### Steps

1. Navigate to **LMS Author**.
2. Create a new course.
3. Add a module to the course.
4. Add a lesson to the module.
5. Enter lesson content using Markdown.
6. Click:

   **Generate AI Quiz**

### Expected Result

Verify that:

* The quiz generation request is submitted successfully.
* The UI displays generation progress.
* Polling continues while the backend job is processing.
* The generated quiz questions are rendered once the job completes.

---

## Test 5 — Student Quiz Player

### Steps

1. Navigate to **LMS Learner**.
2. Select a course.
3. Click **Enroll**.
4. Open and read the lesson content.
5. Click **Take Quiz**.
6. Select answers and submit the quiz.

### Passing Scenario

Answer enough questions correctly to achieve:

```text
Score >= 80%
```

### Expected Result

Verify that the application displays:

## 🟢 PASS

---

### Failing Scenario

Retake the quiz and intentionally submit incorrect answers resulting in:

```text
Score < 80%
```

### Expected Result

Verify that the application displays:

## 🔴 FAIL

---

## Verification Checklist

* [ ] Backend services are running successfully.
* [ ] Frontend application starts successfully.
* [ ] `/onboard` without an invite code hides the onboarding form.
* [ ] `/onboard?code=SECRET123` displays the onboarding form.
* [ ] `DOMAIN_MEMBER` users cannot see restricted sidebar links.
* [ ] Direct navigation to restricted routes is blocked.
* [ ] Authorized admin users can access their permitted routes.
* [ ] `SUPER_ADMIN` users can access Tenant Manager.
* [ ] Unauthorized users cannot access `/admin/tenant`.
* [ ] A Super Admin can create a new tenant/workspace.
* [ ] Authorized users can create courses, modules, and lessons.
* [ ] Markdown lesson content is saved and displayed correctly.
* [ ] AI quiz generation starts successfully.
* [ ] Quiz generation progress polling works correctly.
* [ ] Generated quiz questions are rendered successfully.
* [ ] Students can enroll in available courses.
* [ ] Students can open lessons and view Markdown content.
* [ ] Students can take and submit quizzes.
* [ ] Scores of 80% or higher display `PASS`.
* [ ] Scores below 80% display `FAIL`.

---

## Completion Status

All requested changes have been implemented and committed to the Pull Request.

The above scenarios provide the recommended manual verification flow for validating the LMS functionality, invite-only onboarding, role-based access control, route guards, and Super Admin tenant provisioning.

## Pull Request Summary

This pull request implements the requested UI fixes for **Milestone 4**, addressing the following issues:

* [#56](https://github.com/zahiruddinsayed99-sys/businesshub-ai/issues/56)
* [#57](https://github.com/zahiruddinsayed99-sys/businesshub-ai/issues/57)
* [#58](https://github.com/zahiruddinsayed99-sys/businesshub-ai/issues/58)

### Changes Implemented

#### 1. Login Page & Authentication Token Interceptor

* Added a login component mapped to `/login`.

* Integrated the login form with:

  ```text
  POST /api/v1/auth/login
  ```

* On successful login:

  * The `access_token` is stored in `localStorage`.
  * SSR-safe checks are used before accessing browser storage.

* Added an HTTP interceptor that automatically injects the access token into the `Authorization` header for subsequent API requests.

#### 2. Invite Acceptance Page

* Added an invite acceptance component mapped to:

  ```text
  /invite/accept
  ```

* The page:

  * Extracts the `token` from the URL query parameters.
  * Collects the user's `full_name` and `password`.
  * Submits the request to:

    ```text
    POST /api/v1/auth/invite/accept
    ```

* On successful invite acceptance, the user is redirected to `/login`.

#### 3. Main Application Layout

Added `MainLayoutComponent` as the shared wrapper for authenticated application pages:

* `/crm`
* `/ai`
* `/lms-author`
* `/lms-learner`
* `/billing`

The layout includes:

* Sidebar navigation
* Top bar with a user welcome message
* Logout functionality

The logout action calls:

```text
POST /api/v1/auth/logout
```

After logout, the authentication token is cleared from `localStorage`, and the user is redirected to the login page.

#### 4. Application Routing & Authentication Guard

Reorganized `app.routes.ts` to support nested routing within `MainLayoutComponent`.

Also added an `authGuard` to ensure that only authenticated users with a valid stored token can access protected routes.

Unauthenticated users attempting to access internal application pages are automatically redirected to:

```text
/login
```

---

## Local Verification & Testing Guide

### Prerequisites

Start the PostgreSQL and Redis containers:

```bash
docker compose up -d db redis
```

### Start the Backend API

Open **Terminal 1** and run:

```bash
cd backend

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

export PYTHONPATH=.
export DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/app-db"

alembic upgrade head

uvicorn app.main:app --reload --port 8000
```

---

## Automated Tests

### Frontend Unit Tests

```bash
cd frontend

npm install

npx ng test --watch=false --browsers=ChromeHeadless
```

### Backend Tests

```bash
cd backend

pytest tests/
```

---

## Manual QA Walkthrough

### 1. Start the Frontend

Open **Terminal 2** and run:

```bash
cd frontend

npm install

npm run start
```

### 2. Verify Login Redirect

Open:

```text
http://localhost:4200/
```

If no active authentication token exists, you should automatically be redirected to:

```text
/login
```

### 3. Verify Login Form Validation

Confirm that the login page displays:

* Email field
* Password field

Enter invalid or incomplete data and verify that the appropriate validation errors are displayed.

### 4. Verify Route Protection

Try navigating directly to:

```text
http://localhost:4200/crm
```

Without an active token, the `authGuard` should redirect you back to:

```text
/login
```

### 5. Verify Successful Login

Enter valid test credentials.

Alternatively, seed valid credentials manually in the database/cache for testing.

After successful authentication, the application should redirect you to:

```text
/crm
```

### 6. Verify Main Application Layout

After login, verify that the application displays:

* Sidebar navigation
* CRM link
* AI link
* LMS links
* Billing link
* Top bar
* Logout button

### 7. Verify Logout

Click **Logout**.

Expected behavior:

1. The logout API request is sent.
2. The authentication token is cleared from `localStorage`.
3. The user is redirected to:

   ```text
   /login
   ```

### 8. Verify Invite Acceptance Flow

Navigate to:

```text
http://localhost:4200/invite/accept?token=sample_token
```

Verify that the page displays:

* Full Name field
* Password field

Enter valid values and click **Save**.

Expected behavior:

1. The invite acceptance request is submitted.
2. A success message is displayed.
3. The user is redirected to:

   ```text
   /login
   ```
