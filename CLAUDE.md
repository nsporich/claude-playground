# Agents Assemble

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
