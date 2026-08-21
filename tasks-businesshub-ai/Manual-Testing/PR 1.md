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
