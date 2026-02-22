---
name: feature-implementation
description: Stepped feature development with scaled planning and TDD
tags: [feature, tdd, planning, general]
---

# Feature Implementation

Build features through a disciplined pipeline: scope it, plan it, build it test-first, verify it, ship it. The planning phase scales to the size of the work — 30 seconds for a small change, a written approach for anything larger.

## Workflow

```
Scope → Plan → Implement (TDD loops) → Verify → Ship
```

---

## Phase 1: Scope

Before anything else, categorize the work. This takes 30 seconds.

**Small** — 1-2 files, clear requirements, no design decisions.
**Large** — 3+ files, multiple components, architectural choices, or unclear requirements.

How to decide:
- Can you name every file you'll touch right now? **Small.**
- Do you need to explore the codebase to figure out the approach? **Large.**
- Are there multiple reasonable ways to build it? **Large.**

---

## Phase 2: Plan

### Small Features

Write a brief inline checklist:
- What behavior are you adding?
- Which files will you touch?
- What tests will you write?
- What's the first failing test?

Then move to Phase 3.

### Large Features

Explore the codebase before writing code:

1. **Identify affected areas** — grep for related code, read the files, understand the current architecture.
2. **Map the approach** — which files to create/modify, what the data flow looks like, where the entry points are.
3. **Break it into units** — each unit is one TDD cycle (one test, one piece of behavior). Order them so each builds on the last.
4. **State the approach** — write it out, even if just as a comment to yourself. "I'll add X to file A, wire it through B, expose it in C."

If the user wants a design doc, write one. Otherwise the plan can live in your working memory — but it must exist before you write code.

---

## Phase 3: Implement (TDD Loops)

Repeat this cycle for each unit of work:

### 1. Write a failing test

Write one test that describes the behavior you're about to add. Be specific — test the behavior, not the implementation.

```
Good: "returns 404 when the user doesn't exist"
Bad:  "test getUserById"
```

### 2. Run it — confirm it fails

The test must fail, and it must fail for the right reason (missing feature, not a typo or import error). If it fails for the wrong reason, fix the test first.

### 3. Write minimal code to pass

Write the simplest code that makes the test green. No future-proofing, no abstractions you don't need yet, no handling edge cases you haven't tested for.

### 4. Run tests — confirm green

All tests pass, not just the new one.

### 5. Refactor if needed

Now that it's green, clean up. Extract duplicates, rename for clarity, simplify logic. But do not add new behavior — that's the next cycle.

### 6. Commit

One commit per TDD cycle, or per logical unit of work. Small, incremental commits that tell a story.

---

## Phase 4: Verify

After all TDD cycles are complete:

- **Run the full test suite** — not just your new tests. Catch regressions.
- **Smoke test** — if the feature has a UI or CLI surface, manually exercise the happy path and one error path.
- **Check for leftovers** — search for `TODO`, `console.log`, `debugger`, commented-out code, or temporary hacks you meant to clean up.
- **Review your own diff** — read through `git diff` as if you were reviewing someone else's code.

---

## Phase 5: Ship

- **Clean commit history** — squash fixup commits if needed. Each commit should be meaningful.
- **Write a summary** — what was built, how it works, how to test it. This can be a PR description, a commit message, or a message to the user.

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "This is too small to plan" | Small features have the most unexamined assumptions. 30 seconds of scoping prevents 30 minutes of rework. |
| "I'll write tests after" | Tests written after implementation test what you built, not what you should have built. They confirm your blind spots instead of catching them. |
| "Let me get it working first, then refactor" | "Later" never comes. Refactor while context is fresh and the change is small. |
| "The existing code doesn't have tests" | That's not permission to continue the pattern. Add tests for the code you're writing. |
| "I know exactly what to build" | Then the plan step takes 30 seconds. Skip it and you'll discover a surprise 20 minutes in. |
| "This abstraction will be useful later" | YAGNI. Build what you need now. You'll know what abstraction to build when you actually need it. |
| "I'll just add this one extra thing" | Scope creep. Finish the current feature, ship it, then start a new cycle for the next thing. |

## Red Flags

- Writing more than 20 lines of production code without a failing test
- Implementing multiple behaviors in one TDD cycle
- Skipping Phase 4 (verify) because "all my tests pass"
- Committing one large diff instead of incremental commits
- Refactoring during the "write minimal code" step — that's a separate step
- Adding error handling for scenarios you haven't tested
- Planning for more than 5 minutes on a "small" feature — re-classify it as large

## Cross-References

- If you hit a bug during implementation, switch to the **bug-diagnosis** skill. Diagnose and fix it properly, then return here.
- After shipping, use the **code-review** skill if the changes touch critical paths.
- For the planning phase, the **planning** skill provides a more thorough framework for large features.
- All implementation in Phase 3 should follow the **tdd** skill's red-green-refactor discipline.
