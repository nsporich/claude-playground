# Claude Playground Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a public repo of reusable Claude Code assets with a catalog build script, interactive installer, and Next.js browse/docs webapp.

**Architecture:** Convention-based asset discovery using YAML frontmatter in markdown files, organized by category (skills/templates/prompts) and group (angular/general/etc). A bash script generates `catalog.json` from frontmatter. A Next.js SSG webapp renders the catalog. A curl-able install script provides CLI installation.

**Tech Stack:** Bash, Node.js 25, Next.js (App Router), TypeScript, Tailwind CSS, gray-matter (frontmatter parsing)

---

## Phase 1: Repository Skeleton + Starter Content

### Task 1: Create directory structure and root files

**Files:**
- Create: `skills/general/.gitkeep` (removed after content added)
- Create: `skills/angular/.gitkeep`
- Create: `templates/general/.gitkeep`
- Create: `templates/angular/.gitkeep`
- Create: `templates/npm/.gitkeep`
- Create: `prompts/general/.gitkeep`
- Create: `prompts/storybook/.gitkeep`
- Create: `prompts/testing/.gitkeep`
- Create: `scripts/.gitkeep`
- Create: `.gitignore`
- Create: `CLAUDE.md`

**Step 1: Create all directories**

```bash
mkdir -p skills/general skills/angular templates/general templates/angular templates/npm prompts/general prompts/storybook prompts/testing scripts web
```

**Step 2: Create .gitignore**

```gitignore
node_modules/
.next/
catalog.json
.DS_Store
*.log
```

Note: `catalog.json` is gitignored because it's a generated artifact.

**Step 3: Create root CLAUDE.md**

