---
name: frontend-design
description: Component design, layout systems, design tokens, responsive patterns, and visual hierarchy
tags: [design, ui, components, responsive]
---

# Frontend Design

Shape interfaces from chaos into elegant, production-grade reality. Audit what exists, establish design tokens, build components, ensure responsiveness, and refine visual hierarchy.

## Workflow

```
Audit → Tokens → Components → Responsive → Hierarchy
```

---

## Phase 1: Audit

Understand the current state of the UI before changing anything.

1. **Inventory existing components** — scan the codebase for UI components, their props, and usage patterns.
2. **Identify inconsistencies** — mismatched spacing, conflicting color values, duplicate components doing the same thing.
3. **Map the design surface** — which pages/views exist, what layout patterns are in use, what's shared vs. one-off.
4. **Check for a design system** — look for existing tokens, theme files, CSS custom properties, Tailwind config, or component libraries.

**Exit criteria:** You have a clear inventory of existing UI components, their patterns, and any inconsistencies to address.

---

## Phase 2: Tokens

Establish or refine design tokens — the single source of truth for visual decisions.

1. **Color palette** — define primary, secondary, neutral, semantic (success, warning, error, info) colors with accessible contrast ratios.
2. **Typography scale** — establish a modular type scale (sizes, weights, line heights, font families).
3. **Spacing system** — define a consistent spacing scale (4px/8px base, or the project's existing convention).
4. **Border radii, shadows, transitions** — standardize decorative properties.
5. **Document token format** — CSS custom properties, Tailwind theme, JS/TS constants, or whatever the project uses.

**Exit criteria:** All visual decisions are captured in a token system that components can reference. No magic numbers.

---

## Phase 3: Components

Design and build components using the established tokens.

1. **Identify component boundaries** — what's a primitive (Button, Input, Badge) vs. a composite (Card, Modal, Form)?
2. **Define the API** — props, variants, sizes, states (hover, focus, disabled, loading, error).
3. **Build from primitives up** — start with the smallest reusable pieces, compose into larger patterns.
4. **Follow project conventions** — match existing naming, file structure, export patterns, and styling approach.
5. **Handle edge cases** — long text, empty states, loading states, error states, overflow.

**Exit criteria:** Components are built, use tokens consistently, and handle all expected states.

---

## Phase 4: Responsive

Ensure the design works across viewport sizes.

1. **Define breakpoints** — use the project's existing breakpoints or establish mobile-first defaults.
2. **Test critical layouts** — navigation, content grids, forms, modals, tables at each breakpoint.
3. **Adjust component behavior** — stack, collapse, hide, or resize elements as needed.
4. **Touch targets** — ensure interactive elements are at least 44x44px on mobile.
5. **Content reflow** — verify text remains readable, images scale, and nothing overflows.

**Exit criteria:** The UI is usable and visually coherent from 320px to 1920px+ viewports.

---

## Phase 5: Hierarchy

Refine visual hierarchy so users see the right things in the right order.

1. **Establish focal points** — primary actions and content should draw the eye first.
2. **Use size, weight, color, and space** — larger, bolder, more colorful, or more isolated elements command attention.
3. **Reduce noise** — remove unnecessary borders, shadows, or decorative elements that compete for attention.
4. **Group related items** — use proximity, shared backgrounds, or subtle dividers to create visual groupings.
5. **Test the squint test** — blur the page. The important elements should still stand out.

**Exit criteria:** The interface has clear visual priority. Users can identify primary actions and content flow without reading.

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "I'll just pick colors that look nice" | Use the token system. Aesthetic intuition without tokens creates inconsistency. |
| "Responsiveness can come later" | It's 10x harder to retrofit. Design for all viewports from the start. |
| "This component is too small to formalize" | If it appears twice, it's a component. Capture it now or fix duplication later. |
| "The design system is overkill for this project" | Even 5 tokens (2 colors, 2 sizes, 1 radius) are better than magic numbers everywhere. |
| "I know what looks good without auditing" | Audit first. You'll find patterns (and problems) you didn't expect. |

## Red Flags

- Magic numbers (hardcoded px, hex, or rgba values not in the token system)
- Components with 10+ boolean props instead of a variant/size enum
- Responsive behavior untested below 768px
- Visual hierarchy that relies solely on color (fails for color-blind users)
- Skipping the audit phase and redesigning from scratch when iteration would suffice

## Cross-References

- **accessibility** — every design decision has accessibility implications; run accessibility checks on completed components
- **code-review** — review component APIs and token usage for consistency
