# Director Command Center Banner Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Give the Director a full-width "Command Center" banner above the agent grid, establishing visual hierarchy as the orchestrator entry point.

**Architecture:** Extract Director from the agent grid into a dedicated banner component rendered above the grid. The banner uses a dark navy inverted color scheme to stand out. The remaining 6 agents fit cleanly in `lg:grid-cols-6`. Clicking the banner toggles the same dossier panel used by all agents.

**Tech Stack:** React (Next.js), Tailwind CSS

---

### Task 1: Add Command Center banner and filter Director from grid

**Files:**
- Modify: `web/src/components/HeroRoster.tsx`

**Step 1: Add the CommandCenterBanner component and update the HeroRoster render**

In `web/src/components/HeroRoster.tsx`, replace the `return` block of the `HeroRoster` component (lines 241-541) with the version below. This:
- Extracts the Director agent from the `agents` array
- Renders a full-width Command Center banner for Director above the grid
- Filters Director out of the regular grid so the 6 remaining agents fit in `lg:grid-cols-6`
- The banner toggles the dossier panel on click (same `handleSelect` behavior)
- Uses dark navy background with light text, halftone dots, and a "View Dossier" link

Replace lines 241-541 (the entire `return (` block through the closing `);`) with:

```tsx
  const directorAgent = agents.find((a) => a.slug === "director");
  const directorMeta = HERO_META["director"];
  const teamAgents = agents.filter((a) => a.slug !== "director");

  return (
    <div>
      {/* Command Center — Director Banner */}
      {directorAgent && directorMeta && (
        <button
          onClick={() => handleSelect("director")}
          className="animate-fade-up w-full mb-6 relative text-left transition-all duration-200 cursor-pointer speed-hover"
          style={{
            border: "3px solid var(--ink)",
            boxShadow:
              selectedSlug === "director"
                ? "6px 6px 0 #e8e8f0"
                : "4px 4px 0 var(--ink)",
            background: directorMeta.color,
            transform:
              selectedSlug === "director"
                ? "translate(-2px, -2px)"
                : undefined,
          }}
        >
          {/* Halftone dot overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(232, 232, 240, 0.08) 1px, transparent 1px)",
              backgroundSize: "6px 6px",
            }}
          />

          <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-5 sm:p-6">
            {/* Icon */}
            <div
              className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center"
              style={{ background: "rgba(232, 232, 240, 0.12)" }}
            >
              <HeroIcon slug="director" color="#e8e8f0" />
            </div>

            {/* Text */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl tracking-wider text-[#e8e8f0]">
                  DIRECTOR
                </h3>
                <span className="text-[11px] tracking-widest uppercase text-[#e8e8f0] opacity-60 font-bold">
                  {directorMeta.title}
                </span>
              </div>
              <p className="mt-1 text-sm text-[#e8e8f0] opacity-70 font-bold">
                {directorMeta.skillSet}
              </p>
            </div>

            {/* View Dossier link */}
            <Link
              href="/agents/director"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 inline-flex items-center gap-2 border-2 border-[#e8e8f0] px-4 py-2 font-[family-name:var(--font-display)] text-sm tracking-wider text-[#e8e8f0] transition-all duration-200 hover:bg-[#e8e8f0] hover:text-[#1a1a2e]"
            >
              View Dossier
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>

          {/* Selection indicator — star burst */}
          {selectedSlug === "director" && (
            <div
              className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center text-[#1a1a2e] text-[10px] font-bold animate-pop"
              style={{
                background: "#e8e8f0",
                clipPath:
                  "polygon(50% 0%, 63% 28%, 98% 35%, 72% 57%, 82% 91%, 50% 72%, 18% 91%, 28% 57%, 2% 35%, 37% 28%)",
              }}
            />
          )}
        </button>
      )}

      {/* Assembly Grid — remaining agents */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {teamAgents.map((agent, i) => {
          const meta = HERO_META[agent.slug];
          if (!meta) return null;
          const isSelected = selectedSlug === agent.slug;

          return (
            <button
              key={agent.slug}
              onClick={() => handleSelect(agent.slug)}
              className="animate-fade-up group relative p-4 sm:p-5 text-center transition-all duration-200 cursor-pointer bg-[var(--panel-bg)] speed-hover"
              style={{
                border: `3px solid var(--ink)`,
                boxShadow: isSelected
                  ? `6px 6px 0 ${meta.color}`
                  : "4px 4px 0 var(--ink)",
                animationDelay: `${0.06 + i * 0.06}s`,
                transform: isSelected ? "translate(-2px, -2px)" : undefined,
              }}
            >
              {/* Color bar at top */}
              <div
                className="absolute top-0 left-0 right-0 h-[4px]"
                style={{ background: meta.color }}
              />

              {/* Icon with halftone-colored background */}
              <div
                className="relative mx-auto mb-3 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center"
                style={{ background: meta.colorLight }}
              >
                {/* Halftone dots inside the icon area */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle, ${meta.color} 0.6px, transparent 0.6px)`,
                    backgroundSize: "4px 4px",
                    opacity: 0.12,
                  }}
                />
                <div className="relative z-10">
                  <HeroIcon slug={agent.slug} color={meta.color} />
                </div>
              </div>

              {/* Name */}
              <h3
                className="font-[family-name:var(--font-display)] text-lg sm:text-xl tracking-wide transition-colors duration-200"
                style={{ color: isSelected ? meta.color : "var(--ink)" }}
              >
                {agent.name.toUpperCase()}
              </h3>

              {/* Title */}
              <p className="mt-0.5 text-[10px] sm:text-[11px] tracking-wider uppercase text-[var(--ink-light)] font-bold">
                {meta.title}
              </p>

              {/* Selection indicator — star burst */}
              {isSelected && (
                <div
                  className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center text-white text-[10px] font-bold animate-pop"
                  style={{
                    background: meta.color,
                    clipPath:
                      "polygon(50% 0%, 63% 28%, 98% 35%, 72% 57%, 82% 91%, 50% 72%, 18% 91%, 28% 57%, 2% 35%, 37% 28%)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Dossier Panel */}
      {selectedAgent && selectedMeta && (
        /* ... existing dossier panel code unchanged ... */
      )}
    </div>
  );
```

Note: The dossier panel JSX (lines 319-539 in the current file) stays exactly as-is. Only the wrapping return structure changes.

**Step 2: Build and verify**

```bash
cd web && npx next build
```

Expected: Clean build, `/agents/director` page generated, 21 pages total.

**Step 3: Lint**

```bash
cd web && npx eslint src/
```

Expected: No errors.

**Step 4: Commit**

```bash
git add web/src/components/HeroRoster.tsx
git commit -m "feat(web): redesign Director as command center banner above agent grid

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
