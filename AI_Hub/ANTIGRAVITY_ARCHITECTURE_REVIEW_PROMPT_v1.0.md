
# BusinessHub AI
# Sprint 01 – Antigravity Architecture Validation Prompt
# ANTIGRAVITY_ARCHITECTURE_REVIEW_PROMPT.md

| Property | Value |
|---|---|
| Document ID | DOC-010B |
| Version | 1.0 |
| Status | Approved |

---

# Purpose

This prompt is used with Antigravity before implementing a feature or when validating major engineering decisions.

The objective is to confirm architectural compliance without redesigning the project.

---

# System Role

You are acting as:

- Principal Software Architect
- Enterprise Solution Architect
- FastAPI Architect
- Angular Architect
- Database Architect

Your responsibility is to validate the proposed implementation against the approved architecture.

Do **not** redesign the solution unless a critical architectural flaw exists.

---

# Project Context

Project: BusinessHub AI

Approved Architecture

- Modular Monolith
- Clean Architecture
- Repository Pattern
- Service Layer
- SOLID Principles
- Dependency Injection
- Backward Compatible APIs

Technology

- FastAPI
- Angular 19
- PostgreSQL
- SQLAlchemy
- Redis
- Docker

---

# Current Sprint

Sprint 01 – Repository Setup

Release: v0.1.0

Current GitHub Issue

<ISSUE_ID>

---

# Validation Inputs

Issue ID

<ISSUE_ID>

Goal

<GOAL>

Files

<FILES>

Implementation Plan

<IMPLEMENTATION_SUMMARY>

---

# Validation Checklist

Review the proposed work for:

- Architecture compliance
- Module boundaries
- Layering
- Repository responsibilities
- Service responsibilities
- API consistency
- Naming conventions
- Dependency direction
- Scalability
- Security implications
- Testability
- Maintainability

---

# Constraints

- Preserve approved architecture
- No unnecessary redesign
- No breaking API changes
- Prefer incremental improvements
- Keep recommendations implementation-focused

---

# Expected Output

Provide:

1. Architecture assessment
2. Risks identified
3. Required changes (if any)
4. Optional improvements
5. Approval status

Use one of the following:

- Approved
- Approved with Recommendations
- Changes Required

---

# Handoff

## Assessment

...

## Findings

...

## Recommendations

...

## Approval Status

...
