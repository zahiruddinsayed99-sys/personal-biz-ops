Here is the final technical handover checklist and coding standards for Jules and Antigravity. Attach this to your repository `README.md` or the main sprint board to set clear expectations.

### 1. Angular Development Guidelines

* **Environment Variables:** Never hardcode API URLs in components or services. Always use `environment.apiUrl` to ensure smooth deployments across local, staging, and production environments.
* **State Management:** Utilize Angular services and RxJS `BehaviorSubject` to manage global states, particularly for the active user session token and current organization context.
* **Strict Typing:** Create exact TypeScript interfaces (e.g., `User`, `Organization`, `Deal`) that match the backend Pydantic models. Strictly avoid using the `any` type.
* **Centralized Error Handling:** Ensure the global HTTP interceptor manages generic errors, specifically catching `402 Payment Required` to trigger the billing soft-lock UI.



### 2. Pre-Merge QA Checklist

Before submitting a Pull Request, the developers must manually verify these critical system flows against the testing manual:

* **Authentication Validation:** Verify that a stateful Redis session is created upon login and that the `access_token` is successfully appended to all subsequent API requests.


* **Billing Compliance:** Confirm that the Stripe checkout session strictly enforces INR currency and correctly formats B2B GST tax invoices.


* **Cross-Tenant Isolation:** Attempt to fetch CRM deals using a different organization's context header to ensure the UI gracefully handles the resulting `403 Forbidden` API rejection.


* **LMS Grading Logic:** Execute a quiz submission and verify the UI displays a failure state if the learner answers fewer than 4 out of 5 questions correctly, enforcing the 80% threshold (`BR-LMS-001`).



The complete architecture and milestone roadmap is now ready for execution. Are you prepared to kick off the sprint with the team, or is there another specific module you need to review first?
