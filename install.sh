#!/usr/bin/env bash
#
# install.sh -- Interactive installer for claude-playground assets
#
# Usage:
#   curl -fsSL claude.sporich.dev/install.sh | bash
#
# Or clone the repo and run directly:
#   ./install.sh
#
set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────
REPO_URL="https://github.com/nsporich/claude-playground"
CACHE_DIR="$HOME/.claude-playground"
CLAUDE_DIR="$HOME/.claude"
SKILLS_DIR="$CLAUDE_DIR/skills"

# Save the original working directory so templates install to the right place
ORIG_CWD="$(pwd)"

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
else
  BOLD='' DIM='' RESET='' AMBER='' WHITE='' GRAY='' GREEN='' RED='' YELLOW=''
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

# ── Helpers ──────────────────────────────────────────────────────────────────
info()  { printf "${AMBER}  ▸${RESET} %s\n" "$*"; }
ok()    { printf "${GREEN}  ✓${RESET} %s\n" "$*"; }
warn()  { printf "${YELLOW}  !${RESET} %s\n" "$*"; }
err()   { printf "${RED}  ✗${RESET} %s\n" "$*" >&2; }
die()   { err "$@"; exit 1; }

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

# ── Spinner ──────────────────────────────────────────────────────────────────
run_with_spinner() {
  local msg="$1"
  shift
  if [ "$HAS_GUM" -eq 1 ]; then
    gum spin --spinner dot --title "$msg" -- "$@"
    ok "$msg"
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

# ── Step 1: Check for git ────────────────────────────────────────────────────
command -v git >/dev/null 2>&1 || die "git is required but not found. Please install git first."

# ── Step 2: Clone or pull the repo ───────────────────────────────────────────
if [ -d "$CACHE_DIR/.git" ]; then
  run_with_spinner "Updating assets..." git -C "$CACHE_DIR" pull --ff-only --quiet 2>/dev/null || warn "Could not pull latest; using cached version."
else
  rm -rf "$CACHE_DIR"
  run_with_spinner "Fetching assets..." git clone --quiet "$REPO_URL" "$CACHE_DIR" || die "Failed to clone $REPO_URL"
fi

# ── Step 3: Build catalog if needed ──────────────────────────────────────────
CATALOG="$CACHE_DIR/catalog.json"
BUILD_SCRIPT="$CACHE_DIR/scripts/build-catalog.sh"

needs_rebuild=0
if [ ! -f "$CATALOG" ]; then
  needs_rebuild=1
else
  # Check if any .md file is newer than catalog.json
  while IFS= read -r -d '' mdfile; do
    if [ "$mdfile" -nt "$CATALOG" ]; then
      needs_rebuild=1
      break
    fi
  done < <(find "$CACHE_DIR/skills" "$CACHE_DIR/templates" "$CACHE_DIR/prompts" -name '*.md' -print0 2>/dev/null)
fi

if [ "$needs_rebuild" -eq 1 ]; then
  if [ -x "$BUILD_SCRIPT" ] || [ -f "$BUILD_SCRIPT" ]; then
    run_with_spinner "Building catalog..." bash "$BUILD_SCRIPT"
  else
    die "catalog.json is missing and build-catalog.sh not found."
  fi
fi

[ -f "$CATALOG" ] || die "catalog.json not found after build attempt."

# ── Step 4: Parse catalog.json ───────────────────────────────────────────────
# We parse the simple predictable JSON with grep/sed/awk -- no jq needed.
# Each entry is on a single line like:
#   {"name": "...", "slug": "...", "description": "...", ... "group": "...", "path": "..."}

# Arrays to hold parsed data (parallel arrays indexed by menu number)
declare -a ITEM_CATEGORY=()   # skills | templates | prompts
declare -a ITEM_NAME=()
declare -a ITEM_SLUG=()
declare -a ITEM_DESC=()
declare -a ITEM_GROUP=()
declare -a ITEM_PATH=()

current_category=""

while IFS= read -r line; do
  # Detect category sections
  if echo "$line" | grep -q '"skills"'; then
    current_category="skills"
    continue
  elif echo "$line" | grep -q '"templates"'; then
    current_category="templates"
    continue
  elif echo "$line" | grep -q '"prompts"'; then
    current_category="prompts"
    continue
  fi

  # Skip lines that don't look like entries
  echo "$line" | grep -q '"slug"' || continue

  # Extract fields
  local_name="$(echo "$line" | sed 's/.*"name":[[:space:]]*"\([^"]*\)".*/\1/')"
  local_slug="$(echo "$line" | sed 's/.*"slug":[[:space:]]*"\([^"]*\)".*/\1/')"
  local_desc="$(echo "$line" | sed 's/.*"description":[[:space:]]*"\([^"]*\)".*/\1/')"
  local_group="$(echo "$line" | sed 's/.*"group":[[:space:]]*"\([^"]*\)".*/\1/')"
  local_path="$(echo "$line" | sed 's/.*"path":[[:space:]]*"\([^"]*\)".*/\1/')"

  ITEM_CATEGORY+=("$current_category")
  ITEM_NAME+=("$local_name")
  ITEM_SLUG+=("$local_slug")
  ITEM_DESC+=("$local_desc")
  ITEM_GROUP+=("$local_group")
  ITEM_PATH+=("$local_path")
done < "$CATALOG"

total=${#ITEM_SLUG[@]}
if [ "$total" -eq 0 ]; then
  die "No items found in catalog.json."
fi

# ── Step 5: Display grouped interactive menu ─────────────────────────────────
show_banner

prev_header=""
for i in $(seq 0 $((total - 1))); do
  cat="${ITEM_CATEGORY[$i]}"
  grp="${ITEM_GROUP[$i]}"
  # Capitalize first letter of category and group
  cat_label="$(echo "$cat" | sed 's/^./\U&/' | sed 's/s$/s/')"
  # Title-case: capitalize first letter
  grp_label="$(echo "$grp" | sed 's/^./\U&/')"
  header="${cat_label} > ${grp_label}"

  if [ "$header" != "$prev_header" ]; then
    printf "${BOLD}${CYAN}[%s]${RESET}\n" "$header"
    prev_header="$header"
  fi

  num=$((i + 1))
  printf "  %2d) ${BOLD}%-30s${RESET} ${DIM}- %s${RESET}\n" "$num" "${ITEM_SLUG[$i]}" "${ITEM_DESC[$i]}"
done

echo ""

# ── Step 6: Get user selection ───────────────────────────────────────────────
printf "Enter numbers to install (space-separated, ${BOLD}'all'${RESET} for everything, ${BOLD}'q'${RESET} to quit): "
read -r selection < "$TTY_INPUT"

if [ -z "$selection" ] || [ "$selection" = "q" ] || [ "$selection" = "Q" ]; then
  echo "Nothing to install. Bye!"
  exit 0
fi

# Build list of indices to install
declare -a install_indices=()

if [ "$selection" = "all" ] || [ "$selection" = "ALL" ]; then
  for i in $(seq 0 $((total - 1))); do
    install_indices+=("$i")
  done
else
  for token in $selection; do
    # Validate it's a number in range
    if ! echo "$token" | grep -qE '^[0-9]+$'; then
      warn "Skipping invalid input: $token"
      continue
    fi
    idx=$((token - 1))
    if [ "$idx" -lt 0 ] || [ "$idx" -ge "$total" ]; then
      warn "Skipping out-of-range number: $token"
      continue
    fi
    install_indices+=("$idx")
  done
fi

if [ ${#install_indices[@]} -eq 0 ]; then
  echo "Nothing selected. Bye!"
  exit 0
fi

# ── Step 7: Install selected items ───────────────────────────────────────────
declare -a summary=()

for idx in "${install_indices[@]}"; do
  cat="${ITEM_CATEGORY[$idx]}"
  slug="${ITEM_SLUG[$idx]}"
  desc="${ITEM_DESC[$idx]}"
  group="${ITEM_GROUP[$idx]}"
  item_path="${ITEM_PATH[$idx]}"
  src="$CACHE_DIR/$item_path"

  if [ ! -f "$src" ]; then
    warn "Source file not found: $src -- skipping $slug"
    continue
  fi

  case "$cat" in
    skills)
      # Symlink: ~/.claude-playground/skills/<group>/<name> -> ~/.claude/skills/<name>
      skill_src_dir="$(dirname "$src")"
      target_link="$SKILLS_DIR/$slug"

      mkdir -p "$SKILLS_DIR"

      # Remove existing symlink or directory if present
      if [ -L "$target_link" ]; then
        rm "$target_link"
      elif [ -d "$target_link" ]; then
        warn "$target_link already exists as a directory; skipping $slug"
        continue
      fi

      ln -s "$skill_src_dir" "$target_link"
      summary+=("$(printf "${GREEN}[skill]${RESET}    %-30s -> %s" "$slug" "$target_link")")
      ;;

    templates)
      dest="$ORIG_CWD/CLAUDE.md"

      if [ -f "$dest" ]; then
        printf "${YELLOW}>>>${RESET} CLAUDE.md already exists in %s. Overwrite? [y/N] " "$ORIG_CWD"
        read -r answer < "$TTY_INPUT"
        case "$answer" in
          y|Y|yes|YES)
            cp "$src" "$dest"
            summary+=("$(printf "${GREEN}[template]${RESET} %-30s -> %s" "$slug" "$dest")")
            ;;
          *)
            warn "Skipped template '$slug' (CLAUDE.md not overwritten)."
            ;;
        esac
      else
        cp "$src" "$dest"
        summary+=("$(printf "${GREEN}[template]${RESET} %-30s -> %s" "$slug" "$dest")")
      fi
      ;;

    prompts)
      printf "${CYAN}>>>${RESET} Prompt '${BOLD}%s${RESET}': save to file or print to stdout?\n" "$slug"
      printf "  Enter a file path (or press Enter to print to stdout): "
      read -r prompt_dest < "$TTY_INPUT"

      if [ -z "$prompt_dest" ]; then
        echo ""
        printf "${DIM}────────────────────────────────────────${RESET}\n"
        cat "$src"
        printf "${DIM}────────────────────────────────────────${RESET}\n"
        echo ""
        summary+=("$(printf "${GREEN}[prompt]${RESET}   %-30s    (printed to stdout)" "$slug")")
      else
        # Resolve relative paths against original CWD
        case "$prompt_dest" in
          /*) ;; # absolute -- keep as-is
          *)  prompt_dest="$ORIG_CWD/$prompt_dest" ;;
        esac
        mkdir -p "$(dirname "$prompt_dest")"
        cp "$src" "$prompt_dest"
        summary+=("$(printf "${GREEN}[prompt]${RESET}   %-30s -> %s" "$slug" "$prompt_dest")")
      fi
      ;;
  esac
done

# ── Step 8: Print summary ───────────────────────────────────────────────────
echo ""
printf "${BOLD}${CYAN}Installation Summary${RESET}\n"
printf "${DIM}────────────────────────────────────────${RESET}\n"
if [ ${#summary[@]} -eq 0 ]; then
  echo "  Nothing was installed."
else
  for line in "${summary[@]}"; do
    printf "  %b\n" "$line"
  done
fi
printf "${DIM}────────────────────────────────────────${RESET}\n"
echo ""
