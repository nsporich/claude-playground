# Agents Category Design

## Overview

Add a new top-level asset category — **Agents** — to agents-assemble. Agents are orchestration-level personas that compose skills and Claude Code features (worktrees, subagents) into opinionated end-to-end workflows.

**Tagline:** "Assemble your team."

Agents are the primary product. Skills are the building blocks they orchestrate. Every agent composes skills — no agent contains inlined implementation logic.

## Project Restructure

Templates and prompts are removed. The project focuses exclusively on agents and skills. Niche skills not used by any agent (angular-upgrade, angular-material-styleguide, pr-description) are dropped. They can be revisited later.

## Directory Structure

```
agents/
├── ironclad/AGENT.md
├── deadeye/AGENT.md
├── aegis/AGENT.md
├── oracle/AGENT.md
├── lorekeeper/AGENT.md
└── titan/AGENT.md

skills/
└── general/
    ├── code-review/SKILL.md          (existing, refine)
    ├── feature-implementation/SKILL.md  (existing, refine)
    ├── bug-diagnosis/SKILL.md        (existing, refine)
    ├── planning/SKILL.md             (new)
    ├── tdd/SKILL.md                  (new)
    ├── documentation/SKILL.md        (new)
    └── optimization/SKILL.md         (new)
```

Agents use a flat directory (no group nesting). Skills retain the `general/` group.

## AGENT.md Format

```yaml
---
name: Ironclad
description: The engineer — builds features from blueprint to production
tags: [feature, tdd, orchestration]
requires:
  skills: [planning, tdd, feature-implementation, code-review]
  agents: [aegis]
features: [worktrees, subagents]
---
```

Fields:
- `requires.skills` — skill slugs resolved and auto-installed by the installer
- `requires.agents` — agent slugs resolved recursively by the installer
- `features` — informational; documents Claude Code features used (worktrees, subagents). Not enforced.

Body: markdown orchestration instructions — phases, delegation patterns, when to invoke which skill, when to create worktrees, when to spawn subagents.

## Skills Inventory

| Skill | Slug | Status | Purpose |
|-------|------|--------|---------|
| Code Review | `code-review` | Existing (refine) | Structured review across security, performance, correctness, style |
| Feature Implementation | `feature-implementation` | Existing (refine) | Phased feature build: scope, plan, implement, verify |
| Bug Diagnosis | `bug-diagnosis` | Existing (refine) | Hypothesis-driven debugging: reproduce, isolate, hypothesize, fix |
| Planning | `planning` | New | Requirements gathering, constraint exploration, design decisions |
| TDD | `tdd` | New | Test-driven development: red-green-refactor cycle |
| Documentation | `documentation` | New | Structured documentation generation for codebases, APIs, architecture |
| Optimization | `optimization` | New | Performance profiling, benchmarking, bottleneck elimination |

## Agent Designs

### Ironclad (Feature Development)

**Inspiration:** Iron Man — the engineer who builds.

**Requires:** `planning`, `tdd`, `feature-implementation`, `code-review` skills + `aegis` agent.

**Features:** worktrees, subagents.

**Flow:**
1. Gather requirements using `planning` skill
2. Create worktree for isolation
3. Design architecture using `architecture skill` subagent
4. Implement using `feature-implementation` skill with `tdd` discipline
5. Invoke `aegis` agent for review
6. Create PR from worktree branch

### Deadeye (Bug Hunting)

**Inspiration:** Hawkeye — precision that never misses.

**Requires:** `bug-diagnosis`, `tdd`, `code-review` skills.

**Features:** worktrees, subagents.

**Flow:**
1. Reproduce the bug in current branch
2. Create worktree for the fix
3. Investigate using `bug-diagnosis` skill (hypothesis-driven)
4. Use `Explore` subagent to trace execution paths if needed
5. Write regression test first using `tdd` skill
6. Implement fix
7. Self-review using `code-review` skill
8. Create PR from worktree

### Aegis (Code Review)

**Inspiration:** Captain America — the shield that protects quality.

**Requires:** `code-review` skill.

**Features:** subagents.

**Flow:**
1. Identify changes to review (git diff, PR, or specified files)
2. Spawn parallel subagents for independent review dimensions:
   - `general-purpose` for bugs and logic errors
   - Security analysis pass
   - Performance analysis pass
3. Synthesize findings into structured report with severity ratings
4. Present actionable recommendations

### Oracle (Codebase Onboarding)

**Inspiration:** Vision — the all-seeing.

**Requires:** none.

**Features:** subagents.

