
# BusinessHub AI
# Pull Request Template Guide
# PULL_REQUEST_TEMPLATE_GUIDE.md

| Property | Value |
|---|---|
| Document ID | DOC-016 |
| Version | 1.0 |
| Status | Approved |

---

# Purpose

This document defines the standard pull request process for BusinessHub AI.

Every pull request should represent one focused engineering objective and provide sufficient evidence for review, testing and release.

---

# Pull Request Principles

- One pull request = one logical change
- Keep pull requests small and reviewable
- Link all related GitHub Issues
- Merge only after review and validation
- Update documentation when implementation changes behaviour

---

# Branch Naming

Examples

- feature/authentication
- feature/orders
- bugfix/order-total
- hotfix/login
- docs/sprint-01

---

# Pull Request Title

Use Conventional Commit style.

Examples

- feat(auth): implement JWT refresh token
- fix(order): correct total calculation
- docs(sprint): add Sprint 01 completion report
- refactor(user): simplify profile service

---

# Pull Request Description

## Summary

Describe the change and the business value.

## Related Issues

- Closes ISSUE-ID
- Related Sprint
- Related Milestone

## Files Changed

Summarize key files and modules.

## Testing

Record:

- Unit Tests
- Integration Tests
- UI Tests
- Manual Validation

## Documentation

List updated documents, if applicable.

---

# Reviewer Checklist

## Architecture

- [ ] Clean Architecture maintained
- [ ] Module boundaries respected
- [ ] No unnecessary coupling

## Code Quality

- [ ] Naming conventions followed
- [ ] Error handling appropriate
- [ ] Logging considered
- [ ] Backward compatibility maintained

## Testing

- [ ] Tests added or updated
- [ ] Existing tests pass
- [ ] CI pipeline successful

## Documentation

- [ ] Relevant documentation updated
- [ ] Sprint artifacts synchronized

---

# Merge Criteria

Merge only when:

- All required reviews approved
- CI passes
- Linked issues resolved
- Acceptance criteria satisfied
- No unresolved blocking comments

---

# After Merge

- Close linked issues
- Update sprint progress
- Update completion report
- Create or update release notes if required

---

# Revision History

| Version | Description |
|---|---|
|1.0|Initial Pull Request Template Guide|
