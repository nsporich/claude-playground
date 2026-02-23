---
name: architecture
description: Analyze codebase patterns and produce implementation blueprints
tags: [architecture, design, general]
---

# Architecture

Analyze an existing codebase's patterns, conventions, and structure, then produce a concrete implementation blueprint for a new feature. The blueprint tells you exactly what to build, where to put it, and in what order — before you write a single line of code.

## Workflow

```
Explore → Analyze → Blueprint → Validate
```

---

## Phase 1: Explore

Map the areas of the codebase relevant to the feature.

1. **Identify affected layers** — which layers does this feature touch? (UI, API, data, config, tests)
2. **Read representative examples** — find 2-3 existing features similar in scope. Read their implementations end-to-end.
3. **Map the file structure** — how are files organized? By feature, by layer, by domain? Where would new files for this feature go?
4. **Trace data flow** — follow data from entry point to storage and back through an existing similar feature.

Use the `Explore` subagent (spawn a `Task` with `subagent_type: "Explore"`) for large codebases where manual exploration would be slow.

**Exit criteria:** You can describe the codebase's architecture and point to concrete examples of similar features.

---

## Phase 2: Analyze

Extract the patterns and conventions that the blueprint must follow.

1. **Naming conventions** — how are files, functions, classes, variables, and routes named?
2. **Code organization** — what goes in which directory? How are modules structured?
3. **Architectural patterns** — what patterns are in use? (MVC, repository, middleware, hooks, composition, dependency injection, etc.)
4. **Testing patterns** — how are tests structured? What testing libraries and patterns are used? Where do test files live?
5. **Configuration patterns** — how are features configured? Environment variables, config files, feature flags?
6. **Error handling** — how does the codebase handle errors? Exceptions, result types, error boundaries?

Document each pattern concisely. These become the constraints for the blueprint.

**Exit criteria:** A list of concrete patterns the implementation must follow, with file references as evidence.

---

## Phase 3: Blueprint

Produce a detailed implementation blueprint.

The blueprint must include:

### Files to create
For each new file:
- **Path** — exact file path following the project's conventions
- **Purpose** — one sentence describing what this file does
- **Key contents** — the main exports, functions, classes, or components it will contain
- **Dependencies** — what it imports from the existing codebase

### Files to modify
For each existing file:
- **Path** — exact file path
- **What changes** — specific additions, modifications, or removals
- **Why** — the reason for each change (wiring, configuration, registration, etc.)

### Data flow
- Step-by-step description of how data flows through the new feature
- Entry point → processing → storage → response (or equivalent for non-web features)

### Build sequence
Ordered list of implementation steps, where each step:
- Produces a testable increment
- Builds on the previous step
- Can be committed independently

Number each step. Later steps may depend on earlier ones but never the reverse.

### Test plan
For each build step:
- What test(s) to write
- What behavior they verify
- Where the test file lives (following project conventions)

---

## Phase 4: Validate

Verify the blueprint before handing it off to implementation.

1. **Convention check** — does every new file follow the naming and organization patterns from Phase 2?
2. **Completeness check** — does the blueprint cover all layers the feature touches? (Don't forget: routes, types, tests, config, migrations)
3. **Dependency check** — are all imports from existing modules valid? Do the modules you're importing from actually export what you need?
4. **Conflict check** — does the blueprint conflict with any existing code? (naming collisions, route conflicts, schema conflicts)
5. **Scope check** — does the blueprint introduce anything beyond what the feature requires? Remove it if so.

Present the blueprint to the user for review before proceeding to implementation.

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I know where to put things" | Maybe. But the blueprint catches the edge cases — the config you forgot, the route you'd collide with, the test file you'd misplace. |
| "This feature is too small for a blueprint" | Small features get a small blueprint. The structure scales down. |
| "I'll figure out the structure as I code" | Then you'll restructure halfway through when you discover a convention you missed. |
| "The planning phase already covered this" | Planning decides *what* to build and *which approach*. Architecture decides *where each piece goes* and *in what order*. |
| "I can just follow the existing pattern" | Which pattern? Document it explicitly so there's no ambiguity. |

## Red Flags

- Proposing file paths that don't follow existing conventions
- Skipping the test plan
- Creating a blueprint without reading existing similar features first
- Blueprint that can't be built incrementally (step 5 depends on step 8)
- Modifying files without explaining why
- No data flow description for features that handle data

## Cross-References

- Use the **planning** skill first to decide *what* to build. Use this skill to decide *where and how*.
- The build sequence from the blueprint feeds directly into the **tdd** skill's red-green-refactor cycles.
- The **code-review** skill can review the blueprint itself before implementation begins.
