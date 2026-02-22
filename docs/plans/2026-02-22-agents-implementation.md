# Agents Category Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add the Agents category to claude-playground — 6 agent personas orchestrating 7 skills, with dependency resolution in the installer and catalog.

**Architecture:** Agents are AGENT.md files in `agents/<slug>/` that declare skill and agent dependencies via `requires` frontmatter. The installer resolves dependencies recursively and auto-installs them. The catalog builder computes reverse `used_by` mappings. Templates, prompts, and unused skills are removed.

**Tech Stack:** Bash (build-catalog.sh, install.sh), Markdown (AGENT.md, SKILL.md)

---

### Task 1: Remove deprecated assets

**Files:**
- Delete: `templates/general.md`
- Delete: `templates/angular.md`
- Delete: `templates/npm-package.md`
- Delete: `prompts/general/explain-codebase.md`
- Delete: `prompts/storybook/storybook-setup.md`
- Delete: `prompts/testing/browser-testing-setup.md`
- Delete: `skills/angular/angular-upgrade/SKILL.md`
- Delete: `skills/angular/angular-material-styleguide/SKILL.md`
- Delete: `skills/general/pr-description/SKILL.md`

**Step 1: Remove the files and directories**

```bash
rm -rf templates/ prompts/ skills/angular/ skills/general/pr-description/
```

**Step 2: Verify only the three kept skills remain**

```bash
find skills/ -name 'SKILL.md' | sort
```

Expected output:
```
skills/general/bug-diagnosis/SKILL.md
skills/general/code-review/SKILL.md
skills/general/feature-implementation/SKILL.md
```

**Step 3: Commit**

```bash
git add -A && git commit -m "chore: remove templates, prompts, and unused skills

Drop angular skills, pr-description, all templates, and all prompts.
Project now focuses exclusively on agents and skills."
```

---

### Task 2: Create the `planning` skill

**Files:**
- Create: `skills/general/planning/SKILL.md`

**Step 1: Write the skill file**

Create `skills/general/planning/SKILL.md` with the following content:

```markdown
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
```

**Step 2: Verify the file exists and has valid frontmatter**

```bash
head -5 skills/general/planning/SKILL.md
```

Expected: YAML frontmatter with `name: planning`.

**Step 3: Commit**

```bash
git add skills/general/planning/SKILL.md && git commit -m "feat: add planning skill

Requirements gathering and design through structured exploration.
Used by Ironclad agent for pre-implementation planning."
```

---

### Task 3: Create the `tdd` skill

**Files:**
- Create: `skills/general/tdd/SKILL.md`

**Step 1: Write the skill file**

Create `skills/general/tdd/SKILL.md` with the following content:

```markdown
---
name: tdd
description: Test-driven development with red-green-refactor discipline
tags: [tdd, testing, general]
---

# Test-Driven Development

Write tests before implementation. Every behavior change starts with a failing test. This isn't a suggestion — it's the process. Red, green, refactor. No exceptions.

## Workflow

```
Red → Green → Refactor → Repeat
```

---

## Phase 1: Red (Write a Failing Test)

Write exactly one test that describes the next behavior you need.

1. **Name the behavior** — not the function. "returns 404 when user doesn't exist" not "test getUserById."
2. **Write the test** — assert the expected outcome. Use the simplest assertion that proves the behavior.
3. **Run it** — the test must fail. If it passes, either the behavior already exists or your test doesn't test what you think it tests.
4. **Verify the failure reason** — it should fail because the feature is missing, not because of a typo, import error, or test setup bug. Fix test infrastructure issues before proceeding.

**Exit criteria:** One test fails for the right reason.

---

## Phase 2: Green (Make It Pass)

Write the minimum code to make the failing test pass.

1. **Solve for the test** — not for the general case. If the test expects `return 42`, you can literally `return 42`. The next test will force you to generalize.
2. **No extra code** — don't add error handling you haven't tested for. Don't handle edge cases you haven't written tests for. Don't add abstractions you don't need yet.
3. **Run all tests** — not just the new one. Catch regressions immediately.

**Exit criteria:** All tests pass, including the new one.

---

## Phase 3: Refactor

Now that tests are green, clean up without changing behavior.

1. **Remove duplication** — if the same logic appears twice, extract it.
2. **Clarify naming** — rename variables, functions, or files if the intent is unclear.
3. **Simplify structure** — if a function is doing too many things, split it. If an abstraction isn't earning its keep, inline it.
4. **Run all tests after every change** — refactoring must not change behavior. If a test breaks, you changed behavior. Undo and try again.

**Exit criteria:** Code is clean, all tests still pass.

---

## Phase 4: Repeat

Go back to Phase 1 with the next behavior. Each cycle should take 2-10 minutes. If a cycle takes longer than 15 minutes, you've bitten off too much — break it into smaller behaviors.

---

## Choosing What to Test

### Test behaviors, not implementations

```
Good: "returns empty array when no results match"
Bad:  "calls database query with correct SQL"
```

### Test boundaries and edge cases

For each behavior, consider:
- **Happy path** — normal input, expected output
- **Empty/zero/null** — what happens with nothing?
- **Boundary values** — off-by-one, max length, exactly at limit
- **Error cases** — invalid input, missing resources, network failures

### Don't test

- Private implementation details (they change during refactoring)
- Framework/library internals (trust your dependencies)
- Trivial getters/setters with no logic

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I'll write tests after" | Tests written after confirm your implementation, not your intent. They encode your blind spots. |
| "This is too simple to test" | Simple things have a way of becoming complex. The test takes 30 seconds now and saves 30 minutes later. |
| "I need to see the code first to know what to test" | That's backwards. The test defines what the code should do. Write the test, then write the code to satisfy it. |
| "Let me get it working first" | You don't know if it works without a test. "It runs" is not the same as "it's correct." |
| "TDD is too slow" | Writing code without tests is fast until something breaks. Then it's very slow. TDD is consistently paced. |
| "I can't test this" | Usually means you can't test it *the way it's currently structured*. That's a design signal — restructure for testability. |
| "The existing code doesn't have tests" | That's an argument for starting, not for continuing. Add tests for the code you write. |

## Red Flags

- Writing more than 10 lines of production code without a failing test
- A test that passes on the first run (you didn't see it fail — you don't know what it tests)
- Spending more than 15 minutes in a single red-green-refactor cycle
- Writing multiple tests before writing any production code (write one, pass one)
- Refactoring while the tests are red (get to green first, then refactor)
- Adding code "just in case" that no test requires
- Skipping the refactor phase ("it works, ship it")

## Cross-References

- Use the **bug-diagnosis** skill when a test reveals unexpected behavior in existing code.
- Use the **code-review** skill to review test quality alongside implementation quality.
```

**Step 2: Verify**

```bash
head -5 skills/general/tdd/SKILL.md
```

**Step 3: Commit**

```bash
git add skills/general/tdd/SKILL.md && git commit -m "feat: add tdd skill

Test-driven development with red-green-refactor discipline.
Used by Ironclad and Deadeye agents."
```

---

### Task 4: Create the `documentation` skill

**Files:**
- Create: `skills/general/documentation/SKILL.md`

**Step 1: Write the skill file**

Create `skills/general/documentation/SKILL.md` with the following content:

```markdown
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
```

**Step 2: Commit**

```bash
git add skills/general/documentation/SKILL.md && git commit -m "feat: add documentation skill

Structured documentation generation for codebases and APIs.
Used by Lorekeeper agent."
```

