# Claude Playground

A curated collection of reusable Claude Code skills, templates, and prompts.

## Quick Install

```bash
curl -fsSL claude.sporich.dev/install.sh | bash
```

The installer fetches the catalog, presents an interactive picker, and copies selected assets into your project.

## What's Included

### Skills (4)

| Skill | Description |
|-------|-------------|
| `code-review` | Structured code review with severity ratings |
| `pr-description` | Generate well-structured PR descriptions from diff context |
| `angular-upgrade` | Guided Angular version migration |
| `angular-material-styleguide` | Guided creation of a shareable style guide on Angular Material |

### Templates (3)

| Template | Description |
|----------|-------------|
| `general` | Minimal CLAUDE.md starting point for any project |
| `angular` | CLAUDE.md for Angular projects |
| `npm-package` | CLAUDE.md for npm package development |

### Prompts (3)

| Prompt | Description |
|--------|-------------|
| `explain-codebase` | Structured codebase tour prompt |
| `storybook-setup` | Get Storybook running in an existing project |
| `browser-testing-setup` | Set up automated browser testing |

## How It Works

1. Each asset is a Markdown file with **YAML frontmatter** (`name`, `description`, `tags`).
2. `build-catalog.sh` scans all asset directories and generates `catalog.json`.
3. `install.sh` fetches the catalog from GitHub, presents an interactive picker using `gum` (or a numbered menu fallback), and copies selected files into your project's `.claude/` directory.

## Adding New Assets

1. Create a `.md` file in the appropriate directory:
   - **Skills** -- `skills/<category>/<skill-name>/SKILL.md`
   - **Templates** -- `templates/<name>.md`
   - **Prompts** -- `prompts/<category>/<name>.md`
2. Add YAML frontmatter with `name`, `description`, and `tags`.
3. Run `./build-catalog.sh` to regenerate `catalog.json`.

## Running the Web App Locally

```bash
cd web
npm install
npm run build  # generates catalog.json via prebuild
npm start
```

The app will be available at `http://localhost:3000`.

## License

MIT
