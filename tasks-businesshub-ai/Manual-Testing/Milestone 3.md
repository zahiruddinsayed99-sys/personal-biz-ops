### Milestone 3: CRM Expansion & AI Wiring

#### Issue 3.1: Build Contacts Management UI

**Functional Flow:**

* User click "Contacts" tab inside CRM page.
* See table of customers.
* Click "Add Contact" button. Modal open.
* Type customer name, email, phone. Click save.
* Table update.

**Technical Rules:**

* Make new Angular component: `src/app/features/crm-pipeline/crm-contacts`.
* Call endpoint: `GET /api/v1/crm/contacts` to fill table.
* Call endpoint: `POST /api/v1/crm/contacts` to save new contact.
* Add edit and delete buttons. Map to `PATCH` and `DELETE` endpoints.

#### Issue 3.2: Wire CRM Deals to AI Endpoints

**Functional Flow:**

* User look at Kanban board in `/crm`.
* Click on a Deal card. See details.
* Click new button: "AI Score Deal".
* Wait for AI. See new score on screen.

**Technical Rules:**

* Update existing `CrmPipelineComponent` and `crm-deal.model.ts`.
* Add action button to deal cards.
* Call endpoint: `POST /api/v1/crm/deals/{deal_id}/ai-score`.
* *Note for backend:* This deducts AI credits. If HTTP `402` happens, global interceptor (from Issue 2.3) will catch it and stop user.



---

### Milestone 4: LMS Engine (Training App)

#### Issue 4.1: Finish LMS Author UI & Quiz Generator

**Functional Flow:**

* Admin go to `/lms-author`.
* Create course. Create module. Create lesson.
* Type lesson text in box.
* Click "Generate AI Quiz". App make 5 questions automatically.

**Technical Rules:**

* Update existing `lms-author.component.ts`.
* Add Markdown text editor for lesson `content_body`.


* Wire save buttons to: `POST /api/v1/lms/courses`, `POST /api/v1/lms/courses/{id}/modules`, and `POST /api/v1/lms/modules/{id}/lessons`.
* Add "Generate Quiz" button. Call `POST /api/v1/lms/quizzes/generate` with `lesson_id` in JSON body.



#### Issue 4.2: Build Student Quiz Player

**Functional Flow:**

* Worker go to `/lms-learner`. Click enroll in course.
* Read lesson. Click "Take Quiz".
* See 5 multi-choice questions. Pick answers. Click submit.
* See big green "PASS" or red "FAIL".

**Technical Rules:**

* Update existing `lms-learner.component.ts`.
* Add enroll button calling `POST /api/v1/lms/enrollments`.
* Build UI for quiz questions. Track selected answers.
* Submit answers calling `POST /api/v1/lms/quizzes/attempts`.
* **Must do:** Enforce business rule `BR-LMS-001`. UI must read `score` from backend. Show "Passed" ONLY if score is 80 or higher.



---

This is complete plan. Total 4 Milestones. Application will be 100% finished when these are coded. Do you need anything else for the team?
