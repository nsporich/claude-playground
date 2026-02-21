# General Skills Design: feature-implementation & bug-diagnosis

**Date:** 2026-02-21
**Goal:** Add two new general-purpose skills inspired by superpowers patterns: a stepped feature implementation workflow and a scientific bug diagnosis workflow.

## Shared Design Principles

Both skills follow the superpowers pattern:
- Stepped workflow with explicit phase gates
- Anti-rationalization tables (pre-empt excuses to skip discipline)
- Red flags (self-check signals that you're violating the process)
- Cross-references between skills where workflows overlap
- Scaled to project size — not one-size-fits-all ceremony

## Skill 1: feature-implementation

**Location:** `skills/general/feature-implementation/SKILL.md`
**Tags:** `[feature, tdd, planning, general]`

### Workflow

```
Scope Assessment → Plan → Implement (TDD loops) → Verify → Ship
```

### Phase 1: Scope Assessment

Quick categorization (30 seconds):
- **Small** (1-2 files, clear requirements) → lightweight inline plan
- **Large** (3+ files, design decisions) → written plan with file paths and approach

### Phase 2: Plan

- **Small:** Brief checklist — what to build, files to touch, what to test
- **Large:** Codebase exploration, identify affected areas, write approach with file paths and data flow

### Phase 3: Implement (TDD Loops)

Repeated per unit of work:
1. Write a failing test describing the behavior
2. Run it — confirm it fails for the right reason
3. Write minimal code to pass
4. Run tests — confirm green
5. Refactor if needed (no new behavior)
6. Commit

### Phase 4: Verify

- Full test suite, not just new tests
- Manual smoke-test checklist if applicable
- Check for leftover debug code, TODOs, console.logs

### Phase 5: Ship

- Clean commit history
- Summary of what was built

### Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "This is too small to plan" | Small features have the most unexamined assumptions. 30 seconds of scoping prevents 30 minutes of rework. |
| "I'll write tests after" | Tests written after test what you built, not what you should have built. |
| "Let me get it working first, then refactor" | "Later" never comes. Refactor while context is fresh. |
| "The existing code doesn't have tests" | Not permission to continue the pattern. Add tests for your changes. |
| "I know exactly what to build" | Then the plan step takes 30 seconds. Skip it and you'll discover a surprise 20 minutes in. |

### Red Flags

- Writing more than 20 lines of production code without a test
- Implementing multiple features in one TDD cycle
- Skipping verify because "all my tests pass"
- Committing a large blob instead of incremental commits

---

## Skill 2: bug-diagnosis

**Location:** `skills/general/bug-diagnosis/SKILL.md`
**Tags:** `[debugging, tdd, general]`

### Workflow

```
Reproduce → Isolate → Hypothesize → Fix (test-first) → Verify
```

### Phase 1: Reproduce

Reproduce the bug reliably before anything else.
- Capture exact error message/behavior
- Identify trigger conditions
- Determine if consistent or intermittent

### Phase 2: Isolate

Narrow the blast radius.
- Read error traces/logs — follow the stack
- Check recent changes (git log, git diff)
- Binary search: comment out code, add logging, bisect
- Find smallest reproduction case

### Phase 3: Hypothesize

Form an explicit, written hypothesis before touching code.
- State it clearly: "The bug is caused by X because Y"
- Identify confirming/disproving evidence
- Test with smallest possible experiment
- If disproved, return to Phase 2

**Escalation rule:** After 3 failed hypotheses, stop and reassess whether you're looking at the right layer.

### Phase 4: Fix (test-first recommended)

- Write a regression test that reproduces the bug
- If test isn't practical, document why and describe manual verification
- Apply minimal fix — change one thing
- Don't refactor nearby code in the same commit

### Phase 5: Verify

- Regression test green
- Full test suite — no regressions
- Re-test original reproduction steps manually
- Check related code paths for same class of bug

### Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I can see the bug, let me just fix it" | You see *a* bug. Without reproduction, you don't know if it's *the* bug. |
| "It's obvious, no need to isolate" | Obvious bugs don't survive to be reported. Something non-obvious is happening. |
| "Let me fix this and two other things while I'm here" | Bundled fixes are impossible to bisect later. One bug, one fix, one commit. |
| "I can't write a test for this" | Usually means you haven't isolated enough. Push harder on isolation. |
| "It works on my machine now" | That's not verification. Reproduce the original failure and confirm it no longer fails. |
| "Let me try a different approach" (after 5 min) | Did you disprove your hypothesis or just get impatient? State what you learned first. |

### Red Flags

- Changing code before reproducing the bug
- Multiple hypotheses tested simultaneously
- No explicit hypothesis stated — just "trying things"
- Fixing without a regression test and no documented reason why
- Declaring "fixed" without re-running original reproduction steps

### Cross-References

- `feature-implementation` → if bug found during feature work, use `bug-diagnosis`, then return
- `bug-diagnosis` → use `code-review` skill to review fixes on critical paths

## Non-goals

- No subagent dispatching or parallel execution
- No design doc requirements for bug fixes
- No auto-generated commit messages — user controls git workflow
