---
name: test-engineering
description: Test coverage analysis, integration/E2E testing, test suite health, and test strategy
tags: [testing, qa, coverage, e2e, integration]
---

# Test Engineering

Assess and improve the health of a project's test infrastructure. Analyze coverage gaps, write integration and E2E tests, identify flaky or redundant tests, and establish a test strategy that catches bugs before users do.

## Workflow

```
Survey → Coverage → Integration → E2E → Health → Strategy
```

---

## Phase 1: Survey

Understand the current test landscape before writing anything.

1. **Inventory test files** — scan for test directories, test files, test configs (jest, vitest, pytest, mocha, playwright, cypress, etc.).
2. **Identify test types present** — unit, integration, E2E, snapshot, contract, smoke. Note which types are missing entirely.
3. **Run the existing suite** — execute tests and capture results, timing, and any failures or skips.
4. **Check CI configuration** — look at CI pipelines to understand what runs on every PR vs. nightly vs. manually.

**Exit criteria:** You have a clear picture of what testing exists, what passes, what's slow, and what's missing.

---

## Phase 2: Coverage

Identify what's untested and prioritize the gaps.

1. **Run coverage tooling** — generate a coverage report (line, branch, function) using the project's coverage tool.
2. **Identify critical uncovered paths** — focus on business logic, data transformations, auth flows, and error handling. Ignore generated code and trivial getters.
3. **Prioritize by risk** — rank uncovered code by: frequency of change (git log), severity of failure, and complexity.
4. **Write unit tests for high-risk gaps** — follow TDD discipline for new tests: failing test first, verify it catches real behavior.

**Exit criteria:** Coverage report generated, high-risk gaps identified and prioritized, critical paths have test coverage.

---

## Phase 3: Integration

Test how components work together across boundaries.

1. **Identify integration boundaries** — API routes, database queries, service-to-service calls, middleware chains, event handlers.
2. **Write integration tests** — test real interactions between components, not mocked abstractions. Use test databases, in-memory servers, or fixtures as appropriate.
3. **Test error propagation** — verify that errors at boundaries (network failures, invalid responses, timeouts) are handled correctly end-to-end.
4. **Test data flow** — verify that data transformations across boundaries preserve shape and validity.

**Exit criteria:** Critical integration boundaries have tests covering happy path, error cases, and edge cases.

---

## Phase 4: E2E

Test complete user workflows from surface to storage.

1. **Identify critical user journeys** — the 5-10 flows that, if broken, would block users (signup, login, core CRUD, checkout, etc.).
2. **Write E2E tests** — use the project's E2E framework (Playwright, Cypress, etc.) or propose one if none exists.
3. **Keep E2E tests focused** — test the journey, not every edge case. Edge cases belong in unit/integration tests.
4. **Handle flakiness proactively** — use stable selectors (data-testid), explicit waits, and deterministic test data. Avoid sleep-based timing.

**Exit criteria:** Critical user journeys have passing E2E tests that run reliably.

---

## Phase 5: Health

Diagnose and fix problems in the existing test suite.

1. **Identify flaky tests** — tests that pass/fail inconsistently. Common causes: timing dependencies, shared state, network calls, non-deterministic data.
2. **Identify slow tests** — tests taking disproportionate time. Profile the suite and find bottlenecks.
3. **Identify redundant tests** — multiple tests asserting the same behavior. Consolidate without reducing coverage.
4. **Fix or quarantine** — fix flaky tests where possible. Quarantine (skip with documented reason) tests that need deeper investigation.
5. **Improve test infrastructure** — shared fixtures, factory functions, test utilities that reduce boilerplate and improve reliability.

**Exit criteria:** Flaky tests addressed, slow tests optimized or flagged, suite runs reliably and efficiently.

---

## Phase 6: Strategy

Document the testing approach for the team going forward.

1. **Testing pyramid assessment** — is the ratio of unit:integration:E2E appropriate? Too many E2E tests are slow and flaky. Too few miss integration issues.
2. **Coverage targets** — recommend realistic thresholds based on the project's risk profile. 80% line coverage is a common starting point, but critical paths should be higher.
3. **What to test where** — define which behaviors belong in unit vs. integration vs. E2E tests to prevent duplication and optimize feedback speed.
4. **CI recommendations** — what should block PRs (unit + integration), what should run nightly (E2E, performance), what needs manual triggers.

**Exit criteria:** Team has clear guidance on test expectations, coverage targets, and CI integration.

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "100% coverage is the goal" | Coverage measures lines hit, not behaviors tested. 80% meaningful coverage beats 100% with hollow assertions. |
| "E2E tests cover everything" | E2E tests are slow, flaky, and hard to debug. They verify journeys; unit tests verify logic. You need both. |
| "This code is too simple to test" | Simple code in critical paths still needs coverage. The test is cheap insurance. |
| "Mocking everything makes tests fast" | Over-mocking tests your mocks, not your code. Use real implementations at integration boundaries. |
| "Flaky tests are just how E2E works" | Flaky tests have root causes. Fix them or they'll train the team to ignore test failures. |
| "We'll add tests later" | Test debt compounds like financial debt. The longer you wait, the harder and more expensive it gets. |

## Red Flags

- Test suite that takes 30+ minutes for unit tests (likely testing too much at the wrong level)
- No integration tests — only unit and E2E with nothing in between
- Tests that depend on execution order or shared mutable state
- Coverage reports showing 0% on critical business logic
- E2E tests using `sleep()` or fixed timeouts instead of explicit waits
- Tests that pass when the feature is broken (hollow assertions like `expect(result).toBeTruthy()`)

## Cross-References

- **tdd** — use TDD discipline when writing new tests during coverage gap work
- **bug-diagnosis** — when tests reveal unexpected behavior, switch to hypothesis-driven debugging
- **code-review** — include test quality in review checklists
- **optimization** — test suite performance is a valid optimization target
