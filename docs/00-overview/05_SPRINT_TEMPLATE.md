# Document 04

`docs/templates/SPRINT_TEMPLATE.md`

This is **not** a sprint plan.

This is the reusable template every sprint follows.

If Sprint 18 looks exactly like Sprint 2, you never waste time figuring out how to organize work.

---

```markdown
# Sprint XX – <Sprint Name>

Release

vX.X.X

Status

Planned | In Progress | Completed

---

# Goal

One paragraph describing what this sprint delivers.

Example

Complete Authentication by implementing secure login, JWT authentication, refresh token support and password recovery.

---

# Business Value

Why this sprint exists.

Example

Authentication enables users to securely access every BusinessHub AI module and forms the foundation for all future platform capabilities.

---

# Deliverables

## Backend

- [ ] Entity
- [ ] Repository
- [ ] Service
- [ ] API
- [ ] Validation
- [ ] Error Handling
- [ ] Unit Tests
- [ ] Integration Tests

---

## Frontend

- [ ] UI
- [ ] Routing
- [ ] Forms
- [ ] Validation
- [ ] Signals
- [ ] Services
- [ ] Guards
- [ ] Component Tests

---

## Database

- [ ] Schema
- [ ] Migration
- [ ] Seed Data

---

## Documentation

- [ ] API Documentation
- [ ] Architecture Updates
- [ ] README Updates

---

## Quality

- [ ] Ruff
- [ ] Black
- [ ] MyPy
- [ ] ESLint
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] Playwright

---

# GitHub Issues

| Issue | Description | Status |
|---------|-------------|--------|
| AUTH-001 | User Entity | ☐ |
| AUTH-002 | Repository | ☐ |
| AUTH-003 | Service | ☐ |
| AUTH-004 | API | ☐ |
| AUTH-005 | Angular Login | ☐ |
| AUTH-006 | Tests | ☐ |

---

# Sprint Progress

| Category | Progress |
|------------|----------|
| Backend | 0% |
| Frontend | 0% |
| Database | 0% |
| Testing | 0% |
| Documentation | 0% |

---

# AI Task Queue

This section drives your daily work.

## Current Task

AUTH-001

Create User Entity

Status

Ready

---

## Next Tasks

AUTH-002

AUTH-003

AUTH-004

AUTH-005

---

# Definition of Done

Sprint is complete when

- All GitHub Issues Closed
- Tests Passing
- Documentation Updated
- Pull Request Merged
- Release Created
- Sprint Summary Completed

---

# Release

Version

Date

GitHub Release

Pull Request

---

# Notes

Architecture decisions.

Known limitations.

Follow-up work.

Future improvements.
```

---

# I want to improve this even further.

Instead of manually updating percentages...

Let's make the sprint revolve around **Issues**.

Because GitHub already tracks completion.

So the sprint becomes simply:

```
Sprint

↓

Issue List

↓

Current Issue

↓

Completed Issues

↓

Next Issue
```

Nothing more.

No percentages.

No burndown.

No velocity.

---

# Daily Workflow

This is literally what you do every day.

```
Open Sprint

↓

Open Current Issue

↓

Open Jules

↓

Implement

↓

Run Tests

↓

Commit

↓

Close Issue

↓

Move to Next Issue
```

This is exactly why you bought Google AI Pro.

Keep the AI coding.

You keep steering.

---

# Even Better

I would remove "Backend / Frontend / Database".

Instead group by implementation order.

Example

```
Authentication

□ Design

□ Backend

□ Frontend

□ Tests

□ Documentation

□ Release
```

Much easier.

---

# Sprint Folder

Every sprint folder should contain only four files.

```
Sprint-05-Authentication/

README.md

issues.md

completion.md

screenshots/
```

Notice

I renamed **tasks.md** to **issues.md**.

Why?

Because every checkbox should correspond to a GitHub Issue.

Perfect traceability.

---

# Example

```
Authentication

□ AUTH-001 User Entity

□ AUTH-002 Repository

□ AUTH-003 Service

□ AUTH-004 JWT

□ AUTH-005 Refresh Token

□ AUTH-006 Angular Login

□ AUTH-007 Tests

□ AUTH-008 Documentation
```

Now your sprint is literally your GitHub backlog.

---

# This is where the project becomes effortless.

You never ask

"What should I do today?"

You ask

"What is the first unchecked issue?"

That's it.

---

# Principal Architect Review

I think we've now reached the execution model I'd confidently use myself for a large AI-assisted solo project.

### Why this works

* **Roadmap** tells you **where you're going**.
* **Feature Catalog** tells you **what exists**.
* **Sprint Catalog** tells you **what comes next**.
* **Sprint Folder** tells you **what to do today**.
* **GitHub Issues** tell the AI **exactly what to build**.

That hierarchy is simple enough to maintain, yet strong enough to produce a repository that looks like it was run by a disciplined engineering team.

---

# Before we continue...

I recommend **one small but important change** to the remaining documents.

Instead of writing a generic **GitHub Operations Guide**, I'd create:

> **05_GITHUB_WORKFLOW.md**

It would be a practical, 4–5 page guide covering only:

* Repository structure
* Labels
* Milestones
* Branch naming
* Commit conventions
* Pull request flow
* Release tagging
* Issue naming

No theory—just the exact workflow you'll follow every day. I think that will provide much more value than a traditional operations guide and will complete the execution framework before we start writing prompts and implementing code.