---

### Task 5: Create the `optimization` skill

**Files:**
- Create: `skills/general/optimization/SKILL.md`

**Step 1: Write the skill file**

Create `skills/general/optimization/SKILL.md` with the following content:

```markdown
---
name: optimization
description: Performance profiling, benchmarking, and bottleneck elimination
tags: [performance, optimization, general]
---

# Optimization

Improve performance through measurement, not intuition. Profile first, identify the bottleneck, benchmark before and after, and prove the improvement with numbers. Never optimize without evidence.

## Workflow

```
Measure → Identify → Benchmark → Optimize → Verify
```

---

## Phase 1: Measure

Understand current performance before changing anything.

1. **Define the metric** — what are you optimizing? Response time, throughput, memory usage, bundle size, startup time? Be specific.
2. **Establish a baseline** — measure the current value of that metric under realistic conditions. Record the exact conditions (data size, concurrency, hardware).
3. **Profile** — use language-appropriate profiling tools to identify where time and resources are spent.

Common profiling tools:
- **JavaScript/Node:** Chrome DevTools, `node --prof`, `clinic.js`
- **Python:** `cProfile`, `py-spy`, `line_profiler`
- **Go:** `pprof`, `trace`
- **General:** `time`, `perf`, `valgrind`, `strace`
- **Web:** Lighthouse, WebPageTest, browser DevTools Performance tab

**Exit criteria:** You have a baseline measurement and a profile showing where the bottleneck is.

---

## Phase 2: Identify

Find the actual bottleneck — not what you think is slow.

1. **Follow the data** — the profile tells you where time is spent. Start with the hottest path.
2. **Classify the bottleneck:**
   - **CPU-bound** — computation, parsing, serialization, complex algorithms
   - **I/O-bound** — network requests, disk reads, database queries
   - **Memory-bound** — excessive allocation, GC pressure, memory leaks
   - **Concurrency** — lock contention, thread starvation, connection pool exhaustion
3. **Quantify the impact** — how much of the total time does this bottleneck represent? Optimizing something that's 2% of total time saves almost nothing (Amdahl's law).

**Exit criteria:** You can name the specific bottleneck, its category, and its percentage of total cost.

---

## Phase 3: Benchmark

Set up repeatable benchmarks before making changes.

1. **Write a benchmark** — an automated, repeatable test that exercises the bottleneck under realistic conditions.
2. **Run it multiple times** — 5-10 runs minimum. Record mean, median, and standard deviation. Single runs are meaningless due to variance.
3. **Control the environment** — same machine, same data, same conditions every time. Close other applications. Pin to CPU cores if variance is high.
4. **Record the baseline** — save the exact results. You'll compare against these after optimization.

**Exit criteria:** A repeatable benchmark with stable baseline results.

---

## Phase 4: Optimize

Apply targeted changes to the identified bottleneck.

### Strategies by bottleneck type

**CPU-bound:**
- Reduce algorithmic complexity (O(n²) → O(n log n))
- Cache computed results (memoization)
- Avoid redundant work (deduplication, short-circuit evaluation)
- Use more efficient data structures (hash map vs. linear search)

**I/O-bound:**
- Batch requests (N queries → 1 query)
- Add caching (in-memory, Redis, CDN)
- Parallelize independent I/O operations
- Reduce payload size (pagination, field selection, compression)

**Memory-bound:**
- Stream instead of loading everything into memory
- Pool and reuse objects instead of allocating new ones
- Fix leaks (unclosed connections, growing caches without eviction)
- Use compact data representations

**Concurrency:**
- Reduce lock scope and duration
- Use lock-free data structures where appropriate
- Increase pool sizes for genuine resource starvation
- Add backpressure to prevent overload

### Rules

- **One change at a time.** Measure after each change. Bundled changes make it impossible to attribute improvement.
- **Don't sacrifice correctness.** A fast wrong answer is worse than a slow right answer. Run your test suite after every change.
- **Don't optimize readability away.** If the optimized code is significantly harder to understand, document why the optimization is necessary and what it does.

---

## Phase 5: Verify

Prove the optimization worked with numbers.

1. **Run the benchmark** — same conditions as baseline. Record results.
2. **Compare** — calculate the percentage improvement. Is it meaningful? (<5% is often noise.)
3. **Run the test suite** — ensure no regressions. Optimization must not break correctness.
4. **Check for side effects** — did you trade CPU for memory? Speed for readability? Make the trade-off explicit.
5. **Document the results** — record before/after numbers, the change made, and why it works. Include this in the commit message or PR description.

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I know what's slow" | Intuition about performance is wrong more often than right. Profile first. |
| "This optimization is obvious" | Even obvious optimizations need measurements. Sometimes the "obvious" fix makes things worse. |
| "Let me optimize everything while I'm here" | Optimize the bottleneck. Everything else is wasted effort (Amdahl's law). |
| "I don't need benchmarks for this" | Without before/after numbers, you don't know if you improved anything. You might have made it worse. |
| "Premature optimization is the root of all evil" | This quote is about optimizing without profiling. Once you've profiled and found the bottleneck, optimizing it is the right call. |
| "It's fast enough" | Define "fast enough" with a number. If current performance meets that number, don't optimize. If it doesn't, optimize. |

## Red Flags

- Optimizing without profiling first
- No baseline measurement before making changes
- Making multiple changes between benchmark runs
- Optimizing code that's <5% of total execution time
- Sacrificing correctness for performance without explicit justification
- No before/after comparison with actual numbers
- Optimizing for a metric nobody asked about

## Cross-References

- Use the **tdd** skill to ensure optimizations don't break correctness.
- Use the **code-review** skill to review optimizations that sacrifice readability.
```

**Step 2: Commit**

```bash
git add skills/general/optimization/SKILL.md && git commit -m "feat: add optimization skill

Performance profiling, benchmarking, and bottleneck elimination.
Used by Titan agent."
```

---

### Task 6: Refine existing skills — add cross-references to new skills

**Files:**
- Modify: `skills/general/code-review/SKILL.md`
- Modify: `skills/general/feature-implementation/SKILL.md`
- Modify: `skills/general/bug-diagnosis/SKILL.md`

**Step 1: Update code-review cross-references**

At the end of `skills/general/code-review/SKILL.md`, after the `### Rules` section, add:

```markdown

## Cross-References

- When reviewing performance-critical code, consider invoking the **optimization** skill for deeper profiling.
- When reviewing test coverage alongside implementation, reference the **tdd** skill for test quality standards.
```

**Step 2: Update feature-implementation cross-references**

In `skills/general/feature-implementation/SKILL.md`, replace the existing `## Cross-References` section with:

```markdown
## Cross-References

- If you hit a bug during implementation, switch to the **bug-diagnosis** skill. Diagnose and fix it properly, then return here.
- After shipping, use the **code-review** skill if the changes touch critical paths.
- For the planning phase, the **planning** skill provides a more thorough framework for large features.
- All implementation in Phase 3 should follow the **tdd** skill's red-green-refactor discipline.
```

**Step 3: Update bug-diagnosis cross-references**

In `skills/general/bug-diagnosis/SKILL.md`, replace the existing `## Cross-References` section with:

```markdown
## Cross-References

- If the bug was discovered during feature work, return to the **feature-implementation** skill after the fix is verified.
- Use the **code-review** skill to review fixes that touch security-sensitive or critical code paths.
- Write regression tests using the **tdd** skill's discipline — failing test first, then fix.
```