**Flow:**
1. Use `Explore` subagent to map repository structure
2. Identify key architectural patterns, entry points, build system
3. Trace critical paths (request handling, data flow)
4. Generate structured overview: tech stack, architecture, key files, conventions, build/test/deploy
5. Answer follow-up questions interactively

### Lorekeeper (Documentation)

**Inspiration:** J.A.R.V.I.S. — the chronicler who captures all knowledge.

**Requires:** `documentation` skill.

**Features:** subagents.

**Flow:**
1. Analyze codebase with `Explore` subagent
2. Identify undocumented or poorly documented areas
3. Invoke `documentation` skill to generate/update docs
4. Follow existing documentation conventions in the project
5. Produce: README updates, API docs, architecture docs, inline comments as appropriate

### Titan (Optimization)

**Inspiration:** Hulk — raw power applied to performance.

**Requires:** `optimization`, `code-review` skills.

**Features:** subagents, worktrees.

**Flow:**
1. Profile and analyze current performance using `optimization` skill
2. Identify bottlenecks and prioritize by impact
3. Create worktree for changes
4. Benchmark before changes
5. Implement optimizations
6. Benchmark after — verify measurable improvement
7. Self-review using `code-review` skill
8. Create PR from worktree with benchmark results

## Agent-Skill Dependency Map

| Agent | Required Skills | Required Agents | Features |
|-------|----------------|-----------------|----------|
| Ironclad | `planning`, `tdd`, `feature-implementation`, `code-review` | `aegis` | worktrees, subagents |
| Deadeye | `bug-diagnosis`, `tdd`, `code-review` | — | worktrees, subagents |
| Aegis | `code-review` | — | subagents |
| Oracle | — | — | subagents |
| Lorekeeper | `documentation` | — | subagents |
| Titan | `optimization`, `code-review` | — | subagents, worktrees |

## Infrastructure Changes

### catalog.json

Two top-level arrays: `"skills"` and `"agents"`. Templates and prompts removed.

Skill entries gain a computed `used_by` array derived from agent `requires` fields (not stored in SKILL.md frontmatter — computed by build-catalog.sh).

```json
{
  "skills": [
    {
      "name": "code-review",
      "slug": "code-review",
      "description": "Structured code review with severity ratings",
      "tags": ["review", "general"],
      "group": "general",
      "path": "skills/general/code-review/SKILL.md",
      "used_by": ["ironclad", "deadeye", "aegis", "titan"]
    }
  ],
  "agents": [
    {
      "name": "Ironclad",
      "slug": "ironclad",
      "description": "The engineer — builds features from blueprint to production",
      "tags": ["feature", "tdd", "orchestration"],
      "path": "agents/ironclad/AGENT.md",
      "requires": {
        "skills": ["planning", "tdd", "feature-implementation", "code-review"],
        "agents": ["aegis"]
      },
      "features": ["worktrees", "subagents"]
    }
  ]
}
```

### build-catalog.sh

- Scan `agents/` directory (flat, no group nesting) and `skills/` directory
- Parse `requires` and `features` from agent frontmatter
- Compute `used_by` for each skill by scanning all agent `requires.skills` fields
- Remove templates and prompts scanning
- Output two categories: `skills` and `agents`

### install.sh

- Two-category picker: "Skills" and "Agents"
- Agent listing shows dependency count (e.g., "Ironclad (4 skills + 1 agent)")
- Dependency resolution when installing agents:
  1. Resolve `requires.skills` and `requires.agents` recursively
  2. Check which dependencies are already installed
  3. Show summary: "Installing Ironclad + 4 skills + 1 agent"
  4. Install dependencies first, then the selected agent
- Circular dependency guard (visited set during recursive resolution)
- Same symlink approach: `~/.claude/skills/<slug>` -> `~/.agents-assemble/agents/<slug>/` (or skills path)
- Remove templates and prompts installation logic

## Design Decisions

1. **Agents install to `~/.claude/skills/`** — Claude Code treats all instruction files the same at runtime. The agent/skill distinction is organizational and distributional, not runtime.

2. **Flat agent directory** — No group nesting. Agents are few and specific; groups add unnecessary hierarchy.

3. **Computed `used_by`** — Single source of truth is agent `requires`. Reverse mapping is derived by build-catalog.sh.

4. **Recursive agent dependencies** — Agents can depend on other agents (ironclad requires aegis). Circular dependency guard prevents infinite loops.

5. **`features` is informational** — Documents which Claude Code features an agent uses but is not enforced. For display and user understanding only.

6. **Every agent orchestrates skills** — No inlined implementation logic in AGENT.md. If a pattern is worth doing, it's worth being a skill.
