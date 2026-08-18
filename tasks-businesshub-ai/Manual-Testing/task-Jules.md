Addresses implementation gaps identified in the Functional Features Specification audit for Modules 2 and 4.

### 1. CRM Contacts Directory
Added full backend CRUD support for the `Contact` model.
* Created `backend/app/schemas/contact.py`.
* Created `backend/app/repositories/contact_repository.py`.
* Created and registered `backend/app/api/v1/endpoints/crm_contacts.py`.
* Endpoints strictly enforce tenant boundaries and check `crm:read`, `crm:write`, and `crm:delete` permissions.

### 2. CRM Kanban Optimistic UI
Fixed the Angular component (`crm-pipeline.component.ts`) that handles pipeline stages.
* Drag-and-drop now instantly moves the card via `this.deals.update()`.
* If the API request (`stageUpdateSubject`) fails, the card automatically rolls back to its `oldStage`.
* The error toast only fires on actual failures, rather than every time the subject is triggered.

### 3. LMS Markdown Player
Implemented a secure Angular markdown renderer.
* Added `marked` and `dompurify` dependencies.
* Created `MarkdownPipe` which parses markdown and strictly sanitizes it against XSS using DOMPurify before bypassing Angular security.
* Created `LmsPlayerComponent` with foundational styling for markdown elements (headers, quotes, code blocks).

### Local Verification & Testing Guide
* **Dependencies:** Run `npm install` in the `frontend` folder to install `marked` and `dompurify`.
* **Testing Backend:** Verify the new `/api/v1/crm/contacts` endpoints in Swagger or via `pytest` (using the same environment setup).
* **Testing Frontend:** Run `npm run test` or manually verify the optimistic Kanban rollback by disabling your network connection locally and dropping a card.
##
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
