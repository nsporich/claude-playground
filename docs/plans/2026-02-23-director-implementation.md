# Director Agent Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create an orchestrator agent ("Director") that triages natural language requests and deploys the right specialist agent, so users don't need to memorize agent names.

**Architecture:** Director is a new AGENT.md that dynamically discovers installed agents by scanning ~/.claude/skills/, matches user requests to agent descriptions/tags, then invokes the chosen agent. The installer always includes Director. The web catalog shows Director first in the roster.

**Tech Stack:** Markdown (AGENT.md), Bash (install.sh, build-catalog.sh)

---

### Task 1: Create the Director AGENT.md

**Files:**
- Create: `agents/director/AGENT.md`

**Step 1: Create the agent directory and file**

Create `agents/director/AGENT.md` with this exact content:

```markdown
---
name: Director
description: The commander — assembles the right team for any mission
tags: [orchestration, triage, routing]
requires:
  skills: []
suggests:
  agents: [ironclad, deadeye, aegis, titan, lorekeeper, oracle]
features: [subagents]
---

# Director

The commander who assembles the team. Director is the single entry point for users who don't want to memorize agent names. Describe what you need in plain language — Director figures out which agent to deploy.

## Orchestration Flow

` ` `
Assess → Deploy → Debrief
` ` `

---

## Phase 1: Assess the Mission

When the user describes a task, identify the right agent to handle it.

1. Scan `~/.claude/skills/` for directories containing `AGENT.md`
2. Read each agent's YAML frontmatter: `name`, `description`, `tags`
3. Match the user's request against descriptions and tags to find the best-fit agent
4. If the match is ambiguous (multiple agents could handle it), ask the user a clarifying question
5. Announce the deployment: "Deploying **[Agent Name]** — [agent description]."

**Matching guidance:**
- Feature requests, new functionality, building things → **Ironclad** (tags: feature, tdd)
- Bugs, errors, debugging, fixing → **Deadeye** (tags: debugging, tdd)
- Code review, PR review, quality check → **Aegis** (tags: review, security)
- Performance, optimization, speed, memory → **Titan** (tags: performance, optimization)
- Documentation, docs, README, API docs → **Lorekeeper** (tags: documentation)
- Codebase exploration, understanding, onboarding → **Oracle** (tags: exploration, mapping)

This guidance is a fallback. **Always prefer dynamic discovery** — read the actual installed agents' descriptions and tags rather than relying on this static list, since the roster may change.

---

## Phase 2: Deploy

Invoke the chosen agent's skill. The agent takes full control and runs its complete workflow.

1. Invoke the agent by name (e.g., invoke the **ironclad** skill)
2. The agent handles everything from here — planning, worktrees, TDD, review, shipping
3. Director is hands-off during the agent's workflow

**Do not interfere with the agent's workflow.** Each agent is designed to run end-to-end.

---

## Phase 3: Debrief

After the agent completes its mission, offer to continue.

1. Summarize what was accomplished
2. If the previous agent has `suggests.agents` in its frontmatter, surface those as recommendations:
   - "Deadeye recommends a **Titan** performance check. Deploy?"
   - "Ironclad suggests **Lorekeeper** for documentation. Deploy?"
3. Ask: "What's next, commander?"
4. If the user has another task, return to Phase 1

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I know which agent to use without scanning" | Scan anyway. New agents may have been installed since last time. |
| "The user's request is clear enough, skip clarification" | If two agents could handle it, ask. A 5-second question saves a wrong deployment. |
| "I should help the agent with its workflow" | You're the commander, not the operator. Deploy and step back. |
| "The user didn't ask for a follow-up" | Always offer. They may not know what's available. |

## Red Flags

- Guessing agent names without scanning installed agents
- Deploying an agent that isn't installed
- Interfering with an agent's workflow after deployment
- Not offering follow-up actions after mission completion
- Hardcoding agent capabilities instead of reading frontmatter
```

Note: The triple backticks in the flow diagram above are escaped with spaces — remove the spaces when creating the file so they render as a proper code block.

**Step 2: Commit**

```bash
git add agents/director/AGENT.md
git commit -m "feat: add Director orchestrator agent

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Add Director to build-catalog.sh AGENT_ORDER

**Files:**
- Modify: `scripts/build-catalog.sh`

**Step 1: Add director as the first entry in AGENT_ORDER**

Change line 150 from:
```bash
AGENT_ORDER=(ironclad deadeye aegis titan lorekeeper oracle)
```

To:
```bash
AGENT_ORDER=(director ironclad deadeye aegis titan lorekeeper oracle)
```

This ensures Director appears first in the catalog and on the website.

**Step 2: Run the build script**

```bash
bash scripts/build-catalog.sh
```

Expected: `catalog.json generated at ...` with 15 entries (was 14).

**Step 3: Commit**

```bash
git add scripts/build-catalog.sh catalog.json
git commit -m "feat(catalog): add director as first agent in roster order

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Update installer to always include Director

