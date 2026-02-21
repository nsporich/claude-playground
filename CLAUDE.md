# Claude Playground

A collection of reusable Claude Code skills, CLAUDE.md templates, and prompts.

## Structure

- `skills/<group>/<name>/SKILL.md` — Claude Code skills
- `templates/<group>/<name>.md` — CLAUDE.md project templates
- `prompts/<group>/<name>.md` — Standalone reusable prompts
- `scripts/build-catalog.sh` — Generates catalog.json from frontmatter
- `install.sh` — Interactive installer
- `web/` — Next.js webapp for browsing the catalog

## Adding Assets

1. Create a `.md` file in the appropriate category/group directory
2. Add YAML frontmatter with `name`, `description`, and `tags`
3. Run `bash scripts/build-catalog.sh` to regenerate the catalog
4. For skills, create a directory with a `SKILL.md` file inside

## Frontmatter Format

All assets use YAML frontmatter:

```yaml
---
name: Human-readable Name
description: One-line description
tags: [tag1, tag2]
---
```