```markdown
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
```

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold directory structure and root files"
```

---

### Task 2: Write starter skills

**Files:**
- Create: `skills/general/code-review/SKILL.md`
- Create: `skills/general/pr-description/SKILL.md`
- Create: `skills/angular/angular-upgrade/SKILL.md`
- Create: `skills/angular/angular-material-styleguide/SKILL.md`

**Step 1: Create `skills/general/code-review/SKILL.md`**

Write a Claude Code skill that performs structured code reviews. The skill should:
- Read the files under review (from git diff or user-specified paths)
- Evaluate across 4 dimensions: security, performance, correctness, style
- Rate each finding with severity (critical/warning/info)
- Output a structured review with actionable suggestions
- Follow the Claude Code SKILL.md frontmatter format with `name`, `description`, and `tags: [review, general]`

**Step 2: Create `skills/general/pr-description/SKILL.md`**

Write a Claude Code skill that generates PR descriptions. The skill should:
- Read the current branch's diff against the base branch
- Summarize changes in a structured format (Summary, Changes, Testing, Breaking Changes)
- Generate a markdown PR body ready to paste
- Follow the Claude Code SKILL.md frontmatter format with `name`, `description`, and `tags: [git, pr, general]`

**Step 3: Create `skills/angular/angular-upgrade/SKILL.md`**

Write a Claude Code skill that guides Angular version upgrades. The skill should:
- Detect current Angular version from package.json
- Reference the Angular Update Guide (https://angular.dev/update-guide)
- Walk through breaking changes version by version
- Handle: RxJS updates, module-to-standalone migration, dependency compat checks
- Provide step-by-step commands and code changes
- Follow the Claude Code SKILL.md frontmatter format with `name`, `description`, and `tags: [angular, migration, upgrade]`

**Step 4: Create `skills/angular/angular-material-styleguide/SKILL.md`**

Write a Claude Code skill for creating Angular Material style guides. The skill should:
- Guide design token definition (colors, typography, spacing, elevation)
- Set up Angular Material custom theme with M3 theming API
- Create component-level style overrides
- Structure as a publishable SCSS package
- Follow the Claude Code SKILL.md frontmatter format with `name`, `description`, and `tags: [angular, material, css, design-system]`

**Step 5: Commit**

```bash
git add skills/
git commit -m "feat: add starter skills (code-review, pr-description, angular-upgrade, angular-material-styleguide)"
```

---

### Task 3: Write starter templates

**Files:**
- Create: `templates/general/general.md`
- Create: `templates/angular/angular.md`
- Create: `templates/npm/npm-package.md`

**Step 1: Create `templates/general/general.md`**

A minimal CLAUDE.md template with frontmatter (`name: General`, `description: Minimal CLAUDE.md starting point for any project`, `tags: [general, starter]`). Content should include sections for:
- Project overview (fill in)
- Tech stack (fill in)
- Project structure (fill in)
- Coding conventions (common defaults: prefer simple, avoid over-engineering, write tests)
- Development commands (fill in: build, test, lint, dev server)

**Step 2: Create `templates/angular/angular.md`**

An Angular-specific CLAUDE.md template with frontmatter (`name: Angular`, `description: CLAUDE.md for Angular projects`, `tags: [angular, frontend]`). Content should include:
- Angular-specific conventions (standalone components, signals over BehaviorSubject, inject() over constructor injection, OnPush change detection)
- Project structure (feature modules, shared module, core module)
- NgRx patterns if applicable (feature stores, effects, selectors)
- Testing patterns (TestBed, component harnesses, spectator)
- Common commands (ng serve, ng test, ng build, ng generate)

**Step 3: Create `templates/npm/npm-package.md`**

An npm package CLAUDE.md template with frontmatter (`name: NPM Package`, `description: CLAUDE.md for npm package development`, `tags: [npm, package, library]`). Content should include:
- Package.json configuration (exports, main, module, types, files)
- Bundling setup (tsup/rollup/unbundled)
- Versioning strategy (semver, changesets or standard-version)
- Publishing workflow (prepublishOnly, npm publish, scoped packages)
- Peer dependency strategy
- Testing approach for library code

**Step 4: Commit**

```bash
git add templates/
git commit -m "feat: add starter templates (general, angular, npm-package)"
```

---

### Task 4: Write starter prompts

**Files:**
- Create: `prompts/general/explain-codebase.md`
- Create: `prompts/storybook/storybook-setup.md`
- Create: `prompts/testing/browser-testing-setup.md`

**Step 1: Create `prompts/general/explain-codebase.md`**

A reusable prompt with frontmatter (`name: Explain Codebase`, `description: Structured codebase tour prompt`, `tags: [general, onboarding]`). The prompt should instruct Claude to:
- Identify the project type, framework, and language
- Map the directory structure and explain each top-level directory
- Identify key entry points (main, index, app module)
- Trace the request/data flow for a typical operation
- List key dependencies and what they're used for
- Highlight any non-obvious patterns or conventions

**Step 2: Create `prompts/storybook/storybook-setup.md`**

A reusable prompt with frontmatter (`name: Storybook Setup`, `description: Get Storybook running in an existing project`, `tags: [storybook, ui, testing]`). The prompt should instruct Claude to:
- Detect the project framework (Angular, React, Vue, etc.)
- Install and configure Storybook for that framework
- Create stories for 2-3 existing components as examples
- Set up essential addons (controls, actions, viewport, a11y)
- Add npm scripts for dev and build
- Optionally configure for CI (chromatic or static build)

**Step 3: Create `prompts/testing/browser-testing-setup.md`**

A reusable prompt with frontmatter (`name: Browser Testing Setup`, `description: Set up automated browser testing`, `tags: [testing, e2e, playwright, cypress]`). The prompt should instruct Claude to:
- Recommend Playwright vs Cypress based on project needs (default to Playwright)
- Install and configure the chosen framework
- Set up page object pattern with a base page class
- Write a smoke test for the app's main flow
- Configure for CI (headless, retries, artifacts)
- Add npm scripts for running locally and in CI

**Step 4: Commit**

```bash
git add prompts/
git commit -m "feat: add starter prompts (explain-codebase, storybook-setup, browser-testing-setup)"
```

---

## Phase 2: Catalog Build Script

### Task 5: Create build-catalog.sh

**Files:**
- Create: `scripts/build-catalog.sh`

**Step 1: Write the catalog build script**

A bash script that:
1. Walks `skills/`, `templates/`, `prompts/` directories
2. For each `.md` file, extracts YAML frontmatter (content between `---` delimiters)
3. Parses `name`, `description`, and `tags` from frontmatter
4. Determines `category` from parent directory (skills/templates/prompts)
5. Determines `group` from subdirectory name (general/angular/etc)
6. For skills, the `slug` is the directory name; for templates/prompts, it's the filename without `.md`
7. Outputs `catalog.json` to the repo root

The script should use only standard unix tools (awk/sed/grep) -- no Node.js or Python dependency for the build script itself.

Output format:
```json
{
  "skills": [
    {"name": "...", "slug": "...", "description": "...", "tags": [...], "group": "...", "path": "..."}
  ],
  "templates": [...],
  "prompts": [...]
}
```

**Step 2: Make executable and test**

```bash
chmod +x scripts/build-catalog.sh
bash scripts/build-catalog.sh
cat catalog.json
```

Verify all 10 starter assets appear with correct metadata.

**Step 3: Commit**

```bash
git add scripts/build-catalog.sh
git commit -m "feat: add catalog build script for frontmatter-based asset discovery"
```

---

## Phase 3: Install Script

### Task 6: Create install.sh

**Files:**
- Create: `install.sh`

**Step 1: Write the interactive installer**

A bash script that:
1. Defines the GitHub repo URL and raw content base URL
2. Checks for `git` availability
3. Clones or pulls the repo to `~/.claude-playground/`
4. Runs `build-catalog.sh` if `catalog.json` doesn't exist
5. Reads `catalog.json` and presents a grouped interactive menu using bash `select` or numbered input
6. For each selected item, installs based on category:
   - **Skills**: Creates symlink from `~/.claude-playground/skills/<group>/<name>` to `~/.claude/skills/<name>`
   - **Templates**: Copies to current working directory as `CLAUDE.md` (prompts before overwriting if exists)
   - **Prompts**: Prints to stdout (pipeable) or copies to a user-specified path
7. Prints summary of what was installed

The menu should look like:
```
Claude Playground Installer