**Step 4: Commit**

```bash
git add skills/general/code-review/SKILL.md skills/general/feature-implementation/SKILL.md skills/general/bug-diagnosis/SKILL.md && git commit -m "refactor: update skill cross-references for new skills

Add references to planning, tdd, and optimization skills
in existing code-review, feature-implementation, and bug-diagnosis skills."
```

---

### Task 7: Create agent directory and Ironclad agent

**Files:**
- Create: `agents/ironclad/AGENT.md`

**Step 1: Create the directory and write the agent file**

Create `agents/ironclad/AGENT.md`:

```markdown
---
name: Ironclad
description: The engineer — builds features from blueprint to production
tags: [feature, tdd, orchestration]
requires:
  skills: [planning, tdd, feature-implementation, code-review]
  agents: [aegis]
features: [worktrees, subagents]
---

# Ironclad

The engineer who builds. Ironclad takes a feature from vague idea to merged PR through a disciplined pipeline: plan it, isolate it, design it, build it test-first, review it, ship it.

## Orchestration Flow

```
Planning → Worktree → Architecture → TDD Implementation → Review → Ship
```

---

## Phase 1: Plan

Invoke the **planning** skill to turn the feature request into a concrete plan.

- Gather requirements through structured questions
- Explore the codebase to understand affected areas
- Propose 2-3 approaches with trade-offs
- Get explicit approval before proceeding
- Document the chosen approach

**Do not skip this phase.** Even "obvious" features benefit from 2 minutes of planning.

---

## Phase 2: Isolate

Create a git worktree to isolate the feature work from the main branch.

1. Use the `EnterWorktree` tool to create an isolated workspace
2. All implementation happens in the worktree
3. This protects the main branch from incomplete work

**When to skip:** Only for truly trivial changes (1-2 lines, zero risk). Default is to use a worktree.

---

## Phase 3: Architect

For features touching 3+ files or involving design decisions, use the `feature-dev:code-architect` subagent.

- Spawn a `Task` with `subagent_type: "feature-dev:code-architect"` to design the architecture
- The architect analyzes existing patterns and produces an implementation blueprint
- Review the blueprint before proceeding to implementation

**When to skip:** Small features (1-2 files, obvious structure). Proceed directly to Phase 4.

---

## Phase 4: Implement

Invoke the **feature-implementation** skill with **tdd** discipline.

1. Follow the feature-implementation workflow: Scope → Plan → Implement → Verify → Ship
2. During the Implement phase, strictly follow the **tdd** skill: red → green → refactor for every behavior
3. Commit after each TDD cycle — small, incremental commits

This is the core of the work. Stay disciplined. Write the failing test first. Make it pass with minimal code. Refactor. Repeat.

---

## Phase 5: Review

Invoke the **aegis** agent for multi-dimensional code review.

- Aegis spawns parallel review subagents for security, performance, and correctness
- Address all critical findings before proceeding
- Address warnings where reasonable

If Aegis is not installed, fall back to the **code-review** skill for a single-pass review.

---

## Phase 6: Ship

Create a PR from the worktree branch.

1. Clean up commit history if needed
2. Write a PR description summarizing: what was built, how it works, how to test it
3. Push the branch and create the PR

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I don't need a worktree for this" | You probably do. Worktrees cost 5 seconds to create and save you from broken main branches. |
| "Planning is overhead" | Planning is where you catch bad assumptions. 5 minutes of planning saves hours of rework. |
| "I'll review my own code later" | Self-review is Phase 4 of feature-implementation. Aegis review is additional external review. Both happen. |
| "This feature is too small for all these phases" | Skip Phase 3 (architect) for small features. Everything else still applies. |
| "I know the codebase well enough to skip exploration" | Familiarity breeds assumptions. The planning skill's exploration phase catches stale mental models. |

## Red Flags

- Starting implementation without completing the planning phase
- Skipping worktree creation for non-trivial changes
- Writing more than 20 lines without a failing test
- Skipping the review phase because "I reviewed it myself"
- Large monolithic commits instead of incremental TDD commits
- Not addressing critical findings from review
```

**Step 2: Commit**

```bash
git add agents/ironclad/AGENT.md && git commit -m "feat: add Ironclad agent

The engineer — builds features from blueprint to production.
Orchestrates planning, tdd, feature-implementation, code-review skills + aegis agent."
```

---

### Task 8: Create Deadeye agent

**Files:**
- Create: `agents/deadeye/AGENT.md`

**Step 1: Write the agent file**

Create `agents/deadeye/AGENT.md`:

```markdown
---
name: Deadeye
description: The sharpshooter — hunts bugs with hypothesis-driven precision
tags: [debugging, tdd, orchestration]
requires:
  skills: [bug-diagnosis, tdd, code-review]
features: [worktrees, subagents]
---

# Deadeye

The sharpshooter who never misses. Deadeye hunts bugs through disciplined investigation — reproduce, hypothesize, isolate, fix test-first, verify. No guesswork, no shotgun debugging, no "trying things."

## Orchestration Flow

```
Reproduce → Isolate → Worktree → Diagnose → TDD Fix → Review → Ship
```

---

## Phase 1: Reproduce & Isolate

Before touching any code, confirm you can trigger the bug.

1. Capture the exact symptom — error message, stack trace, incorrect output
2. Reproduce the bug yourself with a known set of steps
3. If you can't reproduce it, gather more information before proceeding

---

## Phase 2: Worktree

Create a git worktree to isolate the fix.

1. Use the `EnterWorktree` tool to create an isolated workspace
2. This protects the main branch while you investigate and fix

---

## Phase 3: Diagnose

Invoke the **bug-diagnosis** skill for hypothesis-driven debugging.

- Follow the full workflow: Reproduce → Isolate → Hypothesize → Fix → Verify
- Form explicit hypotheses: "The bug is caused by X because Y"
- Test each hypothesis with the smallest possible experiment
- If you need to trace execution paths, spawn a `Task` with `subagent_type: "feature-dev:code-explorer"` to analyze the code

**Escalation rule:** After 3 failed hypotheses, stop and reassess. Are you looking at the right layer? Are your assumptions correct?

---

## Phase 4: Fix (Test-First)

Once you've identified the root cause, fix it with TDD discipline.

1. Invoke the **tdd** skill
2. **Write a regression test first** — a test that reproduces the exact bug condition and fails right now
3. Run it — confirm it fails for the right reason
4. Write the minimal fix to make the test pass
5. Run all tests — confirm nothing else broke
6. Commit: one commit for the test, one for the fix (or combined if small)

**Do not fix without a test.** If you truly can't write a test (pure UI bug, race condition), document why and define manual verification steps.

---

## Phase 5: Review

Self-review using the **code-review** skill.

- Review your own diff as if reviewing someone else's code
- Focus on: did you fix the root cause (not just the symptom)? Any regressions? Test quality?
- For fixes touching critical paths, request external review

---

## Phase 6: Ship

Create a PR from the worktree branch.

1. Write a PR description that includes:
   - What the bug was (symptom + root cause)
   - How the fix works
   - How to verify (link to the regression test)
2. Push and create the PR

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I can see the fix, let me just do it" | You see a potential issue. Without reproduction and hypothesis, you don't know if it's the actual bug. |
| "I don't need a regression test for this" | Then it'll regress and you'll debug it again in 3 months. Write the test. |
| "Let me just try this quick fix" | "Quick fixes" without diagnosis often mask the real bug or introduce new ones. |
| "The bug is obvious" | Obvious bugs don't survive to be reported. If it's in front of you, something non-obvious is going on. |
| "I'll add a try/catch" | Exception swallowing hides bugs. Find the root cause. |

## Red Flags

- Changing code before reproducing the bug
- No explicit hypothesis — just "trying things"
- Fixing without a regression test
- Testing multiple hypotheses simultaneously (changing 3 things at once)
- Declaring "fixed" without re-running the original reproduction steps
- Skipping the worktree for non-trivial fixes
```

