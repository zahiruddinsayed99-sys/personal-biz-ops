Role: Full-Stack Senior Engineer
Task: Implement missing features and complete partial implementations for the BusinessHub AI platform (Angular Frontend + FastAPI Backend).
Context: We recently audited the `develop` branch against our Functional Features Specification. I need you to generate the exact code changes required to resolve the following gaps in Module 2 (CRM) and Module 4 (LMS).

Please provide the implementation steps, necessary file creations/modifications, and the exact code blocks for the following three areas:

### 1. CRM: Contact Directory Management (Backend)
* **Current State:** The `CrmDeal` model has a `contact_id`, but we are completely missing the API endpoints to manage contacts.
* **Required Fix:** * Create a new FastAPI router (e.g., `api/v1/endpoints/crm_contacts.py`).
    * Implement standard CRUD operations (Create, Read, Update, Soft-Delete) for the `Contact` model.
    * Ensure Pydantic v2 schemas (`ContactCreate`, `ContactRead`, `ContactUpdate`) are defined and enforced.
    * Ensure all endpoints enforce tenant isolation (using `organization_id`) and RBAC.

### 2. CRM: Optimistic UI Handlers for Kanban Board (Frontend)
* **Current State:** The backend returns a `200 OK` for pipeline stage updates, but the Angular frontend lacks true optimistic UI handling for drag-and-drop actions.
* **Required Fix:**
    * Update the Angular Kanban component to instantly move the deal card locally on drop.
    * Implement an error-handling rollback mechanism: if the API call fails or returns an RBAC error, the card must automatically revert to its original column with a localized error toast/notification.

### 3. LMS: Markdown Lesson Player (Frontend)
* **Current State:** The backend schema successfully serves `content_body` for lessons containing Markdown, but the frontend implementation is incomplete/unverified.
* **Required Fix:**
    * Provide the Angular code required to securely parse and render Markdown in the lesson player component. 
    * Ensure the implementation supports standard educational markdown formatting (e.g., code blocks, checklists, and embedded links). 
    * Suggest any necessary NPM packages (like `ngx-markdown` or `marked`) and show how to configure them in the Angular module safely to prevent XSS.

Please format your response clearly, specifying the exact file paths for each code block.
