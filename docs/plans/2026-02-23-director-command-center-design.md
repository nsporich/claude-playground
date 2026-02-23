# Director Command Center Banner Design

**Date:** 2026-02-23
**Goal:** Give the Director agent a prominent full-width banner above the agent grid, establishing visual hierarchy as the "commander" entry point.

## Problem

With 7 agents, the `lg:grid-cols-6` grid wraps Director into a second row, breaking symmetry. Director needs its own featured area that communicates its role as the orchestrator.

## Design

### Layout

Full-width "Command Center" banner above the 6-agent grid inside `HeroRoster.tsx`.

- Director detected by `slug === "director"` and rendered separately
- Remaining 6 agents render in the existing grid (no grid changes needed)

### Banner Structure

Horizontal layout:
- Left: Star icon (existing HeroIcon)
- Center: "DIRECTOR" name, "The Commander" title, one-line description
- Right: "View Dossier" link to `/agents/director`

### Visual Treatment

- Dark navy background (`#1a1a2e`) with light text — inverted from regular cards
- Same comic book border/shadow treatment (3px border, offset box-shadow) in Director's color
- Halftone dot overlay for visual consistency
- Clicking the banner toggles the dossier panel (same as clicking any agent card)

### Responsive

- Desktop: horizontal layout with icon | text | link
- Mobile: stacks vertically — icon above text above link

### Dossier Panel

No changes. When Director is selected, the dossier renders below the grid as usual.

## Files to Modify

- `web/src/components/HeroRoster.tsx` — extract Director, add banner component, filter from grid