**Step 2: Commit**

```bash
git add agents/deadeye/AGENT.md && git commit -m "feat: add Deadeye agent

The sharpshooter — hunts bugs with hypothesis-driven precision.
Orchestrates bug-diagnosis, tdd, code-review skills."
```

---

### Task 9: Create Aegis agent

**Files:**
- Create: `agents/aegis/AGENT.md`

**Step 1: Write the agent file**

Create `agents/aegis/AGENT.md`:

```markdown
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
```

**Step 2: Commit**

```bash
git add agents/aegis/AGENT.md && git commit -m "feat: add Aegis agent

The shield — multi-layered code review protecting quality on all fronts.
Orchestrates code-review skill with parallel subagents."
```

---

### Task 10: Create Oracle agent

**Files:**
- Create: `agents/oracle/AGENT.md`

**Step 1: Write the agent file**

Create `agents/oracle/AGENT.md`:

```markdown
---
name: Oracle
description: The all-seeing — maps codebases and reveals architecture instantly
tags: [exploration, onboarding, orchestration]
requires:
  skills: []
  agents: []
features: [subagents]
---

# Oracle

The all-seeing eye. Oracle maps unfamiliar codebases by deploying exploration subagents to analyze structure, trace critical paths, and produce a comprehensive overview. Deploy Oracle when you need to understand a new repository or get someone up to speed fast.

## Orchestration Flow

```
Explore Structure → Analyze Patterns → Trace Paths → Generate Overview → Interactive Q&A
```

---

## Phase 1: Explore Structure

Deploy the `Explore` subagent to map the repository.

Spawn a `Task` with `subagent_type: "Explore"`:
- Map the directory structure: identify source directories, test directories, config files, build files
- Identify the tech stack: languages, frameworks, build tools, package managers
- Find entry points: main files, route definitions, CLI entry points, server startup
- Note project metadata: README, LICENSE, CI/CD config, docker files

---

## Phase 2: Analyze Patterns

Investigate the architectural patterns and conventions.

1. **Code organization** — is it organized by feature, by layer, by domain? What's the pattern?
2. **Key abstractions** — what are the main interfaces, base classes, or patterns? (MVC, repository pattern, middleware, hooks, etc.)
3. **Dependencies** — what external libraries are central to the architecture? Check package manifests.
4. **Configuration** — how is the app configured? Environment variables, config files, feature flags?
5. **Conventions** — naming patterns, file naming, import style, error handling patterns

---

## Phase 3: Trace Critical Paths

Follow the most important execution paths through the codebase.

For web applications:
- **Request lifecycle** — from incoming request to response (routing → middleware → handler → response)
- **Data flow** — from user input to database and back
- **Authentication** — how users are authenticated and authorized

For CLI tools:
- **Command parsing** — from argv to command execution
- **Core logic** — the main processing pipeline

For libraries:
- **Public API** — the exported surface area and how it maps to internal modules
- **Extension points** — hooks, plugins, middleware, or customization patterns

Use `feature-dev:code-explorer` subagent for deep tracing when needed.

---

## Phase 4: Generate Overview

Produce a structured overview document.

```markdown
# [Project Name] — Codebase Overview

## Tech Stack
- **Language:** [e.g., TypeScript 5.x]
- **Framework:** [e.g., Next.js 14]
- **Database:** [e.g., PostgreSQL via Prisma]
- **Build:** [e.g., Turbopack]
- **Testing:** [e.g., Vitest + Playwright]

## Architecture
[2-3 paragraphs explaining how the major pieces fit together.
Include a simple diagram if it helps.]

## Key Directories
| Path | Purpose |
|------|---------|
| `src/app/` | Next.js app router pages |
| `src/lib/` | Shared utilities and helpers |
| `src/components/` | React components |

## Entry Points
- **Web server:** `src/app/layout.tsx`
- **API routes:** `src/app/api/`
- **CLI:** `src/cli/index.ts`

## Critical Paths
### Request Lifecycle
[Step-by-step description]

### Data Flow
[Step-by-step description]

## Conventions
- [File naming convention]
- [Import ordering convention]
- [Error handling pattern]
- [Testing pattern]

## Development
- **Build:** `npm run build`
- **Test:** `npm test`
- **Dev server:** `npm run dev`
- **Lint:** `npm run lint`
```

---

## Phase 5: Interactive Q&A

After presenting the overview, offer to answer questions.

- "What would you like to explore further?"
- Use the `Explore` subagent for follow-up deep dives
- Trace specific paths on request
- Explain specific files or patterns in detail

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I can figure out the codebase by reading a few files" | You'll get a partial picture with blind spots. Systematic exploration reveals the full architecture. |
| "The README tells me everything" | READMEs are often outdated or incomplete. Verify against the actual code. |
| "I'll just start coding and learn as I go" | You'll waste time rediscovering what Oracle could tell you in 5 minutes. |
| "This codebase is too big to overview" | Break it into layers. Even large codebases have a finite number of key abstractions and patterns. |

## Red Flags

- Skipping Phase 1 (structure exploration) and jumping to conclusions
- Not verifying claims against actual code
- Producing an overview without tracing critical paths
- Ignoring test infrastructure and build systems
- Generating a generic overview that doesn't reflect this specific codebase
```

**Step 2: Commit**

```bash
git add agents/oracle/AGENT.md && git commit -m "feat: add Oracle agent

The all-seeing — maps codebases and reveals architecture instantly.
Uses Explore and code-explorer subagents for codebase onboarding."
```

---

### Task 11: Create Lorekeeper agent

**Files:**
- Create: `agents/lorekeeper/AGENT.md`

**Step 1: Write the agent file**

Create `agents/lorekeeper/AGENT.md`:

