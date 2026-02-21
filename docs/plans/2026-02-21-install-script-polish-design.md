# Install Script Polish Design

**Date:** 2026-02-21
**Goal:** Make the install.sh a richer user experience with visual polish and interactive selection, using gum when available with graceful bash fallback.

## Approach

Gum-first with bash fallback (Approach A). Detect `gum` at startup, dispatch all interactive functions based on availability. No auto-installing gum.

## Color Palette

Match the site's dark editorial theme:
- Amber (`\033[38;5;214m`) for accents, headers, highlights
- Warm white for primary text
- Gray/dim for secondary text and borders

## Sections

### 1. Detection & Setup
- `command -v gum` sets `HAS_GUM=1|0`
- All interactive functions dispatch based on this flag
- Color variables updated to amber/warm palette

### 2. Banner
- **Gum**: `gum style` with box border, amber foreground, centered "Claude Playground" with subtitle
- **Bash**: Same layout using printf and box-drawing characters (╭╮╰╯│─)

### 3. Progress (clone/build)
- **Gum**: `gum spin --spinner dot --title "message..."` wrapping git/build commands
- **Bash**: Braille dot spinner (⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏) with inline status, checkmark on completion

### 4. Asset Selection
- **Gum**: `gum filter --no-limit` with formatted lines `[type] name — description`. Fuzzy search + space-to-toggle + enter-to-confirm
- **Bash**: Improved numbered menu with box-drawn section borders, aligned columns, amber category headers

### 5. Confirmation Prompts
- **Gum**: `gum confirm` for yes/no, `gum input` for file paths
- **Bash**: Same prompts with consistent amber styling

### 6. Installation Summary
- **Gum**: `gum style` box with checkmarks per installed item
- **Bash**: Box-drawn summary table with checkmark/skip indicators

## Non-goals
- No changes to install logic (symlinks, copy, paths)
- No changes to catalog parsing
- No auto-installing gum
- Keep as single file