[Skills > General]
  1) code-review                    - Structured code review with severity ratings
  2) pr-description                 - PR descriptions from diff context
[Skills > Angular]
  3) angular-upgrade                - Guided Angular version migration
  4) angular-material-styleguide    - Angular Material style guide creation
[Templates > General]
  5) general                        - Minimal CLAUDE.md starting point
...

Enter numbers to install (space-separated, 'all' for everything, 'q' to quit):
```

**Step 2: Make executable and test locally**

```bash
chmod +x install.sh
bash install.sh
```

Test: select one skill, verify symlink created at `~/.claude/skills/<name>`.

**Step 3: Commit**

```bash
git add install.sh
git commit -m "feat: add interactive install script with grouped asset picker"
```

---

## Phase 4: Next.js Webapp

### Task 7: Initialize Next.js project

**Files:**
- Create: `web/` (via create-next-app)

**Step 1: Scaffold Next.js app**

```bash
cd web
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

Accept defaults. This creates the base Next.js app with TypeScript, Tailwind, ESLint, App Router, and src directory.

**Step 2: Install additional dependencies**

```bash
npm install gray-matter react-markdown remark-gfm rehype-highlight
```

- `gray-matter`: Parse YAML frontmatter from .md files at build time
- `react-markdown`: Render markdown content as React components
- `remark-gfm`: GitHub-flavored markdown support (tables, strikethrough, etc.)
- `rehype-highlight`: Syntax highlighting for code blocks

**Step 3: Clean up boilerplate**

Remove default Next.js content from `src/app/page.tsx`, `src/app/globals.css` (keep Tailwind directives only), and `src/app/layout.tsx` (simplify metadata).