```markdown
---
name: Lorekeeper
description: The chronicler — documents APIs, architecture, and tribal knowledge
tags: [documentation, orchestration]
requires:
  skills: [documentation]
features: [subagents]
---

# Lorekeeper

The chronicler who captures all knowledge. Lorekeeper analyzes codebases and produces documentation that's accurate, useful, and proportional. Deploy Lorekeeper when documentation is missing, stale, or needs a comprehensive refresh.

## Orchestration Flow

```
Explore → Assess → Document → Validate
```

---

## Phase 1: Explore

Map the codebase to understand what exists and what needs documenting.

1. Spawn a `Task` with `subagent_type: "Explore"` to map the repository structure, identify public APIs, key abstractions, and existing documentation
2. Note existing documentation style and conventions
3. Identify areas with no documentation, outdated documentation, or incorrect documentation

---

## Phase 2: Assess

Determine what documentation to produce, in priority order.

Present findings to the user:
- "Here's what I found — these areas need documentation: [list]"
- "Existing docs are [fresh/stale/missing] in these areas: [list]"
- "What should I prioritize?"

Invoke the **documentation** skill's Phase 2 (Prioritize) to rank documentation needs:
- High: README, public API, architecture overview
- Medium: configuration, development workflow, data models
- Low: internal implementation, self-documenting code

Get user approval on priorities before generating docs.

---

## Phase 3: Document

Invoke the **documentation** skill to generate each piece of documentation.

Follow the skill's principles:
- Accuracy over completeness — verify every claim against code
- Why over what — explain reasoning, not code restated in English
- Examples over descriptions — concrete usage examples
- DRY — link instead of duplicate

For each documentation piece:
1. Read the relevant code thoroughly
2. Generate the documentation following the skill's templates
3. Match existing project conventions (JSDoc, docstrings, markdown, etc.)

---

## Phase 4: Validate

Invoke the **documentation** skill's Phase 4 (Validate).

1. Test instructions — can someone follow the README setup steps?
2. Verify API docs — do documented parameters match actual signatures?
3. Check for staleness — any references to renamed or removed code?
4. Present the documentation to the user for review

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I'll document everything" | That's wasteful. Prioritize what helps people most. Not everything needs docs. |
| "The code speaks for itself" | It speaks *what*, not *why*. Lorekeeper captures the why. |
| "Let me just generate it all at once" | Generating without assessing priorities produces bulk, not value. Assess first. |
| "I don't need to validate" | Inaccurate docs are worse than no docs. Always validate against the code. |

## Red Flags

- Generating documentation without reading the code it describes
- Not checking for existing documentation conventions
- Producing docs without user input on priorities
- Skipping validation against actual code behavior
- Documenting internal implementation details that change frequently
```

**Step 2: Commit**

```bash
git add agents/lorekeeper/AGENT.md && git commit -m "feat: add Lorekeeper agent

The chronicler — documents APIs, architecture, and tribal knowledge.
Orchestrates documentation skill with Explore subagent."
```

---

### Task 12: Create Titan agent

**Files:**
- Create: `agents/titan/AGENT.md`

**Step 1: Write the agent file**

Create `agents/titan/AGENT.md`:

```markdown
---
name: Titan
description: The powerhouse — optimizes performance and eliminates bottlenecks
tags: [performance, optimization, orchestration]
requires:
  skills: [optimization, code-review]
features: [worktrees, subagents]
---

# Titan

The powerhouse who crushes bottlenecks. Titan optimizes performance through measurement, not intuition — profile, benchmark, optimize, prove. Every improvement is backed by numbers.

## Orchestration Flow

```
Profile → Identify → Worktree → Benchmark → Optimize → Verify → Ship
```

---

## Phase 1: Profile

Invoke the **optimization** skill's Phase 1 (Measure).

1. Define the metric with the user — what are we optimizing? Response time? Throughput? Memory? Bundle size?
2. Establish a baseline measurement under realistic conditions
3. Profile to identify where time and resources are spent
4. Use `feature-dev:code-explorer` subagent if you need to trace execution paths through unfamiliar code

---

## Phase 2: Identify

Invoke the **optimization** skill's Phase 2 (Identify).

- Follow the profiling data to the actual bottleneck
- Classify it: CPU-bound, I/O-bound, memory-bound, or concurrency
- Quantify the impact — what percentage of total time does this bottleneck represent?
- If it's <5% of total time, reconsider — optimizing it won't meaningfully help (Amdahl's law)

Present findings to the user: "The bottleneck is X, representing Y% of total time. Here's my plan to address it."

---

## Phase 3: Worktree

Create a git worktree to isolate the optimization work.

1. Use the `EnterWorktree` tool
2. All optimization changes happen in the worktree
3. The main branch stays untouched until the improvement is proven

---

## Phase 4: Benchmark

Invoke the **optimization** skill's Phase 3 (Benchmark).

1. Write an automated, repeatable benchmark that exercises the bottleneck
2. Run it 5-10 times and record mean, median, standard deviation
3. Save the baseline results — these are the numbers to beat

---

## Phase 5: Optimize

Invoke the **optimization** skill's Phase 4 (Optimize).

- Apply targeted changes to the identified bottleneck
- **One change at a time** — measure after each change
- Follow the skill's strategies by bottleneck type (CPU, I/O, memory, concurrency)
- Run the test suite after each change — correctness first, performance second

---

## Phase 6: Verify

Invoke the **optimization** skill's Phase 5 (Verify).

1. Run the benchmark — same conditions as baseline
2. Compare: calculate percentage improvement
3. Run the full test suite — no regressions
4. Document before/after numbers in the commit message

---

## Phase 7: Review & Ship

1. Self-review using the **code-review** skill — focus on readability trade-offs
2. Write a PR description that includes:
   - What was optimized and why
   - Before/after benchmark numbers
   - The approach taken
   - Any trade-offs made (e.g., memory for speed)
3. Push and create the PR from the worktree

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I know what's slow" | Profile first. Intuition about performance is wrong more often than right. |
| "Let me optimize multiple things" | One change at a time. Otherwise you can't attribute the improvement. |
| "I don't need a worktree for perf work" | Performance work involves experimentation. Worktrees keep failed experiments from polluting your branch. |
| "The benchmark shows 3% improvement" | Is 3% meaningful for this metric? Define "fast enough" with a number before starting. |
| "It's fast enough after my change" | Show the numbers. Before/after comparison or it didn't happen. |

## Red Flags

- Optimizing without profiling first
- No baseline measurement before changes
- Making multiple changes between benchmark runs
- Skipping the worktree (failed optimization experiments on main branch)
- No before/after numbers in the PR description
- Sacrificing correctness for speed without explicit justification
- Optimizing code that represents <5% of execution time
```

**Step 2: Commit**

```bash
git add agents/titan/AGENT.md && git commit -m "feat: add Titan agent

The powerhouse — optimizes performance and eliminates bottlenecks.
Orchestrates optimization and code-review skills with worktree isolation."
```

---

### Task 13: Update build-catalog.sh for agents and used_by

**Files:**
- Modify: `scripts/build-catalog.sh`

**Step 1: Rewrite build-catalog.sh**

Replace the entire contents of `scripts/build-catalog.sh` with:

