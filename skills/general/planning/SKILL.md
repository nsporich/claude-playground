---
name: planning
description: Requirements gathering and design through structured exploration
tags: [planning, design, general]
---

# Planning

Turn vague ideas into concrete implementation plans through structured exploration. Clarify intent, discover constraints, explore approaches, and document decisions — all before writing code.

## Workflow

```
Understand → Explore → Propose → Decide → Document
```

---

## Phase 1: Understand

Before proposing anything, understand what you're building and why.

1. **Capture the request** — restate the user's goal in your own words. Confirm you understand before proceeding.
2. **Identify the context** — explore the relevant codebase. Read related files, check recent commits, understand existing patterns.
3. **Ask clarifying questions** — one at a time. Prefer multiple-choice when possible. Focus on: purpose, constraints, success criteria, non-goals.

**Exit criteria:** You can explain what you're building, why, and what's out of scope.

---

## Phase 2: Explore

Investigate the solution space before committing to an approach.

1. **Map affected areas** — identify which files, modules, and systems are involved.
2. **Identify constraints** — technical limitations, compatibility requirements, performance budgets, existing conventions.
3. **Surface risks** — what could go wrong? What's hard to change later? What's uncertain?

**Exit criteria:** You understand the landscape well enough to propose concrete approaches.

---

## Phase 3: Propose

Present 2-3 distinct approaches with honest trade-offs.

For each approach:
- **Summary** — one sentence describing the approach
- **How it works** — concrete description of what you'd build
- **Pros** — genuine advantages
- **Cons** — genuine disadvantages and risks
- **Effort** — relative complexity (low / medium / high)

Lead with your recommended approach and explain why you prefer it.

---

## Phase 4: Decide

Get explicit approval on the approach before proceeding.

- Present the recommendation clearly
- Answer questions and address concerns
- Be willing to revise — if the user pushes back, that's information, not an obstacle
- Document the decision and the reasoning behind it

**Exit criteria:** The user has approved a specific approach.

---

## Phase 5: Document

Capture the plan in a form that's actionable.

- **What** — exactly what will be built
- **How** — the approach, key components, data flow
- **Where** — which files to create, modify, or delete
- **Order** — what to build first, dependencies between pieces
- **Tests** — what to test and how
- **Non-goals** — what's explicitly out of scope

The plan should be specific enough that someone with zero context could follow it.

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I already know what to build" | Then the planning step takes 2 minutes. Skip it and you'll discover a surprise halfway through. |
| "Planning is wasted time" | Rework from bad assumptions costs 10x more than planning. |
| "The user already told me what they want" | Users describe the *what*, not the *how*. Your job is to figure out the how. |
| "There's only one way to do this" | There are always alternatives. If you can't think of two approaches, you haven't explored enough. |
| "Let me just start coding and figure it out" | Coding without a plan means you'll plan *while* coding — the most expensive way to plan. |

## Red Flags

- Proposing only one approach (always propose at least two)
- Starting implementation before getting explicit approval
- Asking more than one question per message (overwhelms the user)
- Planning for longer than 15 minutes on a small feature
- Skipping the document phase ("I'll remember the plan")
- Proposing approaches without exploring the codebase first
