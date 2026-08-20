### Issue 2.1: Build Workspace Settings Page

**Functional Flow:**

* Admin go to `/settings` from Side Menu.
* See form for company profile.
* Type new company details, GSTIN tax number, and State.
* Click save. App show success toast.

**Technical Rules:**

* Make new Angular component: `src/app/features/settings/workspace-settings`.
* Call endpoint: `GET /api/v1/organizations/me` to fill form.


* Call endpoint: `PATCH /api/v1/organizations/me` to save data.


* **Must do:** Add UI validation for GSTIN. It must be exactly 15 characters. State field is required for Indian tax.



---

### Issue 2.2: Build Team Invite Panel

**Functional Flow:**

* Admin stay on `/settings` page. Scroll down to Team section.
* Type worker email in box. Click "Create Invite".
* Screen show long text link. Admin click copy button to send to worker.

**Technical Rules:**

* Add section inside `workspace-settings` component.
* Call endpoint: `POST /api/v1/organizations/invitations`.


* Send JSON body with `email`.


* Backend return JSON with plaintext `token`.


* UI must build full URL: `http://localhost:4200/invite/accept?token=<the_token>`. Show this on screen so Admin copy it.

---

### Issue 2.3: Global Overage Interceptor & Portal Button

**Functional Flow:**

* Worker try to create Deal or use AI.
* If company out of free seats or credits, screen freeze.
* Popup show: "Workspace locked. No AI credits or seats left. Upgrade plan."
* User click "Go to Billing". App route to `/billing`.
* In `/billing`, user click "Manage Subscription" to open Stripe.

**Technical Rules:**

* Update global HTTP Interceptor.
* Catch all backend errors. If status code is `402` and error code is `ERR_BILLING_001`, stop UI action.


* Show Angular Material Dialog or Toast with warning.
* Force route to `/billing`. Read-only views must still work, so do not break whole app.


* In `billing-dashboard.component`, add new button. Call `POST /api/v1/billing/portal` to open Stripe customer portal.



---

I write Milestone 3 when they finish this. Tell me when ready.
