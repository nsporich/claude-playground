# Install Script Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite install.sh presentation layer to use gum when available (fuzzy multi-select, spinners, styled boxes) with a polished bash fallback (box-drawing, braille spinners, amber palette).

**Architecture:** Single-file script with a `HAS_GUM` flag set at startup. Helper functions (`show_banner`, `show_spinner`, `select_assets`, `confirm_prompt`, `show_summary`) dispatch to gum or bash implementations. Install logic (symlinks, copy, catalog parsing) is unchanged.

**Tech Stack:** Bash 4+, optional [gum](https://github.com/charmbracelet/gum) CLI

---

### Task 1: Update color palette and gum detection

**Files:**
- Modify: `install.sh:22-45` (TTY handling and colors section)

**Step 1: Replace the color/TTY section with new palette and gum detection**

Replace lines 22-45 of `install.sh` with:

```bash
# ── Colors & gum detection ───────────────────────────────────────────────────
# Amber-warm palette matching the site theme
if [ -t 1 ]; then
  BOLD='\033[1m'
  DIM='\033[2m'
  RESET='\033[0m'
  AMBER='\033[38;5;214m'
  WHITE='\033[97m'
  GRAY='\033[38;5;245m'
  GREEN='\033[32m'
  RED='\033[31m'
  YELLOW='\033[33m'
  CYAN='\033[36m'
else
  BOLD='' DIM='' RESET='' AMBER='' WHITE='' GRAY='' GREEN='' RED='' YELLOW='' CYAN=''
fi

# Detect gum for rich interactive experience
HAS_GUM=0
if command -v gum >/dev/null 2>&1; then
  HAS_GUM=1
fi

# TTY input handling for piped installs (curl ... | bash)
if [ -t 0 ]; then
  TTY_INPUT="/dev/stdin"
elif [ -e /dev/tty ]; then
  TTY_INPUT="/dev/tty"
else
  echo "Error: No terminal available for interactive input." >&2
  exit 1
fi
```

**Step 2: Update helper functions to use amber palette**

Replace the helpers section (lines 47-51) with:

```bash
# ── Helpers ──────────────────────────────────────────────────────────────────
info()  { printf "${AMBER}  ▸${RESET} %s\n" "$*"; }
ok()    { printf "${GREEN}  ✓${RESET} %s\n" "$*"; }
warn()  { printf "${YELLOW}  !${RESET} %s\n" "$*"; }
err()   { printf "${RED}  ✗${RESET} %s\n" "$*" >&2; }
die()   { err "$@"; exit 1; }
```

**Step 3: Verify script still runs**

Run: `bash install.sh` from the repo root — should print the old menu (colors will be different now). Ctrl-C out.

**Step 4: Commit**

```bash
git add install.sh
git commit -m "refactor: update install.sh color palette and add gum detection"
```

---

### Task 2: Add banner function

**Files:**
- Modify: `install.sh` — add `show_banner()` function after helpers, replace the old banner printf

**Step 1: Add the show_banner function after the helpers section**

Insert after the helpers block:

```bash
# ── Banner ───────────────────────────────────────────────────────────────────
show_banner() {
  echo ""
  if [ "$HAS_GUM" -eq 1 ]; then
    gum style \
      --border rounded \
      --border-foreground 214 \
      --foreground 214 \
      --align center \
      --width 42 \
      --padding "1 2" \
      "Claude Playground" \
      "" \
      "Skills · Templates · Prompts"
  else
    printf "${AMBER}  ╭──────────────────────────────────────╮${RESET}\n"
    printf "${AMBER}  │${RESET}                                      ${AMBER}│${RESET}\n"
    printf "${AMBER}  │${RESET}    ${BOLD}${WHITE}Claude Playground${RESET}                ${AMBER}│${RESET}\n"
    printf "${AMBER}  │${RESET}    ${GRAY}─────────────────${RESET}                ${AMBER}│${RESET}\n"
    printf "${AMBER}  │${RESET}    ${GRAY}Skills · Templates · Prompts${RESET}     ${AMBER}│${RESET}\n"
    printf "${AMBER}  │${RESET}                                      ${AMBER}│${RESET}\n"
    printf "${AMBER}  ╰──────────────────────────────────────╯${RESET}\n"
  fi
  echo ""
}
```

**Step 2: Replace the old banner in Step 5**

Find and replace:
```bash
echo ""
printf "${BOLD}${CYAN}Claude Playground Installer${RESET}\n"
echo ""
```

With:
```bash
show_banner
```

**Step 3: Test both paths**

Run: `bash install.sh` — should show the bash box banner.
If gum is installed, also verify: `HAS_GUM=1 bash install.sh` shows gum-styled banner.

**Step 4: Commit**

```bash
git add install.sh
git commit -m "feat: add branded banner to install script"
```

---

### Task 3: Add spinner function for clone/build

**Files:**
- Modify: `install.sh` — add `run_with_spinner()` function, wrap git clone/pull and catalog build

**Step 1: Add the spinner function after show_banner**

```bash
# ── Spinner ──────────────────────────────────────────────────────────────────
run_with_spinner() {
  local msg="$1"
  shift
  if [ "$HAS_GUM" -eq 1 ]; then
    gum spin --spinner dot --title "$msg" -- "$@"
  else
    local frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
    local i=0
    printf "  ${AMBER}%s${RESET} %s" "${frames[0]}" "$msg"
    "$@" &
    local pid=$!
    while kill -0 "$pid" 2>/dev/null; do
      printf "\r  ${AMBER}%s${RESET} %s" "${frames[$i]}" "$msg"
      i=$(( (i + 1) % ${#frames[@]} ))
      sleep 0.08
    done
    wait "$pid"
    local exit_code=$?
    printf "\r  ${GREEN}✓${RESET} %s\n" "$msg"
    return $exit_code
  fi
}
```

**Step 2: Replace git clone/pull section (Step 2 of install.sh)**

Replace the clone/pull block:

```bash
# ── Step 2: Clone or pull the repo ───────────────────────────────────────────
if [ -d "$CACHE_DIR/.git" ]; then
  run_with_spinner "Updating assets..." git -C "$CACHE_DIR" pull --ff-only --quiet 2>/dev/null || warn "Could not pull latest; using cached version."
else
  rm -rf "$CACHE_DIR"
  run_with_spinner "Fetching assets..." git clone --quiet "$REPO_URL" "$CACHE_DIR" || die "Failed to clone $REPO_URL"
fi
```

**Step 3: Replace catalog build section (Step 3 of install.sh)**

Replace the build block with spinner:

```bash
if [ "$needs_rebuild" -eq 1 ]; then
  if [ -x "$BUILD_SCRIPT" ] || [ -f "$BUILD_SCRIPT" ]; then
    run_with_spinner "Building catalog..." bash "$BUILD_SCRIPT"
  else
    die "catalog.json is missing and build-catalog.sh not found."
  fi
fi
```

Also remove the old `info "Cloning repo..."`, `info "Updating cached repo..."`, and `info "Building catalog ..."` lines since the spinner replaces them.

**Step 4: Test**

Run: `rm -rf ~/.claude-playground && bash install.sh` — should show spinner during clone and build, then the menu. Ctrl-C.

**Step 5: Commit**

```bash
git add install.sh
git commit -m "feat: add spinner for clone/build in install script"
```

---

### Task 4: Add gum-based asset selection

**Files:**
- Modify: `install.sh` — add `select_assets()` function, replace Step 5 (menu) and Step 6 (selection input)

**Step 1: Add select_assets function after run_with_spinner**

```bash
# ── Asset selection ──────────────────────────────────────────────────────────
select_assets_gum() {
  # Build lines for gum filter: "[type] slug — description"
  local -a lines=()
  for i in $(seq 0 $((total - 1))); do
    local cat_label
    case "${ITEM_CATEGORY[$i]}" in
      skills)    cat_label="skill   " ;;
      templates) cat_label="template" ;;
      prompts)   cat_label="prompt  " ;;
      *)         cat_label="${ITEM_CATEGORY[$i]}" ;;
    esac
    lines+=("$(printf "[%s]  %-30s  %s" "$cat_label" "${ITEM_SLUG[$i]}" "${ITEM_DESC[$i]}")")
  done

  printf "  ${GRAY}Use arrow keys to navigate, space to select, enter to confirm${RESET}\n\n"

  local selected
  selected="$(printf '%s\n' "${lines[@]}" | gum filter \
    --no-limit \
    --height 15 \
    --header "Select assets to install" \
    --header.foreground 214 \
    --indicator "▸" \
    --indicator.foreground 214 \
    --selected-indicator "◆" \
    --selected-prefix "✓ " \
    --selected-prefix.foreground 214 \
    --unselected-prefix "  " \
    --match.foreground 214 \
    < "$TTY_INPUT")" || true

  if [ -z "$selected" ]; then
    echo "Nothing selected. Bye!"
    exit 0
  fi

  # Map selected lines back to indices
  install_indices=()
  while IFS= read -r sel_line; do
    for i in $(seq 0 $((total - 1))); do
      if echo "$sel_line" | grep -qF "${ITEM_SLUG[$i]}"; then
        install_indices+=("$i")
        break
      fi
    done
  done <<< "$selected"
}

select_assets_bash() {
  # Category headers with box-drawing
  local prev_cat=""
  for i in $(seq 0 $((total - 1))); do
    local cat="${ITEM_CATEGORY[$i]}"
    local grp="${ITEM_GROUP[$i]}"
    local cat_label grp_label
    cat_label="$(echo "$cat" | sed 's/^./\U&/')"
    grp_label="$(echo "$grp" | sed 's/^./\U&/')"
    local header="${cat_label} › ${grp_label}"

    if [ "$header" != "$prev_cat" ]; then
      [ -n "$prev_cat" ] && echo ""
      printf "  ${AMBER}${BOLD}%s${RESET}\n" "$header"
      printf "  ${GRAY}%s${RESET}\n" "$(printf '%.0s─' {1..40})"
      prev_cat="$header"
    fi

    local num=$((i + 1))
    printf "  ${WHITE}%2d)${RESET}  ${BOLD}%-28s${RESET}  ${GRAY}%s${RESET}\n" "$num" "${ITEM_SLUG[$i]}" "${ITEM_DESC[$i]}"
  done

  echo ""
  printf "  ${AMBER}▸${RESET} Enter numbers (space-separated), ${BOLD}'all'${RESET}, or ${BOLD}'q'${RESET} to quit: "
  read -r selection < "$TTY_INPUT"

  if [ -z "$selection" ] || [ "$selection" = "q" ] || [ "$selection" = "Q" ]; then
    echo "  Nothing to install. Bye!"
    exit 0
  fi

  install_indices=()
  if [ "$selection" = "all" ] || [ "$selection" = "ALL" ]; then
    for i in $(seq 0 $((total - 1))); do
      install_indices+=("$i")
    done
  else
    for token in $selection; do
      if ! echo "$token" | grep -qE '^[0-9]+$'; then
        warn "Skipping invalid input: $token"
        continue
      fi
      local idx=$((token - 1))
      if [ "$idx" -lt 0 ] || [ "$idx" -ge "$total" ]; then
        warn "Skipping out-of-range: $token"
        continue
      fi
      install_indices+=("$idx")
    done
  fi
}
```

**Step 2: Replace the old Step 5 (menu display) and Step 6 (selection input)**

Remove the entire old menu display loop and selection input. Replace with:

```bash
# ── Step 5: Select assets ────────────────────────────────────────────────────
declare -a install_indices=()

if [ "$HAS_GUM" -eq 1 ]; then
  select_assets_gum
else
  select_assets_bash
fi

if [ ${#install_indices[@]} -eq 0 ]; then
  echo "  Nothing selected. Bye!"
  exit 0
fi
```

Also remove the old `declare -a install_indices=()` from the old Step 6 area since it's now declared above.

**Step 3: Test both paths**

Run: `bash install.sh` — should show the improved bash menu.
If gum available: verify fuzzy filter works with space-to-select.

**Step 4: Commit**

```bash
git add install.sh
git commit -m "feat: add gum fuzzy multi-select with bash menu fallback"
```

---

### Task 5: Update confirmation prompts and prompt-save interaction

**Files:**
- Modify: `install.sh` — update template overwrite and prompt-save sections in the install loop

**Step 1: Update template overwrite prompt**

Replace the template overwrite block with:

```bash
    templates)
      dest="$ORIG_CWD/CLAUDE.md"

      if [ -f "$dest" ]; then
        local do_overwrite="n"
        if [ "$HAS_GUM" -eq 1 ]; then
          gum confirm "CLAUDE.md already exists in $ORIG_CWD. Overwrite?" < "$TTY_INPUT" && do_overwrite="y"
        else
          printf "  ${YELLOW}!${RESET} CLAUDE.md exists in %s. Overwrite? [y/N] " "$ORIG_CWD"
          read -r do_overwrite < "$TTY_INPUT"
        fi
        case "$do_overwrite" in
          y|Y|yes|YES)
            cp "$src" "$dest"
            summary+=("$(printf "${GREEN}✓${RESET}  %-12s  %-28s  → %s" "[template]" "$slug" "$dest")")
            ;;
          *)
            summary+=("$(printf "${YELLOW}–${RESET}  %-12s  %-28s  skipped" "[template]" "$slug")")
            ;;
        esac
      else
        cp "$src" "$dest"
        summary+=("$(printf "${GREEN}✓${RESET}  %-12s  %-28s  → %s" "[template]" "$slug" "$dest")")
      fi
      ;;
```

**Step 2: Update prompt save interaction**

Replace the prompts block with:

```bash
    prompts)
      local prompt_dest=""
      if [ "$HAS_GUM" -eq 1 ]; then
        printf "\n"
        prompt_dest="$(gum input \
          --header "Prompt: $slug" \
          --header.foreground 214 \
          --placeholder "File path (or Enter to print to stdout)" \
          --width 60 \
          < "$TTY_INPUT")" || true
      else
        printf "  ${AMBER}▸${RESET} Prompt '${BOLD}%s${RESET}': save to file or print to stdout?\n" "$slug"
        printf "    Enter file path (or Enter for stdout): "
        read -r prompt_dest < "$TTY_INPUT"
      fi

      if [ -z "$prompt_dest" ]; then
        echo ""
        printf "  ${GRAY}┌─────────────────────────────────────────┐${RESET}\n"
        while IFS= read -r line; do
          printf "  ${GRAY}│${RESET} %s\n" "$line"
        done < "$src"
        printf "  ${GRAY}└─────────────────────────────────────────┘${RESET}\n"
        echo ""
        summary+=("$(printf "${GREEN}✓${RESET}  %-12s  %-28s  printed" "[prompt]" "$slug")")
      else
        case "$prompt_dest" in
          /*) ;;
          *)  prompt_dest="$ORIG_CWD/$prompt_dest" ;;
        esac
        mkdir -p "$(dirname "$prompt_dest")"
        cp "$src" "$prompt_dest"
        summary+=("$(printf "${GREEN}✓${RESET}  %-12s  %-28s  → %s" "[prompt]" "$slug" "$prompt_dest")")
      fi
      ;;
```

**Step 3: Update skills summary line format to match**

In the skills case, update the summary line:

```bash
      summary+=("$(printf "${GREEN}✓${RESET}  %-12s  %-28s  → %s" "[skill]" "$slug" "$target_link")")
```

And the skip case:
```bash
        summary+=("$(printf "${YELLOW}–${RESET}  %-12s  %-28s  skipped (dir exists)" "[skill]" "$slug")")
```

**Step 4: Commit**

```bash
git add install.sh
git commit -m "feat: add gum confirm/input with styled bash fallback"
```

---

### Task 6: Update installation summary

**Files:**
- Modify: `install.sh` — replace Step 8 (summary)

**Step 1: Replace the summary section**

```bash
# ── Step 8: Print summary ───────────────────────────────────────────────────
echo ""
if [ "$HAS_GUM" -eq 1 ]; then
  local summary_text=""
  if [ ${#summary[@]} -eq 0 ]; then
    summary_text="  Nothing was installed."
  else
    for line in "${summary[@]}"; do
      summary_text+="$(printf '%b' "$line")\n"
    done
  fi
  printf '%b' "$summary_text" | gum style \
    --border rounded \
    --border-foreground 214 \
    --padding "1 2" \
    --width 80
else
  printf "  ${AMBER}${BOLD}Installation Summary${RESET}\n"
  printf "  ${GRAY}%s${RESET}\n" "$(printf '%.0s─' {1..60})"
  if [ ${#summary[@]} -eq 0 ]; then
    printf "  Nothing was installed.\n"
  else
    for line in "${summary[@]}"; do
      printf "  %b\n" "$line"
    done
  fi
  printf "  ${GRAY}%s${RESET}\n" "$(printf '%.0s─' {1..60})"
fi
echo ""
```

**Step 2: Commit**

```bash
git add install.sh
git commit -m "feat: add styled installation summary"
```

---

### Task 7: Sync and final test

**Files:**
- Copy: `install.sh` → `web/public/install.sh`

**Step 1: Copy the finished script**

```bash
cp install.sh web/public/install.sh
```

**Step 2: Full end-to-end test (bash fallback)**

```bash
rm -rf ~/.claude-playground
bash install.sh
```

Verify: banner → spinners → menu → selection → install → summary all display correctly.

**Step 3: Full end-to-end test (gum path, if available)**

```bash
rm -rf ~/.claude-playground
bash install.sh
```

With gum installed, verify: styled banner → spinners → fuzzy filter → confirm prompts → styled summary.

**Step 4: Build the web app to ensure sync**

```bash
cd web && npm run build
```

Verify build succeeds (prebuild copies install.sh to public/).

**Step 5: Commit everything**

```bash
git add install.sh web/public/install.sh
git commit -m "feat: polished install script with gum support and bash fallback"
git push
```

---