**Step 4: Commit**

```bash
cd ..
git add web/
git commit -m "chore: initialize Next.js webapp with Tailwind and markdown deps"
```

---

### Task 8: Build catalog data layer

**Files:**
- Create: `web/src/lib/catalog.ts`
- Create: `web/src/lib/types.ts`

**Step 1: Create types**

`web/src/lib/types.ts`:
```typescript
export type AssetCategory = "skills" | "templates" | "prompts";

export interface CatalogAsset {
  name: string;
  slug: string;
  description: string;
  tags: string[];
  group: string;
  path: string;
  category: AssetCategory;
}

export interface Catalog {
  skills: CatalogAsset[];
  templates: CatalogAsset[];
  prompts: CatalogAsset[];
}
```

**Step 2: Create catalog reader**

`web/src/lib/catalog.ts`:
- `getCatalog()`: Reads `../catalog.json` (one level up from `web/`), returns typed `Catalog`
- `getAsset(category, slug)`: Returns a single `CatalogAsset` by category and slug
- `getAssetContent(asset)`: Reads the raw `.md` file content from `../<asset.path>`, strips frontmatter, returns markdown body string
- `getAllGroups(category)`: Returns unique group names for a category
- All functions are synchronous file reads (used at build time only)

**Step 3: Commit**

```bash
git add web/src/lib/
git commit -m "feat: add catalog data layer for build-time asset loading"
```

---

### Task 9: Build shared components

**Files:**
- Create: `web/src/components/AssetCard.tsx`
- Create: `web/src/components/InstallCommand.tsx`
- Create: `web/src/components/MarkdownPreview.tsx`
- Create: `web/src/components/TagFilter.tsx`
- Create: `web/src/components/Header.tsx`
- Create: `web/src/components/Footer.tsx`

**Step 1: Create Header component**

Simple nav bar with: site title ("Claude Playground"), links to Home, Browse, Getting Started. Use Tailwind for styling. Minimal and clean.

**Step 2: Create Footer component**

Simple footer with GitHub link and "Built for the Claude Code community" text.

**Step 3: Create AssetCard component**

Props: `CatalogAsset`. Displays: name, description, group badge, tags as pills, category icon. Links to detail page at `/<category>/<slug>`.

**Step 4: Create InstallCommand component**

Props: `command: string`. Displays a code block with copy-to-clipboard button. Used on home page (full install command) and detail pages (individual asset install hint).

**Step 5: Create MarkdownPreview component**

Props: `content: string`. Renders markdown using `react-markdown` with `remark-gfm` and `rehype-highlight`. Styled with Tailwind prose classes.

**Step 6: Create TagFilter component**

Props: `tags: string[]`, `selected: string[]`, `onToggle: (tag) => void`. Renders tag pills that can be toggled on/off for filtering. Client component.

**Step 7: Commit**

```bash
git add web/src/components/
git commit -m "feat: add shared components (AssetCard, InstallCommand, MarkdownPreview, TagFilter, Header, Footer)"
```

---

### Task 10: Build layout and home page

**Files:**
- Modify: `web/src/app/layout.tsx`
- Modify: `web/src/app/page.tsx`

**Step 1: Update layout**

Add Header and Footer to the root layout. Set metadata (title: "Claude Playground", description). Apply a max-width container with padding.

**Step 2: Build home page**

Static page with:
- Hero section: title, one-line description, `InstallCommand` with the curl install command
- Quick stats: "X skills, Y templates, Z prompts" pulled from catalog at build time
- Featured assets: 3-4 highlighted assets as `AssetCard` components
- Link to Browse page

**Step 3: Run dev server and verify**

```bash
cd web && npm run dev
```

Verify home page renders with install command, stats, and featured cards.

**Step 4: Commit**

```bash
git add web/src/app/layout.tsx web/src/app/page.tsx
git commit -m "feat: build home page with hero, install command, and featured assets"
```

