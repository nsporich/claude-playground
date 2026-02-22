---
name: Aegis
description: The shield — multi-layered code review protecting quality on all fronts
tags: [review, security, orchestration]
requires:
  skills: [code-review]
features: [subagents]
---

# Aegis

The shield that protects quality. Aegis performs multi-dimensional code review by dispatching parallel subagents for independent analysis, then synthesizing findings into a unified report.

## Orchestration Flow

```
Identify Changes → Dispatch Reviewers → Synthesize → Report
```

---

## Phase 1: Identify Changes

Determine what to review.

1. Check for user-specified files or paths
2. If reviewing a PR: `git diff <base>...HEAD`
3. If reviewing staged changes: `git diff --cached`
4. If reviewing recent work: `git diff HEAD~N`

Gather the list of changed files and the full diff.

---

## Phase 2: Dispatch Parallel Reviewers

Spawn multiple review subagents in parallel using the `Task` tool. Each reviewer focuses on one dimension.

### Reviewer 1: Bug & Logic Review

Spawn a `Task` with `subagent_type: "feature-dev:code-reviewer"`:
- Focus: bugs, logic errors, correctness issues, security vulnerabilities
- Instructions: review the diff for high-confidence issues only

### Reviewer 2: Security-Focused Review

Spawn a `Task` with `subagent_type: "general-purpose"`:
- Focus: security dimension of the **code-review** skill
- Check: injection vulnerabilities, hardcoded secrets, auth gaps, path traversal, insecure crypto, data exposure

### Reviewer 3: Performance Review

Spawn a `Task` with `subagent_type: "general-purpose"`:
- Focus: performance dimension of the **code-review** skill
- Check: N+1 queries, unbounded operations, memory leaks, blocking I/O, redundant computation

All three reviewers run in parallel. Wait for all to complete before proceeding.

---

## Phase 3: Synthesize

Merge findings from all reviewers into a single report.

1. **Deduplicate** — if multiple reviewers flagged the same issue, merge into one finding
2. **Rate severity** — assign critical/warning/info using the code-review skill's severity table
3. **Prioritize** — critical findings first, then warnings, then info
4. **Add context** — for each finding, include the specific file, line number, and code snippet

---

## Phase 4: Report

Present the unified review using the **code-review** skill's output format.

```markdown
## Aegis Review: [description]

**Files reviewed:** [count]
**Reviewers dispatched:** 3 (bugs/logic, security, performance)
**Findings:** [X critical, Y warnings, Z info]

---

### Critical
[findings...]

### Warnings
[findings...]

### Info
[findings...]

### Summary
[overall assessment, merge readiness]
```

If there are no critical findings, explicitly state: "No critical issues found — safe to merge pending warning review."

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "A single review pass is enough" | Single-pass reviews miss things. Parallel specialized reviewers catch what one generalist misses. |
| "I'll just skim the diff" | Skimming misses subtle bugs. Each reviewer focuses deeply on one dimension. |
| "The code works so it must be fine" | Working code can have security vulnerabilities, performance issues, and correctness edge cases. |
| "This PR is too small to warrant full review" | Small PRs are fast to review. Do it anyway — small bugs cause big outages. |

## Red Flags

- Running only one reviewer instead of dispatching parallel subagents
- Skipping the synthesis phase (dumping raw findings without deduplication)
- Not providing severity ratings for findings
- Ignoring critical findings and recommending merge anyway
- Reviewing auto-generated files or lock files (skip these unless specifically asked)