**Files:**
- Modify: `install.sh`

**Step 1: Auto-include Director after selection**

After the selection block (around line 290, after `if [ ${#selected_agents[@]} -eq 0 ]` check), add logic to always include Director. Find the Director index and add it to selected_agents if not already present.

Insert after line 290 (`exit 0` / `fi`):

```bash
# ── Step 6: Always include Director ──────────────────────────────────────────
for i in $(seq 0 $((agent_count - 1))); do
  if [ "${AGENT_SLUG[$i]}" = "director" ]; then
    if ! list_contains "$i" "${selected_agents[@]+"${selected_agents[@]}"}"; then
      selected_agents=("$i" "${selected_agents[@]}")
      info "Director auto-included (orchestrates your team)"
    fi
    break
  fi
done
```

Note: `list_contains` is defined later in the file (line 300). Move this block to after the `list_contains` function definition (after line 307) and before the `resolve_agent` function. Or alternatively, place it after line 353 (after the resolve loop), since by that point `list_contains` is defined. The cleanest placement is right after line 290 but reference the agent slug directly:

Actually, the simplest approach: insert it right before the `# ── Step 7: Resolve dependencies` comment (line 292), but since `list_contains` isn't defined yet at that point, use a simpler check:

```bash
# ── Step 6: Always include Director ──────────────────────────────────────────
for i in $(seq 0 $((agent_count - 1))); do
  if [ "${AGENT_SLUG[$i]}" = "director" ]; then
    already_selected=0
    for sel in "${selected_agents[@]+"${selected_agents[@]}"}"; do
      [ "$sel" = "$i" ] && already_selected=1 && break
    done
    if [ "$already_selected" -eq 0 ]; then
      selected_agents=("$i" "${selected_agents[@]}")
      info "Director auto-included (orchestrates your team)"
    fi
    break
  fi
done
```

Insert this block between the empty-selection check (line 287-290) and the Step 7 comment (line 292).

**Step 2: Commit**

```bash
git add install.sh
git commit -m "feat(installer): always include director agent

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Add Director to HeroRoster on the website

**Files:**
- Modify: `web/src/components/HeroRoster.tsx`

**Step 1: Add Director to HERO_META**

Add a new entry at the beginning of the `HERO_META` object (before ironclad):

```typescript
  director: {
    title: "The Commander",
    role: "Mission Orchestration",
    skillSet: "Deploys the right agent for any mission.",
    flavorText:
      "You don\u2019t need to know every agent\u2019s name. Just tell the Director what you need, and he\u2019ll assemble the team.",
    color: "#1a1a2e",
    colorLight: "#e8e8f0",
    stats: { power: 3, precision: 3, speed: 5, range: 5, teamwork: 5 },
  },
```

**Step 2: Add Director to HeroIcon switch**

Add a new case in the `HeroIcon` function before the `default` case:

```typescript
    case "director":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      );
```

**Step 3: Add Director to hero-colors.ts**

Add a new entry in the `HERO_COLORS` record in `web/src/lib/hero-colors.ts`:

```typescript
  director: {
    color: "#1a1a2e",
    text: "#1a1a2e",
    bg: "rgba(26, 26, 46, 0.12)",
    light: "#e8e8f0",
  },
```

**Step 4: Build and verify**

```bash
cd web && npx next build
```

Expected: Clean build, 15+ pages generated (now includes /agents/director).

**Step 5: Commit**

```bash
git add web/src/components/HeroRoster.tsx web/src/lib/hero-colors.ts
git commit -m "feat(web): add Director to hero roster and color system

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: Update CLAUDE.md and rebuild catalog

**Files:**
- Modify: `CLAUDE.md` (no changes needed — Director follows existing frontmatter format)
- Regenerate: `catalog.json`

**Step 1: Final catalog rebuild**

```bash
bash scripts/build-catalog.sh
```

Verify Director appears first in agents array with:
- `suggests.agents: ["ironclad", "deadeye", "aegis", "titan", "lorekeeper", "oracle"]`
- `requires.skills: []`
- `requires.agents: []`

**Step 2: Commit if catalog changed**

```bash
git add catalog.json
git commit -m "chore: regenerate catalog with director agent

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