---

### Task 11: Build browse page

**Files:**
- Create: `web/src/app/browse/page.tsx`

**Step 1: Build browse page**

Page that:
- Loads full catalog at build time
- Displays all assets grouped by category (Skills, Templates, Prompts) with group subheadings
- Includes `TagFilter` for narrowing results (client-side filtering)
- Each asset rendered as an `AssetCard`
- Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)

This page needs a client component wrapper for the tag filter state, with the data passed in as props from the server component.

**Step 2: Verify**

Navigate to `/browse`, confirm all 10 starter assets appear grouped correctly, tag filtering works.

**Step 3: Commit**

```bash
git add web/src/app/browse/
git commit -m "feat: build browse page with tag filtering and grouped display"
```

---

### Task 12: Build detail pages

**Files:**
- Create: `web/src/app/[category]/[slug]/page.tsx`

**Step 1: Build detail page with generateStaticParams**

- `generateStaticParams()`: Returns all `{category, slug}` pairs from catalog
- Page component: Loads asset metadata + raw markdown content at build time
- Renders:
  - Asset name as h1
  - Group badge and tags
  - `InstallCommand` with asset-specific install hint (e.g., `curl ... | bash` then select this asset)
  - Full markdown content via `MarkdownPreview`
  - Back link to browse page

**Step 2: Verify**

Navigate to `/skills/code-review`, confirm markdown renders with syntax highlighting.

**Step 3: Commit**

```bash
git add web/src/app/\\[category\\]/
git commit -m "feat: build asset detail pages with markdown rendering and install hints"
```

---

### Task 13: Build getting started page

**Files:**
- Create: `web/src/app/getting-started/page.tsx`

**Step 1: Write getting started content**

Static page with markdown-like content covering:
- What is Claude Code (brief intro)
- What are skills, templates, and prompts (with examples)
- How to install: the curl command
- How to use installed assets (where they end up, how Claude Code finds them)
- How to contribute (add a file, add frontmatter, submit PR)

Use `MarkdownPreview` for the content body, or just Tailwind prose with JSX.

**Step 2: Commit**

```bash
git add web/src/app/getting-started/
git commit -m "feat: add getting started guide page"
```

---

### Task 14: Wire up build pipeline and verify full build

**Files:**
- Modify: `web/package.json`

**Step 1: Add prebuild script**

In `web/package.json`, add to scripts:
```json
"prebuild": "bash ../scripts/build-catalog.sh"
```

This ensures `catalog.json` is generated before Next.js build.

**Step 2: Run full build**

```bash
bash scripts/build-catalog.sh
cd web && npm run build
```

Verify: build succeeds, all static pages generated (check `.next/server/app/` for generated HTML).

**Step 3: Test production build locally**

```bash
npm start
```

Click through: home, browse, each detail page, getting started. Verify everything renders.

**Step 4: Commit**

```bash
git add web/package.json
git commit -m "feat: wire up catalog build into Next.js build pipeline"
```

---

## Phase 5: Final Polish

### Task 15: Add root README and finalize

**Files:**
- Create: `README.md`

**Step 1: Write README**

Include:
- Project name and one-liner
- Quick install command
- What's included (list of current assets)
- Link to webapp (placeholder URL for now)
- How to add new assets (brief)
- How to run the webapp locally
- License (MIT)

**Step 2: Final commit**

```bash
git add README.md
git commit -m "docs: add README with install instructions and asset catalog"
```

---

## Summary

| Phase | Tasks | What's deliverable |
|-------|-------|--------------------|
| 1: Skeleton + Content | 1-4 | Directory structure, 10 starter assets |
| 2: Catalog Build | 5 | `build-catalog.sh` generating `catalog.json` |
| 3: Install Script | 6 | Curl-able interactive installer |
| 4: Webapp | 7-14 | Full Next.js browse/docs site |
| 5: Polish | 15 | README, ready to push |
