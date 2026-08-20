### Issue 1.1: Build Login Page & Token Interceptor

**Functional Flow:**

* User open `/login` route.
* See form. Type email. Type password.
* Click login button.
* App go to `/crm` dashboard.

**Technical Rules:**

* Make new Angular component: `src/app/features/auth/login`.
* Call endpoint: `POST /api/v1/auth/login`.


* Backend give `access_token`. Save this in browser `localStorage`.


* **Must do:** Create `auth.interceptor.ts`. Inject token into headers for all next API calls like `Authorization: Bearer <token>`.
* If user have no token, block them. Send them back to `/login`.

---

### Issue 1.2: Build Invite Accept Page

**Functional Flow:**

* Admin send invite. New worker click link in email.
* App open `/invite/accept` route.
* Worker see form. Type full name. Type new password.
* Click save button. App go to `/login` page.

**Technical Rules:**

* Make new component: `src/app/features/auth/invite-accept`.
* Read `token` string from URL parameter.
* Call endpoint: `POST /api/v1/auth/invite/accept`.


* Send JSON body with `token`, `full_name`, and `password`.


* Show success toast when done.

---

### Issue 1.3: Build Main App Layout

**Functional Flow:**

* User log in. User see main app screen.
* Screen have Side Menu on left. Menu show: CRM, AI, LMS, Settings, Billing.
* Screen have Top Bar. Top bar show user name and Logout button.

**Technical Rules:**

* Make new component: `src/app/core/layout/main-layout.component`.
* Use `<router-outlet>` in HTML. This is wrap for all secure pages.
* Update `app.routes.ts`. Put CRM, AI, LMS, and Billing inside this layout.
* Logout button click must call `POST /api/v1/auth/logout`.
* Clear `localStorage` token on logout. Route user to `/login`.

---

Give these to team first. They must build doors before house.

You want me write Milestone 2 tickets next?
