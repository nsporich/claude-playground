# Installer Redesign Design

**Date:** 2026-02-23
**Goal:** Redesign the installer to install all agents and skills by default, removing the selection UI. Rich superhero-themed output.

## Problem

The current installer requires users to pick agents from a list. As the roster grows, this creates decision fatigue. All agents and skills should be installed — the only decision is "yes" or "abort."

## Design

### Core Model

No more agent selection. Every run installs or updates the full roster. A `--uninstall` flag removes everything.

### Install Flow

1. **Git check** — same
2. **Clone or pull** — same, with spinner
3. **Build catalog if needed** — same
4. **Parse catalog** — same
5. **Show banner** — update tagline to "Assembling your team."
6. **Scan installed state** — for each agent and skill, check if symlink exists in `~/.claude/skills/`. Categorize as: `current`, `update`, or `deploy` (new).
7. **Show roster status table:**
   ```
   ASSEMBLING YOUR TEAM
   ────────────────────────────────────────────────
     ★ Director    The Commander       ↑ update
     ✓ Ironclad    The Heavy Hitter    ↑ update
     ✓ Deadeye     The Marksman        ✓ current
     + Aegis       The Sentinel        + deploy
     + Titan       The Colossus        + deploy
     + Lorekeeper  The Archivist       + deploy
     + Oracle      The All-Seeing      + deploy
   ────────────────────────────────────────────────
     2 updates • 5 new deployments
   ```
8. **If all current** — "All agents current — nothing to do." Exit.
9. **Confirm** — "Assemble the team? [Y/n]" (defaults yes)
10. **Install/update** — symlink all agents and skills
11. **Deployment summary** — show what was done, ending with "Your team is assembled. Open Claude Code and type /director to start."

### Uninstall Flow (`--uninstall`)

1. Show currently installed agents/skills
2. Confirm: "Disband the entire team? [y/N]" (defaults NO)
3. Remove all symlinks from `~/.claude/skills/` that point into `~/.agents-assemble/`
4. Remove `~/.agents-assemble/` cache
5. "Team disbanded."

### What Gets Removed

- Entire selection UI (gum multi-select, numbered list, `all` keyword)
- "Always include Director" block (everything installs)
- Deployment plan preview (replaced by roster status table)

### What Stays

- Banner, spinners, colors, gum detection
- Catalog parsing
- Dependency resolution (still needed to collect all required skills)
- Symlink install logic
- TTY input handling

## Files to Modify

- `install.sh` — full rewrite of Steps 5-10
- `web/src/app/getting-started/page.tsx` — update Deployment Sequence to match new flow (Step 2 no longer says "Select your team")