```bash
#!/usr/bin/env bash
#
# build-catalog.sh -- Walk skills/ and agents/ and produce catalog.json
# Uses only standard unix tools (awk/sed/grep).
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="$REPO_ROOT/catalog.json"

# Collect entries per category into shell variables
skills_json=""
agents_json=""

# Track agent requirements for computing used_by
# Format: "agent_slug:skill_slug" pairs
declare -a agent_skill_deps=()

parse_frontmatter() {
  local filepath="$1"
  awk 'BEGIN{found=0} /^---$/{found++; next} found==1{print} found>=2{exit}' "$filepath"
}

parse_field() {
  local frontmatter="$1"
  local field="$2"
  echo "$frontmatter" | grep "^${field}:" | sed "s/^${field}:[[:space:]]*//" | sed 's/^["'"'"']//' | sed 's/["'"'"']$//'
}

parse_array() {
  local raw="$1"
  raw="$(echo "$raw" | sed 's/^\[//' | sed 's/\]$//')"
  local json="["
  local first=1
  IFS=',' read -ra arr <<< "$raw"
  for item in "${arr[@]}"; do
    item="$(echo "$item" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' | sed 's/^["'"'"']//' | sed 's/["'"'"']$//')"
    if [ -n "$item" ]; then
      if [ "$first" -eq 1 ]; then
        first=0
      else
        json+=", "
      fi
      json+="\"$item\""
    fi
  done
  json+="]"
  echo "$json"
}

process_skill() {
  local filepath="$1"
  local relpath="${filepath#$REPO_ROOT/}"
  local slug
  slug="$(basename "$(dirname "$filepath")")"
  local group
  group="$(echo "$relpath" | cut -d/ -f2)"

  local frontmatter
  frontmatter="$(parse_frontmatter "$filepath")"

  local name
  name="$(parse_field "$frontmatter" "name")"
  local description
  description="$(parse_field "$frontmatter" "description")"
  local tags_raw
  tags_raw="$(parse_field "$frontmatter" "tags")"
  local tags_json
  tags_json="$(parse_array "$tags_raw")"

  # used_by will be filled in after all agents are processed
  local entry
  entry="    {\"name\": \"$name\", \"slug\": \"$slug\", \"description\": \"$description\", \"tags\": $tags_json, \"group\": \"$group\", \"path\": \"$relpath\", \"used_by\": []}"

  if [ -n "$skills_json" ]; then
    skills_json+=$',\n'
  fi
  skills_json+="$entry"
}

process_agent() {
  local filepath="$1"
  local relpath="${filepath#$REPO_ROOT/}"
  local slug
  slug="$(basename "$(dirname "$filepath")")"

  local frontmatter
  frontmatter="$(parse_frontmatter "$filepath")"

  local name
  name="$(parse_field "$frontmatter" "name")"
  local description
  description="$(parse_field "$frontmatter" "description")"
  local tags_raw
  tags_raw="$(parse_field "$frontmatter" "tags")"
  local tags_json
  tags_json="$(parse_array "$tags_raw")"

  # Parse requires.skills and requires.agents from indented YAML
  local req_skills_raw
  req_skills_raw="$(echo "$frontmatter" | awk '/^requires:/{found=1; next} found && /^  skills:/{print; next} found && /^  agents:/{next} found && /^[^ ]/{exit}' | sed 's/^  skills:[[:space:]]*//')"
  local req_agents_raw
  req_agents_raw="$(echo "$frontmatter" | awk '/^requires:/{found=1; next} found && /^  agents:/{print; next} found && /^  skills:/{next} found && /^[^ ]/{exit}' | sed 's/^  agents:[[:space:]]*//')"

  local req_skills_json
  req_skills_json="$(parse_array "$req_skills_raw")"
  local req_agents_json
  req_agents_json="$(parse_array "$req_agents_raw")"

  # Parse features
  local features_raw
  features_raw="$(parse_field "$frontmatter" "features")"
  local features_json
  features_json="$(parse_array "$features_raw")"

  # Track skill dependencies for used_by computation
  local clean_skills
  clean_skills="$(echo "$req_skills_raw" | sed 's/^\[//' | sed 's/\]$//')"
  IFS=',' read -ra skill_arr <<< "$clean_skills"
  for skill in "${skill_arr[@]}"; do
    skill="$(echo "$skill" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' | sed 's/^["'"'"']//' | sed 's/["'"'"']$//')"
    if [ -n "$skill" ]; then
      agent_skill_deps+=("${slug}:${skill}")
    fi
  done

  local entry
  entry="    {\"name\": \"$name\", \"slug\": \"$slug\", \"description\": \"$description\", \"tags\": $tags_json, \"path\": \"$relpath\", \"requires\": {\"skills\": $req_skills_json, \"agents\": $req_agents_json}, \"features\": $features_json}"

  if [ -n "$agents_json" ]; then
    agents_json+=$',\n'
  fi
  agents_json+="$entry"
}

# Process skills
if [ -d "$REPO_ROOT/skills" ]; then
  while IFS= read -r -d '' mdfile; do
    process_skill "$mdfile"
  done < <(find "$REPO_ROOT/skills" -name 'SKILL.md' -print0 | sort -z)
fi

# Process agents
if [ -d "$REPO_ROOT/agents" ]; then
  while IFS= read -r -d '' mdfile; do
    process_agent "$mdfile"
  done < <(find "$REPO_ROOT/agents" -name 'AGENT.md' -print0 | sort -z)
fi

# Compute used_by for each skill by scanning agent_skill_deps
# Replace the empty used_by arrays in skills_json
for dep in "${agent_skill_deps[@]}"; do
  agent_slug="${dep%%:*}"
  skill_slug="${dep#*:}"
  # Add agent to the skill's used_by array
  # Match the skill entry by slug and append to its used_by
  if echo "$skills_json" | grep -q "\"slug\": \"$skill_slug\""; then
    # Replace empty used_by or append to existing
    skills_json="$(echo "$skills_json" | awk -v slug="$skill_slug" -v agent="$agent_slug" '
    {
      if (index($0, "\"slug\": \"" slug "\"") > 0) {
        if (index($0, "\"used_by\": []") > 0) {
          gsub("\"used_by\": \\[\\]", "\"used_by\": [\"" agent "\"]")
        } else {
          # Append to existing used_by array
          match($0, /"used_by": \[[^\]]*/)
          before = substr($0, 1, RSTART + RLENGTH - 1)
          after = substr($0, RSTART + RLENGTH)
          $0 = before ", \"" agent "\"" after
        }
      }
      print
    }')"
  fi
done

# Write catalog.json
cat > "$OUTPUT" <<EOF
{
  "skills": [
${skills_json}
  ],
  "agents": [
${agents_json}
  ]
}
EOF

echo "catalog.json generated at $OUTPUT"
echo "$(grep -c '"slug"' "$OUTPUT") entries written."
```

**Step 2: Make it executable and test**

```bash
chmod +x scripts/build-catalog.sh
bash scripts/build-catalog.sh
```

Expected: `catalog.json generated at .../catalog.json` with 7 skills + 6 agents = 13 entries.

**Step 3: Verify catalog.json has correct structure**

```bash
grep '"used_by"' catalog.json
```

Expected: Each skill that's used by agents shows those agents in its `used_by` array. Skills with no agent users show `"used_by": []`.

**Step 4: Commit**

```bash
git add scripts/build-catalog.sh catalog.json && git commit -m "feat: update build-catalog.sh for agents and used_by

Scan agents/ directory, parse requires/features frontmatter,
compute used_by reverse mapping for skills. Remove templates/prompts scanning."
```

---

### Task 14: Update install.sh for agents and dependency resolution

**Files:**
- Modify: `install.sh`

This is the largest change. The key modifications are:

1. Update banner text
2. Update catalog rebuild path to check `skills/` and `agents/` instead of `templates/` and `prompts/`
3. Update category detection to handle `"agents"` section
4. Add dependency resolution for agent installation
5. Remove template and prompt installation logic
6. Update menus to show two categories

**Step 1: Update banner**

In the `show_banner()` function, change `"Skills · Templates · Prompts"` to `"Agents · Skills"` in both the gum and bash branches.

In the gum branch (~line 74), change:
```
      "Skills · Templates · Prompts"
```
to:
```
      "Assemble Your Team" \
      "" \
      "Agents · Skills"
```

