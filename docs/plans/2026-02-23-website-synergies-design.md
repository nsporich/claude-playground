# Website Team Synergies Design

**Date:** 2026-02-23
**Goal:** Display agent team synergies (suggests.agents) on dossier pages.

## Problem

The `suggests.agents` field is in catalog.json but not displayed in the web app. Users can't see which agents collaborate.

## Design

### New "Team Synergies" Section on Dossier Pages

Add a section between Dependencies and Capabilities on agent detail pages:

```
DEPENDENCIES (existing)
TEAM SYNERGIES (new)
CAPABILITIES (existing)
```

- Header: "TEAM SYNERGIES" with subtitle "Calls on these teammates:"
- Content: Hero-colored pill links for each suggested agent (same style as requires.agents links)
- Only renders when agent has suggested teammates
- Links to each agent's dossier page

### Files to Change

1. `web/src/lib/types.ts` — Add `suggests` to CatalogAsset interface
2. `web/src/app/[category]/[slug]/page.tsx` — Add Team Synergies section

### What Doesn't Change

- AssetCard, browse page, catalog loading, build script — all unchanged
