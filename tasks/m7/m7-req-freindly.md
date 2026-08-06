Type: 🎨 Feature (Frontend)
Track: track/7-ai-platform
Dependencies: Issue 3
Description
Develop a standalone Angular dashboard component displaying document uploads, interactive chat RAG sessions, and real-time background task progression tracking.

Technical Scope & Specifications
UI Layout & Aesthetics:
Create a clean, glassmorphism-themed RAG interface featuring document upload widgets and contextually grounded chat streams.
Signal-Driven State & Standalone Architecture:
Enforce ChangeDetectionStrategy.OnPush and utilize the inject() dependency syntax.
Expose Signals tracking uploading progress and active AI generation streams.
Reactive Job Polling Engine:
When a document upload returns a job_id (HTTP 202), initiate a reactive polling mechanism against /api/v1/ai/jobs/{job_id} using an RxJS interval stream converted back to a Signal.
Update the UI with progress percentages, smoothly transitioning to completed states upon job resolution.
Definition of Done (DoD)
 Front-end standalone components compile with zero template or stylesheet budget errors.
 End-to-end flow verified: uploading a file displays active progress bars, resolves successfully, and allows immediate contextual RAG queries.