In the bash branch (~lines 78-80), change the banner content lines to:
```bash
    printf "${AMBER}  │${RESET}    ${BOLD}${WHITE}Claude Playground${RESET}                ${AMBER}│${RESET}\n"
    printf "${AMBER}  │${RESET}    ${GRAY}─────────────────${RESET}                ${AMBER}│${RESET}\n"
    printf "${AMBER}  │${RESET}    ${GRAY}Assemble Your Team${RESET}               ${AMBER}│${RESET}\n"
    printf "${AMBER}  │${RESET}    ${GRAY}Agents · Skills${RESET}                  ${AMBER}│${RESET}\n"
```

**Step 2: Update catalog rebuild check**

At ~line 137, change:
```bash
  done < <(find "$CACHE_DIR/skills" "$CACHE_DIR/templates" "$CACHE_DIR/prompts" -name '*.md' -print0 2>/dev/null)
```
to:
```bash
  done < <(find "$CACHE_DIR/skills" "$CACHE_DIR/agents" -name '*.md' -print0 2>/dev/null)
```

**Step 3: Update category detection in parser**

At ~lines 156-161, update the arrays to include agent-specific fields:
```bash
declare -a ITEM_CATEGORY=()   # skills | agents
declare -a ITEM_NAME=()
declare -a ITEM_SLUG=()
declare -a ITEM_DESC=()
declare -a ITEM_GROUP=()
declare -a ITEM_PATH=()
declare -a ITEM_REQ_SKILLS=()  # comma-separated list of required skill slugs (agents only)
declare -a ITEM_REQ_AGENTS=()  # comma-separated list of required agent slugs (agents only)
```

At ~lines 167-176, change the category detection:
```bash
  if echo "$line" | grep -q '"skills"'; then
    current_category="skills"
    continue
  elif echo "$line" | grep -q '"agents"'; then
    current_category="agents"
    continue
  fi
```

After the field extraction (~line 186), add parsing for requires fields:
```bash
  # Parse requires for agents
  local_req_skills=""
  local_req_agents=""
  if [ "$current_category" = "agents" ]; then
    # Extract skills array from requires
    local_req_skills="$(echo "$line" | sed -n 's/.*"skills":[[:space:]]*\[\([^]]*\)\].*/\1/p' | sed 's/"//g' | sed 's/[[:space:]]//g')"
    # Extract agents array from requires
    local_req_agents="$(echo "$line" | sed -n 's/.*"agents":[[:space:]]*\[\([^]]*\)\].*/\1/p' | sed 's/"//g' | sed 's/[[:space:]]//g')"
  fi
  ITEM_REQ_SKILLS+=("$local_req_skills")
  ITEM_REQ_AGENTS+=("$local_req_agents")
```

**Step 4: Update installation detection to handle agents**

In the detection loop (~lines 209-228), update the `skills` case to also handle `agents`:
```bash
    skills|agents)
      if [ -L "$SKILLS_DIR/$slug" ] || [ -d "$SKILLS_DIR/$slug" ]; then
        ITEM_STATUS+=("installed")
      else
        ITEM_STATUS+=("not_installed")
      fi
      ;;
```

Remove the `templates` and `prompts` cases entirely.

**Step 5: Add dependency resolution function**

Before Step 6 (Select assets, ~line 237), add a dependency resolution function:

```bash
# ── Dependency Resolution ──────────────────────────────────────────────────
# Given an agent index, resolve all required skills and agents recursively
# Populates dep_indices array with indices of all dependencies
declare -a dep_indices=()
declare -a visited_deps=()

resolve_deps() {
  local idx="$1"
  local slug="${ITEM_SLUG[$idx]}"

  # Circular dependency guard
  for v in "${visited_deps[@]}"; do
    [ "$v" = "$slug" ] && return
  done
  visited_deps+=("$slug")

  # Resolve required skills
  if [ -n "${ITEM_REQ_SKILLS[$idx]}" ]; then
    IFS=',' read -ra req_skills <<< "${ITEM_REQ_SKILLS[$idx]}"
    for req in "${req_skills[@]}"; do
      req="$(echo "$req" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')"
      [ -z "$req" ] && continue
      # Find the skill index
      for j in $(seq 0 $((total - 1))); do
        if [ "${ITEM_SLUG[$j]}" = "$req" ] && [ "${ITEM_CATEGORY[$j]}" = "skills" ]; then
          dep_indices+=("$j")
          break
        fi
      done
    done
  fi

  # Resolve required agents (recursive)
  if [ -n "${ITEM_REQ_AGENTS[$idx]}" ]; then
    IFS=',' read -ra req_agents <<< "${ITEM_REQ_AGENTS[$idx]}"
    for req in "${req_agents[@]}"; do
      req="$(echo "$req" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')"
      [ -z "$req" ] && continue
      # Find the agent index and recurse
      for j in $(seq 0 $((total - 1))); do
        if [ "${ITEM_SLUG[$j]}" = "$req" ] && [ "${ITEM_CATEGORY[$j]}" = "agents" ]; then
          dep_indices+=("$j")
          resolve_deps "$j"
          break
        fi
      done
    done
  fi
}
```

**Step 6: Update install menu labels**

In the gum install menu (~line 377-381), change the category labels:
```bash
      case "${ITEM_CATEGORY[$i]}" in
        skills)    cat_label="skill " ;;
        agents)    cat_label="agent " ;;
        *)         cat_label="${ITEM_CATEGORY[$i]}" ;;
      esac
```

In the bash install menu (~lines 425-431), update the header logic to separate agents and skills:
```bash
      if [ "$cat_raw" = "agents" ]; then
        header="Agents"
      else
        grp_label="$(echo "$grp" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')"
        header="Skills › ${grp_label}"
      fi
```

**Step 7: Add dependency resolution after selection**

After the install_indices array is populated (~line 478), add dependency resolution:

```bash
# ── Resolve dependencies for selected agents ──
declare -a final_indices=()
for idx in "${install_indices[@]}"; do
  final_indices+=("$idx")
  if [ "${ITEM_CATEGORY[$idx]}" = "agents" ]; then
    dep_indices=()
    visited_deps=()
    resolve_deps "$idx"
    for dep_idx in "${dep_indices[@]}"; do
      # Add if not already selected and not already installed
      local already=0
      for existing in "${final_indices[@]}"; do
        [ "$existing" = "$dep_idx" ] && already=1 && break
      done
      if [ "$already" -eq 0 ] && [ "${ITEM_STATUS[$dep_idx]}" != "installed" ]; then
        final_indices+=("$dep_idx")
      fi
    done
  fi
done

# Show dependency summary if any deps were added
dep_count=$(( ${#final_indices[@]} - ${#install_indices[@]} ))
if [ "$dep_count" -gt 0 ]; then
  echo ""
  info "Resolving dependencies: $dep_count additional item(s) will be installed"
  for idx in "${final_indices[@]}"; do
    # Check if this was an auto-resolved dependency
    local is_dep=1
    for orig in "${install_indices[@]}"; do
      [ "$orig" = "$idx" ] && is_dep=0 && break
    done
    if [ "$is_dep" -eq 1 ]; then
      printf "    ${GRAY}+ [%s] %s${RESET}\n" "${ITEM_CATEGORY[$idx]}" "${ITEM_SLUG[$idx]}"
    fi
  done
  echo ""
fi
install_indices=("${final_indices[@]}")
```

**Step 8: Update installation logic**

In the install loop (~lines 514-613), replace the `templates` and `prompts` cases. The `skills` case now also handles `agents`:

