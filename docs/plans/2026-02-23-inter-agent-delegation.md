# Inter-Agent Delegation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable agents to delegate code review to Aegis, suggest Titan for optimization, and offer Lorekeeper/Oracle handoffs — all with graceful fallbacks.

**Architecture:** Add a `suggests.agents` frontmatter field for soft dependencies. Update agent workflow prose to delegate to teammates with "if not installed, fall back to skill" patterns. Update build-catalog.sh to parse and surface the new field.

**Tech Stack:** Markdown (AGENT.md files), Bash (build-catalog.sh), YAML frontmatter

---

### Task 1: Update Deadeye — Delegate Review to Aegis + Suggest Titan

**Files:**
- Modify: `agents/deadeye/AGENT.md`

**Step 1: Add `suggests` to frontmatter**

Change the frontmatter from:
```yaml
---
name: Deadeye
description: The sharpshooter — hunts bugs with hypothesis-driven precision
tags: [debugging, tdd, orchestration]
requires:
  skills: [bug-diagnosis, tdd, code-review]
features: [worktrees, subagents]
---
```

To:
```yaml
---
name: Deadeye
description: The sharpshooter — hunts bugs with hypothesis-driven precision
tags: [debugging, tdd, orchestration]
requires:
  skills: [bug-diagnosis, tdd, code-review]
suggests:
  agents: [aegis, titan, oracle]
features: [worktrees, subagents]
---
```

**Step 2: Replace Phase 5 (Review) with Aegis delegation**

Replace the current Phase 5 content:
```markdown
## Phase 5: Review

Self-review using the **code-review** skill.

- Review your own diff as if reviewing someone else's code
- Focus on: did you fix the root cause (not just the symptom)? Any regressions? Test quality?
- For fixes touching critical paths, request external review
```

With:
```markdown
## Phase 5: Review

Invoke the **aegis** agent for multi-dimensional code review.

- Aegis spawns parallel review subagents for security, performance, and correctness
- Focus review attention on: did you fix the root cause (not just the symptom)? Any regressions? Test quality?
- Address all critical findings before proceeding

If Aegis is not installed, fall back to the **code-review** skill for a single-pass review.
```

**Step 3: Add teammate suggestions to Phase 6 (Ship)**

After the existing Phase 6 content (line 88), before the `---` separator, add:

```markdown
3. Suggest follow-up actions:
   - **Titan** — "Bug fixed. Run Titan to check for performance implications?"
   - **Oracle** — If the fix touched unfamiliar code areas, suggest Oracle for a broader codebase understanding pass
```

**Step 4: Commit**

```bash
git add agents/deadeye/AGENT.md
git commit -m "feat(deadeye): delegate review to aegis, suggest titan/oracle handoffs"
```

---

### Task 2: Update Titan — Delegate Review to Aegis + Suggest Oracle

**Files:**
- Modify: `agents/titan/AGENT.md`

**Step 1: Add `suggests` to frontmatter**

Change the frontmatter from:
```yaml
---
name: Titan
description: The powerhouse — optimizes performance and eliminates bottlenecks
tags: [performance, optimization, orchestration]
requires:
  skills: [optimization, code-review]
features: [worktrees, subagents]
---
```

To:
```yaml
---
name: Titan
description: The powerhouse — optimizes performance and eliminates bottlenecks
tags: [performance, optimization, orchestration]
requires:
  skills: [optimization, code-review]
suggests:
  agents: [aegis, oracle]
features: [worktrees, subagents]
---
```

**Step 2: Replace Phase 7 review section with Aegis delegation**

Replace the current Phase 7 content:
```markdown
## Phase 7: Review & Ship

1. Self-review using the **code-review** skill — focus on readability trade-offs
2. Write a PR description that includes:
   - What was optimized and why
   - Before/after benchmark numbers
   - The approach taken
   - Any trade-offs made (e.g., memory for speed)
3. Push and create the PR from the worktree
```

With:
```markdown
## Phase 7: Review & Ship

1. Invoke the **aegis** agent for multi-dimensional code review — pay special attention to readability trade-offs from optimization changes. If Aegis is not installed, fall back to the **code-review** skill for a single-pass review.
2. Address all critical findings before proceeding
3. Write a PR description that includes:
   - What was optimized and why
   - Before/after benchmark numbers
   - The approach taken
   - Any trade-offs made (e.g., memory for speed)
4. Push and create the PR from the worktree
```

**Step 3: Add Oracle suggestion to Phase 1**

After line 30 (`4. Use the `Explore` subagent if you need to trace execution paths through unfamiliar code`), add:

```markdown
5. If the codebase is unfamiliar, consider invoking the **oracle** agent for a full architecture mapping before profiling
```

**Step 4: Commit**

```bash
git add agents/titan/AGENT.md
git commit -m "feat(titan): delegate review to aegis, suggest oracle for exploration"
```

---

### Task 3: Update Ironclad — Soften Aegis Dependency + Add Titan/Lorekeeper/Oracle Suggestions

**Files:**
- Modify: `agents/ironclad/AGENT.md`

**Step 1: Move aegis from requires to suggests, add other agents**

Change the frontmatter from:
```yaml
---
name: Ironclad
description: The engineer — builds features from blueprint to production
tags: [feature, tdd, orchestration]
requires:
  skills: [planning, architecture, tdd, feature-implementation, code-review]
  agents: [aegis]
features: [worktrees, subagents]
---
```

To:
```yaml
---
name: Ironclad
description: The engineer — builds features from blueprint to production
tags: [feature, tdd, orchestration]
requires:
  skills: [planning, architecture, tdd, feature-implementation, code-review]
suggests:
  agents: [aegis, titan, lorekeeper, oracle]
features: [worktrees, subagents]
---
```

