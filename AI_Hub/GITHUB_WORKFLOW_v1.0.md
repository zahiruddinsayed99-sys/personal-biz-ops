
# BusinessHub AI
# GITHUB_WORKFLOW.md

| Property | Value |
|---|---|
| Document ID | DOC-006 |
| Version | 1.0 |
| Status | Approved |

---

# Purpose

This document defines the standard GitHub workflow for BusinessHub AI.

GitHub is the single source of truth for engineering execution. NotebookLM stores long-term project knowledge, while GitHub tracks day-to-day implementation.

---

# Workflow Overview

Roadmap
→ Feature Catalog
→ Sprint Catalog
→ Current Sprint
→ GitHub Milestone
→ GitHub Issue
→ Branch
→ Implementation
→ Pull Request
→ Merge
→ Release
→ Sprint Completion Report

---

# Repository Structure

```text
BusinessHub-AI/
├── backend/
├── frontend/
├── docs/
├── tests/
├── docker/
├── scripts/
├── postman/
├── playwright/
└── .github/
```

Documentation

```text
docs/
├── 00-overview/
├── 01-architecture/
├── 02-sprints/
├── 03-releases/
└── 04-journal/
```

---

# Branch Strategy

Protected branches

- main
- develop

Feature branches

- feature/authentication
- feature/organizations
- feature/rbac
- feature/crm-leads
- feature/product-catalog
- feature/orders

Bug fixes

- bugfix/<description>

Hotfixes

- hotfix/<description>

Never develop directly on `main`.

---

# Sprint Milestones

One GitHub Milestone represents one Feature Sprint.

Examples

- Sprint 01 – Repository Setup
- Sprint 02 – Development Environment
- Sprint 03 – Engineering Quality
- Sprint 04 – Authentication

---

# Labels

## Work Type

- backend
- frontend
- database
- testing
- documentation
- devops
- architecture

## Status

- ready
- in-progress
- review
- blocked
- done

## Priority

- P1
- P2
- P3

Keep the label set intentionally small.

---

# Issue Naming

Feature prefix + sequence.

Examples

- AUTH-001
- ORG-001
- RBAC-001
- CRM-LEAD-001
- PROD-001
- ORD-001
- INV-001
- LMS-001

---

# Issue Standard

Each issue contains:

- Goal
- Acceptance Criteria
- Files Expected
- Definition of Done
- Related Sprint
- Related Feature

Target effort: one focused AI implementation session.

---

# Pull Requests

Each pull request should:

- Address one engineering concern
- Reference related issues
- Describe implementation
- Summarize testing
- Include screenshots for UI changes
- Note follow-up work (if any)

Avoid large pull requests spanning multiple unrelated features.

---

# Commit Convention

Use Conventional Commits.

Examples

- feat(auth): implement JWT refresh token
- feat(product): add repository layer
- fix(order): correct total calculation
- docs(sprint): update sprint report
- test(auth): add integration tests
- refactor(user): simplify service logic

---

# Releases

Create a release after successful sprint completion.

Each release should include:

- Sprint summary
- Closed issues
- Key features
- Known limitations
- Link to sprint completion report

---

# Daily Engineering Workflow

1. Open current sprint.
2. Select first Ready issue.
3. Create or switch to feature branch.
4. Implement the issue.
5. Run tests.
6. Commit changes.
7. Open pull request.
8. Merge after review.
9. Close issue.
10. Update sprint documentation.

---

# Engineering Traceability

Roadmap
→ Sprint
→ Issue
→ Branch
→ Commit
→ Pull Request
→ Release
→ Sprint Completion Report

Every completed feature should be traceable through GitHub.

---

# Revision History

| Version | Description |
|---|---|
|1.0|Initial GitHub Workflow|
