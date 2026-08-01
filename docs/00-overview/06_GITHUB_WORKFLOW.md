I think this should be the **last framework document** before we start creating actual sprint folders.

After this, we stop documenting process and start planning implementation.

One change I'd like to make:

> This is **not** a GitHub guide.

It is a **GitHub Engineering Workflow**.

It should tell Future You exactly how to work.

Nothing else.

---

# Document 05

`docs/01-architecture/GITHUB_WORKFLOW.md`

````markdown
# BusinessHub AI

# GitHub Engineering Workflow

Version: 1.0

Status: Active

---

# Purpose

GitHub is the single source of truth for implementation progress.

NotebookLM stores project knowledge.

AI assists implementation.

GitHub tracks execution.

Every engineering task begins and ends in GitHub.

---

# Engineering Flow

Roadmap

↓

Feature

↓

Sprint

↓

GitHub Milestone

↓

GitHub Issue

↓

Implementation

↓

Pull Request

↓

Merge

↓

Release

↓

Sprint Completion

---

# Repository Structure

```
BusinessHub-AI/

backend/

frontend/

docs/

tests/

docker/

.github/

scripts/

```

Documentation

```
docs/

00-overview/

01-architecture/

02-sprints/

03-releases/

04-journal/

```

---

# Branch Strategy

Main branches

```
main

develop
```

Feature branches

```
feature/authentication

feature/organizations

feature/rbac

feature/crm-leads

feature/product-catalog

feature/orders

feature/inventory-stock

feature/lms-courses
```

Bug fixes

```
bugfix/login-refresh

bugfix/order-calculation
```

Hotfix

```
hotfix/security-patch
```

Never develop directly on

main

---

# Milestones

One milestone represents one feature sprint.

Examples

```
Sprint 01 Foundation

Sprint 02 Authentication

Sprint 03 Organizations

Sprint 04 RBAC

Sprint 05 Users
```

Every issue belongs to one milestone.

---

# Labels

Type

```
backend

frontend

database

documentation

testing

devops

architecture
```

Priority

```
P1

P2

P3
```

Status

```
ready

blocked

review

completed
```

---

# Issue Naming

Every issue begins with a feature code.

Authentication

```
AUTH-001

AUTH-002
```

Organizations

```
ORG-001
```

Products

```
PROD-001
```

Orders

```
ORD-001
```

Leads

```
CRM-LEAD-001
```

Warehouse

```
INV-001
```

Course

```
LMS-001
```

---

# Issue Template

Every issue should contain

Goal

Acceptance Criteria

Files Expected

Definition of Done

Related Sprint

Related Feature

Nothing more.

Keep issues small.

Target

1–4 hours of implementation.

---

# Pull Requests

One Pull Request should solve one engineering concern.

Include

Summary

Issues Closed

Testing Performed

Screenshots (if UI)

Notes

Avoid giant Pull Requests.

---

# Commit Convention

Examples

```
feat(auth): add JWT refresh token

feat(crm): implement lead repository

fix(order): correct tax calculation

test(auth): add login integration tests

docs(api): update authentication endpoints

refactor(user): simplify profile service
```

---

# Release Tags

Repository Foundation

```
v0.1.0
```

Core Platform

```
v1.0.0-alpha1

v1.0.0-alpha2

...

v1.0.0
```

CRM

```
v2.0.0
```

Ecommerce

```
v3.0.0
```

Inventory

```
v4.0.0
```

LMS

```
v5.0.0
```

Production

```
v6.0.0
```

---

# Daily Workflow

1.

Open current sprint

2.

Select first open GitHub Issue

3.

Review acceptance criteria

4.

Open AI session

5.

Implement

6.

Run tests

7.

Commit

8.

Open Pull Request

9.

Merge

10.

Close issue

11.

Update sprint

Repeat.

---

# Engineering Traceability

Every completed feature should have

Sprint

↓

Milestone

↓

Issues

↓

Commits

↓

Pull Request

↓

Release

↓

Sprint Completion

Anyone should be able to reconstruct the complete implementation history from GitHub.

---

# Rules

Never work without an issue.

Never open multiple feature branches for the same sprint.

Never merge failing tests.

Never leave completed work undocumented.

Keep AI sessions focused on one issue.

Finish one issue before starting another.

---

End of Document
````

---

# 🏗 Principal Architect Review (Final)

I think we're **95% done with the framework**, but after seeing all five documents together, I'd simplify it **even more**.

## Remove Releases from Planning

Originally we planned:

```
Roadmap
↓

Release
↓

Sprint
```

I don't think that's how you'll actually work.

Instead:

```
Roadmap
↓

Feature
↓

Sprint
↓

Issues
↓

Implementation
```

When a sprint finishes...

**then** create a Release.

Don't plan Releases months in advance.

Create them naturally.

---

# The Framework I'd Freeze

Instead of nine documents...

I'd freeze the project with just these six.

```
docs/

00-overview/

PROJECT_ROADMAP.md

FEATURE_CATALOG.md

SPRINT_CATALOG.md

01-architecture/

ARCHITECTURE.md

AI_PLAYBOOK.md

GITHUB_WORKFLOW.md
```

Everything else becomes **sprint artifacts**, not framework.

---

# What Comes Next (The Real Work)

This is where I think the project actually begins.

We'll stop writing framework docs and start building reusable sprint assets.

I propose this sequence:

### Phase 2 — Sprint Assets

* `Sprint_Template/README.md`
* `Sprint_Template/issues.md`
* `Sprint_Template/completion.md`

### Phase 3 — Sprint Planning

* Sprint 01 (complete)
* Sprint 02 (complete)
* Sprint 03 (complete)

### Phase 4 — AI Prompt Pack

Instead of generic prompts, we'll create production-ready prompts for:

* ChatGPT (planning/review)
* Antigravity (architecture/design)
* Jules (implementation)
* Code review
* Bug fixing
* Refactoring

### Phase 5 — Implementation

At this point, you'll have everything needed to start building BusinessHub AI at a fast pace.

---

## One last recommendation

Looking at the complete framework, I would make **one strategic adjustment** that I think will significantly improve execution.

Instead of planning all **32 sprints** in detail, we'll use **rolling-wave planning**:

* **Roadmap**: complete for the entire project.
* **Feature Catalog**: complete for the entire project.
* **Sprint Catalog**: complete for the entire project.
* **Detailed Sprint Plans**: only maintain the **current sprint** and the **next two sprints**.

This gives you long-term direction while keeping the day-to-day execution lightweight and adaptable—exactly the kind of engineering traceability you wanted without introducing unnecessary process. From here onward, I'd shift almost entirely to implementation planning and feature delivery.
