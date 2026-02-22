---
name: documentation
description: Structured documentation generation for codebases and APIs
tags: [documentation, docs, general]
---

# Documentation

Generate and maintain documentation that's accurate, useful, and proportional to the codebase. Documentation should explain *why* and *how*, not restate what the code already says.

## Workflow

```
Survey → Prioritize → Generate → Validate
```

---

## Phase 1: Survey

Understand what documentation exists and what's missing.

1. **Inventory existing docs** — find README files, doc comments, API docs, architecture docs, wikis, and inline comments. Note their freshness and accuracy.
2. **Map the codebase** — identify entry points, public APIs, key abstractions, data flows, and configuration. Use `Explore` subagent for large codebases.
3. **Identify conventions** — does the project use JSDoc, docstrings, markdown docs, or something else? Match the existing style.
4. **Find gaps** — where would a new developer get stuck? What's tribal knowledge that only exists in someone's head?

**Exit criteria:** You know what documentation exists, what's missing, and what conventions to follow.

---

## Phase 2: Prioritize

Not everything needs documentation. Focus on what provides the most value.

**High priority:**
- README (project overview, setup, usage)
- Public API surface (function signatures, parameters, return values, errors)
- Architecture overview (how major components fit together)
- Non-obvious behavior (gotchas, edge cases, workarounds)

**Medium priority:**
- Configuration reference
- Development workflow (how to build, test, deploy)
- Data model / schema documentation

**Low priority:**
- Internal implementation details (they change frequently)
- Code that's self-documenting (clear names, simple logic)
- Deprecated features (mark them, don't elaborate)

---

## Phase 3: Generate

Write documentation that earns its maintenance cost.

### Principles

- **Accuracy over completeness** — wrong docs are worse than no docs. Verify every claim against the actual code.
- **Why over what** — don't restate the code. Explain the reasoning, the constraints, the decisions.
- **Examples over descriptions** — a usage example is worth a paragraph of explanation.
- **Keep it DRY** — don't duplicate information. Link to the source of truth instead.

### README structure

```markdown
# Project Name

One-sentence description of what this project does.

## Quick Start

Minimal steps to get running. Copy-pasteable commands.

## Usage

Common use cases with examples.

## Architecture

How the major pieces fit together. A diagram if it helps.

## Development

How to build, test, and contribute.
```

### API documentation

For each public function/method/endpoint:
- **What it does** — one sentence
- **Parameters** — name, type, description, required/optional, defaults
- **Returns** — type and description
- **Errors** — what can go wrong and what the caller should do about it
- **Example** — concrete usage showing input and output

### Inline comments

- **Do:** Explain *why* — business rules, workarounds, non-obvious decisions
- **Don't:** Explain *what* — `i++ // increment i` helps nobody
- **Do:** Mark hazards — `// WARNING: this modifies global state`
- **Don't:** Comment out code — delete it, git remembers

---

## Phase 4: Validate

Documentation is only valuable if it's correct.

1. **Test the instructions** — follow the README setup steps yourself. Do they work?
2. **Verify API docs against code** — check that documented parameters, return types, and error conditions match the implementation.
3. **Check for staleness** — look for docs that reference renamed functions, removed features, or outdated versions.
4. **Get feedback** — if possible, ask someone unfamiliar with the codebase to follow the docs and note where they get stuck.

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "The code is self-documenting" | The code says *what* it does. It doesn't say *why*, what alternatives were considered, or what gotchas exist. |
| "I'll write docs later" | Later never comes. Document while the context is fresh. |
| "Nobody reads docs" | People don't read *bad* docs. Good docs are invaluable during onboarding and debugging. |
| "It'll just get outdated" | Keep docs close to the code they describe. Review them during code review. Outdated docs are a bug. |
| "This is too obvious to document" | Obvious to you now. Not obvious to future-you or new team members. |

## Red Flags

- Documenting implementation details that change frequently
- Writing docs without checking the actual code behavior
- Duplicating information that's already documented elsewhere
- Adding comments that restate the code
- Generating docs without testing that the instructions work
- Skipping the survey phase and writing docs for things that already exist
