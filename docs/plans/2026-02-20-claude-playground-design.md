# Agents Assemble - Design Document

## Overview

A public GitHub repository serving as a curated collection of reusable Claude Code assets: skills, CLAUDE.md templates, and prompts. Distributed via a curl-able install script with an interactive picker, and browsable through a Next.js webapp.

## Directory Structure

```
agents-assemble/
  install.sh                    # curl-able interactive installer
  catalog.json                  # generated index of all assets
  scripts/
    build-catalog.sh            # reads frontmatter, outputs catalog.json
  skills/
    general/
      code-review/SKILL.md
      pr-description/SKILL.md
    angular/
      angular-upgrade/SKILL.md
      angular-material-styleguide/SKILL.md
  templates/
    general/
      general.md
    angular/
      angular.md
    npm/
      npm-package.md
  prompts/
    general/
      explain-codebase.md
    storybook/
      storybook-setup.md
    testing/
      browser-testing-setup.md
  web/                          # Next.js app
    src/
      app/
        page.tsx                # home - hero + install command
        browse/page.tsx         # filterable catalog
        [category]/[slug]/page.tsx  # asset detail pages
      lib/
        catalog.ts              # reads catalog.json + .md content at build
      components/
        AssetCard.tsx
        InstallCommand.tsx
        MarkdownPreview.tsx
        TagFilter.tsx
```

## Asset Convention

All `.md` assets use YAML frontmatter for discovery:

```yaml
---
name: Human-readable Name
description: One-line description for picker and catalog
tags: [angular, testing]
---
```

Skills follow the Claude Code `SKILL.md` format with existing `name`/`description` fields, plus `tags`.

Assets are organized by category (skills/templates/prompts) then grouped by framework/library (general, angular, npm, storybook, testing, etc.). New groups are added by creating a new subdirectory.

## Catalog Generation

`scripts/build-catalog.sh` walks the directory structure, reads frontmatter from each `.md` file, and outputs `catalog.json`:

```json
{
  "skills": [
    {
      "name": "code-review",
      "description": "Structured code review with severity ratings",
      "tags": ["review"],
      "group": "general",
      "path": "skills/general/code-review/SKILL.md"
    }
  ],
  "templates": [...],
  "prompts": [...]
}
```

This runs as part of `npm run build` in the webapp, and can be run standalone via `bash scripts/build-catalog.sh`.

## Install Script

Runnable via:
```bash
curl -fsSL https://raw.githubusercontent.com/<user>/agents-assemble/main/install.sh | bash
```

Behavior:
1. Clones/pulls the repo to `~/.agents-assemble` as a local cache
2. Reads `catalog.json` (or walks directories as fallback)
3. Presents interactive picker grouped by category and framework:
   ```
   [Skills > General]
     1) code-review        - Structured code review with severity ratings
     2) pr-description     - PR descriptions from diff context
   [Skills > Angular]
     3) angular-upgrade    - Guided Angular version migration
     4) angular-material-styleguide - Angular Material style guide creation
   ```
4. Installs selected assets:
   - Skills -> symlinked to `~/.claude/skills/<name>/`
   - Templates -> copied to current dir as `CLAUDE.md` (with overwrite confirmation)
   - Prompts -> copied to clipboard or saved to specified location

## Webapp

Next.js static site (SSG) built from `catalog.json` and raw `.md` files.

**Pages:**
- **Home** — what this is, install command front and center, quick overview
- **Browse** — filterable grid of all assets, grouped by framework, searchable by tags
- **Detail** (`/[category]/[slug]`) — rendered markdown preview, install instructions, copy buttons
- **Getting Started** — what Claude Code is, how skills/templates/prompts work, how to install

**Build pipeline:** `build-catalog.sh` runs before `next build`. The site reads `catalog.json` and `.md` files at build time via `generateStaticParams`. No runtime backend.

## Starter Content

### Skills (4)

| Name | Group | Description |
|------|-------|-------------|
| `code-review` | general | Structured code review with severity ratings (security, performance, correctness, style) |
| `pr-description` | general | Generate well-structured PR descriptions from diff context |
| `angular-upgrade` | angular | Guided Angular version migration (breaking changes, RxJS, standalone migration, dependency compat) |
| `angular-material-styleguide` | angular | Guided creation of a shareable style guide on Angular Material (tokens, themes, overrides, packaging) |

### Templates (3)

| Name | Group | Description |
|------|-------|-------------|
| `general` | general | Minimal CLAUDE.md starting point for any project |
| `angular` | angular | CLAUDE.md for Angular projects (standalone components, signals, inject, NgRx, structure) |
| `npm-package` | npm | CLAUDE.md for npm package development (exports, bundling, versioning, publishing) |

### Prompts (3)

| Name | Group | Description |
|------|-------|-------------|
| `explain-codebase` | general | Structured codebase tour prompt |
| `storybook-setup` | storybook | Get Storybook running in an existing project (detection, config, first stories, CI) |
| `browser-testing-setup` | testing | Set up automated browser testing (Playwright/Cypress, page objects, CI pipeline) |

## Future Growth

- New frameworks get their own group directory (react/, vue/, python/, etc.)
- `catalog.json` `group` field drives webapp sidebar and installer sections automatically
- Webapp can eventually support user submissions / community contributions
