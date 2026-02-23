# Inter-Agent Delegation Design

**Date:** 2026-02-23
**Goal:** Enable agents to delegate specialized tasks to teammate agents instead of doing everything themselves.

## Problem

Aegis (code review) and Titan (optimization) are purpose-built specialists, but most agents self-handle these tasks using raw skills. Ironclad is the only agent that delegates review to Aegis. Deadeye and Titan self-review. No agent delegates optimization to Titan. Lorekeeper and Oracle are isolated from the team.

## Design

### New Frontmatter Field: `suggests`

Add `suggests.agents` as a soft dependency — agents offer handoffs but work fine without them.

```yaml
suggests:
  agents: [aegis, titan]
```

This is distinct from `requires.agents` (hard dependencies that must be installed). All inter-agent delegation uses `suggests` with graceful fallbacks.

### Ironclad Changes

- Move `aegis` from `requires.agents` to `suggests.agents` (with fallback to code-review skill)
- After shipping, suggest Titan for optimization pass
- After shipping, suggest Lorekeeper for documentation updates
- When exploring unfamiliar code, suggest Oracle
- `suggests: agents: [aegis, titan, lorekeeper, oracle]`

### Deadeye Changes

- Replace self-review with Aegis delegation (fallback to code-review skill)
- After shipping, suggest Titan for performance implications
- When exploring unfamiliar code, suggest Oracle
- `suggests: agents: [aegis, titan, oracle]`

### Titan Changes

- Replace self-review with Aegis delegation (fallback to code-review skill)
- When exploring unfamiliar code, suggest Oracle
- `suggests: agents: [aegis, oracle]`

### Aegis Changes

- When performance issues found, note "Consider running Titan for optimization"
- `suggests: agents: [titan]`

### Lorekeeper & Oracle

- No changes to their workflows (they are delegation targets, not delegators)
- Oracle and Lorekeeper remain independent agents that others call upon

### Build Script & Catalog

- Parse `suggests.agents` from frontmatter (same pattern as `requires.agents`)
- Add `suggests` to catalog.json agent entries
- Compute `suggested_by` inverse mapping on skill entries

### Collaboration Map

```
Ironclad ──suggests──→ Aegis, Titan, Lorekeeper, Oracle
Deadeye  ──suggests──→ Aegis, Titan, Oracle
Titan    ──suggests──→ Aegis, Oracle
Aegis    ──suggests──→ Titan
Lorekeeper (target only)
Oracle     (target only)
```

### Delegation Pattern

Each agent follows the same pattern when delegating:

```
Invoke **[agent]** for [task].
If [agent] is not installed, fall back to the **[skill]** skill.
```

For post-ship suggestions (Titan, Lorekeeper), agents offer the handoff to the user rather than auto-invoking:

```
[Task] complete. Consider running:
- **Titan** for a performance optimization pass
- **Lorekeeper** to update documentation
```