```bash
    skills|agents)
      skill_src_dir="$(dirname "$src")"
      target_link="$SKILLS_DIR/$slug"
      mkdir -p "$SKILLS_DIR"

      if [ -L "$target_link" ]; then
        rm "$target_link"
      elif [ -d "$target_link" ]; then
        summary+=("$(printf "${YELLOW}–${RESET}  %-12s  %-28s  skipped (dir exists)" "[$cat]" "$slug")")
        continue
      fi

      ln -s "$skill_src_dir" "$target_link"
      if [ "$is_update" = "yes" ]; then
        summary+=("$(printf "${GREEN}↻${RESET}  %-12s  %-28s  updated → %s" "[$cat]" "$slug" "$target_link")")
      else
        summary+=("$(printf "${GREEN}✓${RESET}  %-12s  %-28s  → %s" "[$cat]" "$slug" "$target_link")")
      fi
      ;;
```

Remove the `templates)` and `prompts)` cases entirely.

**Step 9: Update removal to handle agents**

In the remove section (~lines 494-506), update `[skill]` labels to use `[$cat]`:
```bash
    skills|agents)
      target_link="$SKILLS_DIR/$slug"
      if [ -L "$target_link" ]; then
        rm "$target_link"
        summary+=("$(printf "${RED}✗${RESET}  %-12s  %-28s  removed" "[$cat]" "$slug")")
      elif [ -d "$target_link" ]; then
        warn "$slug is a directory (not a symlink) -- skipping removal"
        summary+=("$(printf "${YELLOW}–${RESET}  %-12s  %-28s  skipped (not a symlink)" "[$cat]" "$slug")")
      else
        summary+=("$(printf "${YELLOW}–${RESET}  %-12s  %-28s  not found" "[$cat]" "$slug")")
      fi
      ;;
```

**Step 10: Commit**

```bash
git add install.sh && git commit -m "feat: update install.sh for agents with dependency resolution

Add agents as installable category, resolve skill/agent dependencies
recursively when installing agents, remove templates/prompts logic.
Update banner to 'Assemble Your Team'."
```

---

### Task 15: Update CLAUDE.md and README.md

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`

**Step 1: Update CLAUDE.md**

Replace the contents of `CLAUDE.md` with:

```markdown
# Claude Playground

Opinionated agent personas and skills for Claude Code. Agents orchestrate skills into end-to-end workflows.

## Structure

- `agents/<name>/AGENT.md` — Agent personas (orchestration-level workflows)
- `skills/<group>/<name>/SKILL.md` — Skills (building-block workflows)
- `scripts/build-catalog.sh` — Generates catalog.json from frontmatter
- `install.sh` — Interactive installer with dependency resolution
- `web/` — Next.js webapp for browsing the catalog

## Adding Assets

1. Create a directory with an `AGENT.md` or `SKILL.md` file
2. Add YAML frontmatter with `name`, `description`, and `tags`
3. For agents, add `requires` (skills/agents) and `features` fields
4. Run `bash scripts/build-catalog.sh` to regenerate the catalog

## Frontmatter Format

### Skills
```yaml
---
name: skill-name
description: One-line description
tags: [tag1, tag2]
---
```

### Agents
```yaml
---
name: Agent Name
description: One-line description
tags: [tag1, tag2]
requires:
  skills: [skill-slug-1, skill-slug-2]
  agents: [agent-slug]
features: [worktrees, subagents]
---
```
```

**Step 2: Update README.md**

Replace the contents of `README.md` with:

```markdown
# Claude Playground

Assemble your team. Opinionated agent personas for Claude Code that orchestrate skills into powerful end-to-end workflows.

## Quick Install

```bash
curl -fsSL claude.sporich.dev/install.sh | bash
```

The installer resolves dependencies automatically — installing an agent pulls in all required skills.

## Agents

| Agent | Description | Requires |
|-------|-------------|----------|
| **Ironclad** | The engineer — builds features from blueprint to production | planning, tdd, feature-implementation, code-review + aegis |
| **Deadeye** | The sharpshooter — hunts bugs with hypothesis-driven precision | bug-diagnosis, tdd, code-review |
| **Aegis** | The shield — multi-layered code review on all fronts | code-review |
| **Oracle** | The all-seeing — maps codebases and reveals architecture | — |
| **Lorekeeper** | The chronicler — documents APIs, architecture, and tribal knowledge | documentation |
| **Titan** | The powerhouse — optimizes performance and eliminates bottlenecks | optimization, code-review |

## Skills

| Skill | Description | Used By |
|-------|-------------|---------|
| `planning` | Requirements gathering and design | Ironclad |
| `tdd` | Test-driven development (red-green-refactor) | Ironclad, Deadeye |
| `feature-implementation` | Phased feature build with TDD | Ironclad |
| `bug-diagnosis` | Hypothesis-driven debugging | Deadeye |
| `code-review` | Structured review with severity ratings | Ironclad, Deadeye, Aegis, Titan |
| `documentation` | Structured documentation generation | Lorekeeper |
| `optimization` | Performance profiling and benchmarking | Titan |

## How It Works

1. Each asset is a Markdown file with **YAML frontmatter** (`name`, `description`, `tags`, and `requires` for agents).
2. `build-catalog.sh` scans all asset directories and generates `catalog.json` with computed `used_by` mappings.
3. `install.sh` presents an interactive picker, resolves agent dependencies, and symlinks assets into `~/.claude/skills/`.

## License

MIT
```

**Step 3: Commit**

```bash
git add CLAUDE.md README.md && git commit -m "docs: update CLAUDE.md and README.md for agents

Reflect new project focus on agents and skills.
Update structure docs, asset tables, and install instructions."
```

---

### Task 16: Clean up .claude/skills symlinks and verify

**Step 1: Remove stale symlinks in .claude/skills**

The `.claude/skills/` directory in the repo has symlinks to old skills. Clean them up:

```bash
rm -rf .claude/skills/code-review .claude/skills/pr-description .claude/skills/feature-implementation .claude/skills/bug-diagnosis 2>/dev/null || true
```

**Step 2: Run build-catalog.sh and verify output**

```bash
bash scripts/build-catalog.sh
```

Expected: 13 entries (7 skills + 6 agents).

**Step 3: Verify catalog.json content**

```bash
cat catalog.json
```

Verify:
- 7 skills with correct `used_by` arrays
- 6 agents with correct `requires` and `features` fields
- No templates or prompts sections

**Step 4: Verify the full directory structure**

```bash
find agents/ skills/ -name '*.md' | sort
```

Expected:
```
agents/aegis/AGENT.md
agents/deadeye/AGENT.md
agents/ironclad/AGENT.md
agents/lorekeeper/AGENT.md
agents/oracle/AGENT.md
agents/titan/AGENT.md
skills/general/bug-diagnosis/SKILL.md
skills/general/code-review/SKILL.md
skills/general/documentation/SKILL.md
skills/general/feature-implementation/SKILL.md
skills/general/optimization/SKILL.md
skills/general/planning/SKILL.md
skills/general/tdd/SKILL.md
```

**Step 5: Commit any remaining changes**

```bash
git add -A && git status
```

If there are changes:

```bash
git commit -m "chore: clean up stale symlinks and regenerate catalog

Remove old .claude/skills symlinks and rebuild catalog.json
with agents and updated skills."
```

---

Plan complete and saved to `docs/plans/2026-02-22-agents-implementation.md`. Two execution options:

**1. Subagent-Driven (this session)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** — Open new session with executing-plans, batch execution with checkpoints

Which approach?
