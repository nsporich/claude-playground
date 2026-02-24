---
name: accessibility
description: WCAG compliance, semantic HTML, ARIA, keyboard navigation, and screen reader testing
tags: [accessibility, a11y, wcag, aria]
---

# Accessibility

Ensure interfaces are usable by everyone. Audit against WCAG guidelines, fix semantic structure, verify contrast, implement keyboard navigation, and validate screen reader compatibility.

## Workflow

```
Baseline → Semantic → Contrast → Keyboard → Screen Reader → Report
```

---

## Phase 1: Baseline

Establish the current accessibility state before making changes.

1. **Run automated checks** — use available linting tools (eslint-plugin-jsx-a11y, axe-core rules, or similar) to surface obvious violations.
2. **Identify WCAG target level** — determine whether the project targets Level A, AA, or AAA. Default to AA if unspecified.
3. **Inventory interactive elements** — buttons, links, forms, modals, dropdowns, tabs, and custom widgets.
4. **Check existing ARIA usage** — look for misused roles, missing labels, or ARIA attributes that conflict with native semantics.

**Exit criteria:** You have a list of current violations and a clear target WCAG level.

---

## Phase 2: Semantic

Fix the document structure so assistive technologies can parse it correctly.

1. **Heading hierarchy** — ensure a logical h1→h2→h3 progression without skipped levels.
2. **Landmark regions** — use `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>` appropriately.
3. **Lists and tables** — use semantic `<ul>`, `<ol>`, `<table>` elements instead of styled divs.
4. **Buttons vs. links** — buttons perform actions, links navigate. Replace `<div onClick>` with `<button>` or `<a>`.
5. **Form labels** — every input has an associated `<label>` or `aria-label`. Group related fields with `<fieldset>` and `<legend>`.

**Exit criteria:** The DOM structure communicates meaning without relying on visual presentation.

---

## Phase 3: Contrast

Ensure text and interactive elements meet contrast requirements.

1. **Text contrast** — normal text needs 4.5:1 ratio (AA), large text needs 3:1. Check all foreground/background combinations.
2. **Non-text contrast** — UI components and graphical objects need 3:1 against adjacent colors (WCAG 1.4.11).
3. **Focus indicators** — focus outlines must be visible against the background with sufficient contrast.
4. **Don't rely on color alone** — use icons, patterns, underlines, or text labels alongside color to convey meaning.
5. **Dark mode** — if the project supports dark mode, verify contrast in both themes.

**Exit criteria:** All text and interactive elements meet the target WCAG contrast ratios.

---

## Phase 4: Keyboard

Ensure full keyboard operability without a mouse.

1. **Tab order** — verify logical tab sequence through all interactive elements. Fix with DOM order (preferred) or `tabindex` (last resort).
2. **Focus management** — modals trap focus, closing a modal returns focus to the trigger, dynamic content updates don't steal focus.
3. **Keyboard shortcuts** — custom shortcuts don't conflict with browser/screen reader shortcuts. All shortcuts have visible documentation.
4. **Skip links** — provide "Skip to main content" for pages with repetitive navigation.
5. **Custom widgets** — implement WAI-ARIA design patterns for tabs, accordions, menus, comboboxes, and other custom controls.

**Exit criteria:** Every interactive feature is fully operable via keyboard alone.

---

## Phase 5: Screen Reader

Validate the experience through screen reader announcements.

1. **Alt text** — all informational images have descriptive alt text. Decorative images use `alt=""` or `aria-hidden="true"`.
2. **Live regions** — dynamic content updates (toasts, loading states, error messages) use `aria-live` with appropriate politeness.
3. **Hidden content** — content hidden visually but needed for screen readers uses `sr-only` / `visually-hidden` class. Content hidden from everyone uses `aria-hidden="true"`.
4. **Reading order** — verify that the screen reader encounters content in a logical order, especially for complex layouts.
5. **Announce state changes** — toggled buttons, expanded accordions, and selected tabs communicate their state via `aria-expanded`, `aria-selected`, `aria-pressed`.

**Exit criteria:** A screen reader user can understand and operate all content and features.

---

## Phase 6: Report

Document findings and fixes for the team.

1. **Summary** — WCAG level targeted, number of violations found, number fixed.
2. **Remaining issues** — any violations that couldn't be fixed, with severity and remediation guidance.
3. **Testing methodology** — which tools, browsers, and assistive technologies were used.
4. **Recommendations** — patterns to adopt project-wide to prevent future regressions.

**Exit criteria:** The team has a clear record of accessibility work done and outstanding items.

---

## Anti-Rationalization Table

| Thought | Reality |
|---------|---------|
| "Screen reader users are a tiny percentage" | Accessibility benefits everyone — keyboard users, mobile users, users with temporary injuries, power users. |
| "ARIA will fix the semantics" | ARIA is a supplement, not a replacement. Use native HTML elements first. The first rule of ARIA is don't use ARIA. |
| "The automated tools didn't flag anything" | Automated tools catch ~30% of accessibility issues. Manual testing is required. |
| "We'll add accessibility later" | Retrofitting is 5-10x more expensive. Build it in from the start. |
| "This is an internal tool, accessibility doesn't apply" | Internal tools must also be accessible. Employees have disabilities too. |

## Red Flags

- `<div onClick>` without role="button" and keyboard handling
- Images without alt attributes (or all images with `alt="image"`)
- Color as the sole means of conveying information
- Custom widgets without WAI-ARIA patterns (tabs, menus, dialogs)
- `tabindex` values greater than 0 (disrupts natural tab order)
- Autoplaying media without controls or pause mechanism

## Cross-References

- **frontend-design** — accessibility constraints inform design decisions (contrast, spacing, touch targets)
- **code-review** — include accessibility in review checklists
