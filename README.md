# Agents Assemble

Assemble your team. Opinionated agent personas for Claude Code that orchestrate skills into powerful end-to-end workflows.

## Quick Install

```bash
curl -fsSL assemble.sporich.dev/install.sh | bash
```

The installer resolves dependencies automatically — installing an agent pulls in all required skills. The **Director** agent is always included to orchestrate your team.

## Usage

Once installed, invoke Director in any Claude Code session:

```
/director review the auth module for security issues
```

Director figures out which agent to deploy. You can also invoke agents directly by name (e.g., `/ironclad`, `/deadeye`).

## Agents

| Agent | Description | Requires |
|-------|-------------|----------|
| **Director** | The commander — assembles the right team for any mission | — |
| **Ironclad** | The engineer — builds features from blueprint to production | planning, architecture, tdd, feature-implementation, code-review |
| **Deadeye** | The sharpshooter — hunts bugs with hypothesis-driven precision | bug-diagnosis, tdd, code-review |
| **Aegis** | The shield — multi-layered code review on all fronts | code-review |
| **Oracle** | The all-seeing — maps codebases and reveals architecture | — |
| **Lorekeeper** | The chronicler — documents APIs, architecture, and tribal knowledge | documentation |
| **Titan** | The powerhouse — optimizes performance and eliminates bottlenecks | optimization, code-review |

## Skills

| Skill | Description | Used By |
|-------|-------------|---------|
| `planning` | Requirements gathering and design | Ironclad |
| `architecture` | Codebase pattern analysis and implementation blueprints | Ironclad |
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

## Contributing

1. Create a `.md` file in the right directory (`agents/<name>/AGENT.md` or `skills/<group>/<name>/SKILL.md`).
2. Add YAML frontmatter with `name`, `description`, and `tags`. Agents also need `requires` and `features`.
3. Run `bash scripts/build-catalog.sh` to regenerate the catalog.
4. Submit a PR to the [GitHub repo](https://github.com/nsporich/agents-assemble).

## License

MIT
