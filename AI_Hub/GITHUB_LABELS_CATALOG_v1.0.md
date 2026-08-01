
# BusinessHub AI
# GitHub Labels Catalog
# GITHUB_LABELS_CATALOG.md

| Property | Value |
|---|---|
| Document ID | DOC-013 |
| Version | 1.0 |
| Status | Approved |

---

# Purpose

This document defines the standard GitHub label taxonomy for BusinessHub AI.

A consistent label strategy improves issue tracking, sprint planning and engineering traceability.

---

# Label Design Principles

- Keep labels small and meaningful
- One label per category where possible
- Avoid duplicate meanings
- Use labels consistently across all sprints

---

# Work Type Labels

| Label | Purpose |
|---|---|
| backend | Backend implementation |
| frontend | Frontend implementation |
| database | Schema and migration work |
| api | REST API work |
| testing | Unit, integration and E2E tests |
| documentation | Documentation updates |
| devops | Infrastructure and CI/CD |
| architecture | Architecture and design work |

---

# Status Labels

| Label | Purpose |
|---|---|
| ready | Ready to implement |
| in-progress | Currently being worked on |
| review | Awaiting review |
| blocked | Waiting on dependency |
| done | Completed and verified |

---

# Priority Labels

| Label | Purpose |
|---|---|
| P1 | Critical |
| P2 | High |
| P3 | Normal |
| P4 | Low |

---

# Change Type Labels

| Label | Purpose |
|---|---|
| feature | New functionality |
| enhancement | Improvement |
| bug | Defect |
| refactor | Internal improvement |
| tech-debt | Technical debt |
| security | Security-related work |
| performance | Performance optimization |

---

# Module Labels

| Label | Purpose |
|---|---|
| foundation | Repository Foundation |
| core-platform | Shared platform services |
| crm | CRM module |
| ecommerce | Ecommerce module |
| inventory | Inventory module |
| lms | Learning Management System |
| ai-platform | AI Platform |
| analytics | Analytics |

---

# Sprint Labels

Assign exactly one sprint label to every implementation issue.

Examples:

- sprint-01
- sprint-02
- sprint-03

Continue sequentially.

---

# Usage Guidelines

Every implementation issue should typically contain:

- One Module label
- One Work Type label
- One Status label
- One Priority label
- One Sprint label

Optional labels:

- bug
- enhancement
- security
- performance
- tech-debt

---

# Example

AUTH-004

Labels:

- core-platform
- backend
- ready
- P1
- sprint-04
- feature

---

# Maintenance Rules

- Do not create duplicate labels.
- Prefer existing labels over new ones.
- Review labels at sprint planning.
- Remove obsolete labels only after confirming they are unused.

---

# Revision History

| Version | Description |
|---|---|
|1.0|Initial GitHub Labels Catalog|
