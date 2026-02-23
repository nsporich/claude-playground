# Installer Output Polish Design

**Date:** 2026-02-23
**Goal:** Polish the installer's terminal output for clarity and visual consistency across its three phases.

## Problem

The current installer output has a few rough edges: the roster shows long descriptions instead of short codenames, the deployment summary is a flat 15-item list, and skills are invisible until after install. These make the output feel verbose and hard to scan.

## Design

### Phase 1: Pre-install Roster

Show agents with codenames (text before the em dash) instead of full descriptions. Add a skills count to the summary line.

```
  ASSEMBLING YOUR TEAM
  ──────────────────────────────────────────────
  ★  Director       The commander          + deploy
  +  Ironclad       The engineer            + deploy
  +  Deadeye        The sharpshooter        + deploy
  +  Aegis          The shield              + deploy
  +  Titan          The powerhouse          + deploy
  +  Lorekeeper     The chronicler          + deploy
  +  Oracle         The all-seeing          + deploy
  ──────────────────────────────────────────────
  7 agents · 8 skills • 7 new deployments
```

Changes:
- Fix sed to extract codename before em dash (`s/ — .*//`) instead of after (`s/.*— //`)
- Add `N agents · M skills` to the summary line before the deployment count

### Phase 2: Confirmation + Install

No changes. Spinners, confirm prompt, and install logic stay the same.

### Phase 3: Deployment Summary

Replace the flat 15-item list with a two-column grouped layout.

```
  DEPLOYMENT COMPLETE
  ──────────────────────────────────────────────
  AGENTS                    SKILLS
  ✓ Director                ✓ architecture
  ✓ Ironclad                ✓ bug-diagnosis
  ✓ Deadeye                 ✓ code-review
  ✓ Aegis                   ✓ documentation
  ✓ Titan                   ✓ feature-implementation
  ✓ Lorekeeper              ✓ optimization
  ✓ Oracle                  ✓ planning
                            ✓ tdd
  ──────────────────────────────────────────────

  Your team is assembled.
  Open Claude Code and type /director to start.
```

Changes:
- Two columns: AGENTS on left, SKILLS on right
- Use ✓ for deployed, ↻ for updated items
- Remove per-item descriptions (just names)

### What Stays Unchanged

- Banner (gum + fallback)
- Spinners (fetching roster, building catalog)
- Confirm prompt style and default-yes behavior
- Uninstall flow
- All-current early exit
- Status labels in roster (✓ current / ↑ update / + deploy)

## Files to Modify

- `install.sh` — fix title extraction, update summary line, rewrite deployment summary
- `web/public/install.sh` — sync copy