**Step 2: Add teammate suggestions to Phase 6 (Ship)**

Replace the current Phase 6 content:
```markdown
## Phase 6: Ship

Create a PR from the worktree branch.

1. Clean up commit history if needed
2. Write a PR description summarizing: what was built, how it works, how to test it
3. Push the branch and create the PR
```

With:
```markdown
## Phase 6: Ship

Create a PR from the worktree branch.

1. Clean up commit history if needed
2. Write a PR description summarizing: what was built, how it works, how to test it
3. Push the branch and create the PR
4. Suggest follow-up actions:
   - **Titan** — "Feature complete. Run Titan for a performance optimization pass?"
   - **Lorekeeper** — "Run Lorekeeper to update documentation for the new feature?"
```

**Step 3: Add Oracle suggestion to Phase 3 (Architect)**

After the existing architect phase bullet points, before "**When to skip:**", add:

```markdown
- If the codebase is unfamiliar, consider invoking the **oracle** agent for a full architecture mapping before designing
```

**Step 4: Commit**

```bash
git add agents/ironclad/AGENT.md
git commit -m "feat(ironclad): soften aegis dep, add titan/lorekeeper/oracle suggestions"
```

---

### Task 4: Update Aegis — Suggest Titan for Performance Issues

**Files:**
- Modify: `agents/aegis/AGENT.md`

**Step 1: Add `suggests` to frontmatter**

Change the frontmatter from:
```yaml
---
name: Aegis
description: The shield — multi-layered code review protecting quality on all fronts
tags: [review, security, orchestration]
requires:
  skills: [code-review]
features: [subagents]
---
```

To:
```yaml
---
name: Aegis
description: The shield — multi-layered code review protecting quality on all fronts
tags: [review, security, orchestration]
requires:
  skills: [code-review]
suggests:
  agents: [titan]
features: [subagents]
---
```

**Step 2: Add Titan suggestion to Phase 4 (Report)**

After the report template's `### Summary` section and the merge-readiness statement (line 98), add:

```markdown
If performance findings are present at warning level or above, include in the summary: "Performance concerns detected — consider running **Titan** for a dedicated optimization pass."
```

**Step 3: Commit**

```bash
git add agents/aegis/AGENT.md
git commit -m "feat(aegis): suggest titan when performance issues found"
```

---

### Task 5: Update build-catalog.sh — Parse `suggests` Field

**Files:**
- Modify: `scripts/build-catalog.sh`

**Step 1: Add suggests parsing to `process_agent` function**

After the `req_agents_raw` / `req_agents_json` parsing block (around line 108), add parsing for `suggests.agents`:

```bash
  # Parse suggests.agents from indented YAML
  local sug_agents_raw
  sug_agents_raw="$(echo "$frontmatter" | awk '/^suggests:/{found=1; next} found && /^  agents:/{print; next} found && /^[^ ]/{exit}' | sed 's/^  agents:[[:space:]]*//')"
  local sug_agents_json
  sug_agents_json="$(parse_array "$sug_agents_raw")"
```

**Step 2: Add suggests to the JSON entry**

Change the `entry` line in `process_agent` from:
```bash
  entry="    {\"name\": \"$name\", \"slug\": \"$slug\", \"description\": \"$description\", \"tags\": $tags_json, \"path\": \"$relpath\", \"requires\": {\"skills\": $req_skills_json, \"agents\": $req_agents_json}, \"features\": $features_json}"
```

To:
```bash
  entry="    {\"name\": \"$name\", \"slug\": \"$slug\", \"description\": \"$description\", \"tags\": $tags_json, \"path\": \"$relpath\", \"requires\": {\"skills\": $req_skills_json, \"agents\": $req_agents_json}, \"suggests\": {\"agents\": $sug_agents_json}, \"features\": $features_json}"
```

**Step 3: Run the build script to verify**

```bash
bash scripts/build-catalog.sh
```

Expected: `catalog.json generated at ...` with no errors. Verify the output contains `"suggests"` fields.

**Step 4: Commit**

```bash
git add scripts/build-catalog.sh catalog.json
git commit -m "feat(catalog): parse and surface suggests.agents field"
```

---

### Task 6: Update CLAUDE.md — Document `suggests` in Frontmatter Format

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add suggests to the agent frontmatter example**

Change the Agents frontmatter example from:
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

To:
```yaml
---
name: Agent Name
description: One-line description
tags: [tag1, tag2]
requires:
  skills: [skill-slug-1, skill-slug-2]
  agents: [agent-slug]
suggests:
  agents: [agent-slug-1, agent-slug-2]
features: [worktrees, subagents]
---
```

**Step 2: Add a note explaining suggests vs requires**

After the frontmatter example, add:

```markdown
- `requires` — hard dependencies pulled in by the installer
- `suggests` — soft dependencies; the agent offers handoffs but works without them
```

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document suggests field in frontmatter format"
```

---

### Task 7: Final Verification

**Step 1: Run build-catalog.sh and verify output**

```bash
bash scripts/build-catalog.sh
```

**Step 2: Inspect catalog.json for correct suggests fields**

Verify each agent has the expected `suggests.agents` array:
- Ironclad: `["aegis", "titan", "lorekeeper", "oracle"]`
- Deadeye: `["aegis", "titan", "oracle"]`
- Titan: `["aegis", "oracle"]`
- Aegis: `["titan"]`
- Lorekeeper: `[]`
- Oracle: `[]`

**Step 3: Verify Ironclad no longer hard-requires aegis**

Check that Ironclad's `requires.agents` is `[]` (empty), not `["aegis"]`.

**Step 4: Commit catalog if needed**

```bash
git add catalog.json
git commit -m "chore: regenerate catalog with suggests fields"
```
