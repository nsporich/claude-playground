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
      "Assemble Your Team" \
      "" \
      "Agents · Skills"
  else
    printf "${AMBER}  ╭──────────────────────────────────────╮${RESET}\n"
    printf "${AMBER}  │${RESET}                                      ${AMBER}│${RESET}\n"
    printf "${AMBER}  │${RESET}    ${BOLD}${WHITE}Claude Playground${RESET}                ${AMBER}│${RESET}\n"
    printf "${AMBER}  │${RESET}    ${GRAY}─────────────────${RESET}                ${AMBER}│${RESET}\n"
    printf "${AMBER}  │${RESET}    ${GRAY}Assemble Your Team${RESET}               ${AMBER}│${RESET}\n"
    printf "${AMBER}  │${RESET}    ${GRAY}Agents · Skills${RESET}                  ${AMBER}│${RESET}\n"
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
  done < <(find "$CACHE_DIR/skills" "$CACHE_DIR/agents" -name '*.md' -print0 2>/dev/null)
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
declare -a ITEM_CATEGORY=()   # skills | agents
declare -a ITEM_NAME=()
declare -a ITEM_SLUG=()
declare -a ITEM_DESC=()
declare -a ITEM_GROUP=()
declare -a ITEM_PATH=()
declare -a ITEM_REQ_SKILLS=()  # comma-separated list of required skill slugs (agents only)
declare -a ITEM_REQ_AGENTS=()  # comma-separated list of required agent slugs (agents only)

current_category=""

while IFS= read -r line; do
  # Detect category sections
  if echo "$line" | grep -q '"skills"'; then
    current_category="skills"
    continue
  elif echo "$line" | grep -q '"agents"'; then
    current_category="agents"
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

  # Parse requires for agents
  local_req_skills=""
  local_req_agents=""
  if [ "$current_category" = "agents" ]; then
    # Extract skills array from requires
    local_req_skills="$(echo "$line" | sed -n 's/.*"skills":[[:space:]]*\[\([^]]*\)\].*/\1/p' | sed 's/"//g' | sed 's/[[:space:]]//g')"
    # Extract agents array from requires
    local_req_agents="$(echo "$line" | sed -n 's/.*"agents":[[:space:]]*\[\([^]]*\)\].*/\1/p' | sed 's/"//g' | sed 's/[[:space:]]//g')"
  fi

  ITEM_CATEGORY+=("$current_category")
  ITEM_NAME+=("$local_name")
  ITEM_SLUG+=("$local_slug")
  ITEM_DESC+=("$local_desc")
  ITEM_GROUP+=("$local_group")
  ITEM_PATH+=("$local_path")
  ITEM_REQ_SKILLS+=("$local_req_skills")
  ITEM_REQ_AGENTS+=("$local_req_agents")
done < "$CATALOG"

total=${#ITEM_SLUG[@]}
if [ "$total" -eq 0 ]; then
  die "No items found in catalog.json."
fi

# ── Step 5: Detect installed assets ──────────────────────────────────────────
# Check which assets are already installed
declare -a ITEM_STATUS=()   # "installed" | "not_installed"

for i in $(seq 0 $((total - 1))); do
  cat="${ITEM_CATEGORY[$i]}"
  slug="${ITEM_SLUG[$i]}"

  case "$cat" in
    skills|agents)
      if [ -L "$SKILLS_DIR/$slug" ] || [ -d "$SKILLS_DIR/$slug" ]; then
        ITEM_STATUS+=("installed")
      else
        ITEM_STATUS+=("not_installed")
      fi
      ;;
    *)
      ITEM_STATUS+=("not_installed")
      ;;
  esac
done

# Count installed
installed_count=0
for s in "${ITEM_STATUS[@]}"; do
  [ "$s" = "installed" ] && installed_count=$((installed_count + 1))
done

# ── Dependency Resolution ──────────────────────────────────────────────────
# Given an agent index, resolve all required skills and agents recursively
# Populates dep_indices array with indices of all dependencies
declare -a dep_indices=()
declare -a visited_deps=()

resolve_deps() {
  local idx="$1"
  local slug="${ITEM_SLUG[$idx]}"

  # Circular dependency guard
  local v
  for v in "${visited_deps[@]}"; do
    [ "$v" = "$slug" ] && return
  done
  visited_deps+=("$slug")

  # Resolve required skills
  if [ -n "${ITEM_REQ_SKILLS[$idx]}" ]; then
    local req_skills_arr
    IFS=',' read -ra req_skills_arr <<< "${ITEM_REQ_SKILLS[$idx]}"
    local req
    for req in "${req_skills_arr[@]}"; do
      req="$(echo "$req" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')"
      [ -z "$req" ] && continue
      # Find the skill index
      local j
      for j in $(seq 0 $((total - 1))); do
        if [ "${ITEM_SLUG[$j]}" = "$req" ] && [ "${ITEM_CATEGORY[$j]}" = "skills" ]; then
          dep_indices+=("$j")
          break
        fi
      done
    done
  fi

  # Resolve required agents (recursive)
  if [ -n "${ITEM_REQ_AGENTS[$idx]}" ]; then
    local req_agents_arr
    IFS=',' read -ra req_agents_arr <<< "${ITEM_REQ_AGENTS[$idx]}"
    local req
    for req in "${req_agents_arr[@]}"; do
      req="$(echo "$req" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')"
      [ -z "$req" ] && continue
      # Find the agent index and recurse
      local j
      for j in $(seq 0 $((total - 1))); do
        if [ "${ITEM_SLUG[$j]}" = "$req" ] && [ "${ITEM_CATEGORY[$j]}" = "agents" ]; then
          dep_indices+=("$j")
          resolve_deps "$j"
          break
        fi
      done
    done
  fi
}

# ── Step 6: Select assets ────────────────────────────────────────────────────
show_banner

# Show installed status if any assets are already present
if [ "$installed_count" -gt 0 ]; then
  if [ "$HAS_GUM" -eq 1 ]; then
    gum style \
      --foreground 214 \
      --bold \
      "  $installed_count asset(s) already installed"
  else
    printf "  ${AMBER}${BOLD}%d asset(s) already installed${RESET}\n" "$installed_count"
  fi

  # List installed assets
  for i in $(seq 0 $((total - 1))); do
    if [ "${ITEM_STATUS[$i]}" = "installed" ]; then
      printf "  ${GREEN}  ✓${RESET} ${DIM}%s${RESET}  %s\n" "[${ITEM_CATEGORY[$i]}]" "${ITEM_SLUG[$i]}"
    fi
  done
  echo ""

  # Ask what the user wants to do
  action=""
  if [ "$HAS_GUM" -eq 1 ]; then
    action="$(gum choose \
        "Install / update assets" \
        "Remove installed assets" \
        --header "What would you like to do?" \
        --header.foreground 214 \
        --cursor "▸ " \
        --cursor.foreground 214 \
        < "$TTY_INPUT")" || action=""
  else
    printf "  ${AMBER}▸${RESET} What would you like to do?\n"
    printf "    ${WHITE}1)${RESET}  Install / update assets\n"
    printf "    ${WHITE}2)${RESET}  Remove installed assets\n"
    echo ""
    printf "    Choice [1]: "
    read -r action_choice < "$TTY_INPUT"
    case "$action_choice" in
      2) action="Remove installed assets" ;;
      *) action="Install / update assets" ;;
    esac
  fi

  if [ -z "$action" ]; then
    echo "  Nothing to do. Bye!"
    exit 0
  fi
else
  action="Install / update assets"
fi

declare -a install_indices=()
declare -a remove_indices=()

if [ "$action" = "Remove installed assets" ]; then
  # ── Remove mode: select from installed assets ──
  if [ "$installed_count" -eq 0 ]; then
    echo "  No installed assets to remove."
    exit 0
  fi

  if [ "$HAS_GUM" -eq 1 ]; then
    # Build lines for installed assets only
    tmpfile="$(mktemp)"
    for i in $(seq 0 $((total - 1))); do
      [ "${ITEM_STATUS[$i]}" != "installed" ] && continue
      printf "%d|[%s]  %-28s  %s\n" "$i" "${ITEM_CATEGORY[$i]}" "${ITEM_SLUG[$i]}" "${ITEM_DESC[$i]}" >> "$tmpfile"
    done

    printf "  ${GRAY}Space to select · Enter to confirm${RESET}\n\n"
    selected="$(gum filter \
      --no-limit \
      --height 15 \
      --header "Select assets to remove" \
      --header.foreground 214 \
      --indicator "▸" \
      --indicator.foreground 214 \
      --selected-prefix "✓ " \
      --selected-indicator.foreground 214 \
      --unselected-prefix "  " \
      --match.foreground 214 < "$tmpfile")" || selected=""
    rm -f "$tmpfile"

    if [ -z "$selected" ]; then
      echo "  Nothing selected. Bye!"
      exit 0
    fi

    while IFS= read -r sel_line; do
      idx="${sel_line%%|*}"
      remove_indices+=("$idx")
    done <<< "$selected"
  else
    # Bash remove menu
    num=0
    declare -a remove_map=()
    for i in $(seq 0 $((total - 1))); do
      [ "${ITEM_STATUS[$i]}" != "installed" ] && continue
      num=$((num + 1))
      remove_map+=("$i")
      printf "  ${WHITE}%2d)${RESET}  ${BOLD}%-28s${RESET}  ${GRAY}%s${RESET}\n" "$num" "${ITEM_SLUG[$i]}" "${ITEM_DESC[$i]}"
    done

    echo ""
    printf "  ${AMBER}▸${RESET} Enter numbers (space-separated), ${BOLD}'all'${RESET}, or ${BOLD}'q'${RESET} to quit: "
    read -r selection < "$TTY_INPUT"

    if [ -z "$selection" ] || [ "$selection" = "q" ] || [ "$selection" = "Q" ]; then
      echo "  Nothing to remove. Bye!"
      exit 0
    fi

    if [ "$selection" = "all" ] || [ "$selection" = "ALL" ]; then
      remove_indices=("${remove_map[@]}")
    else
      for token in $selection; do
        if ! echo "$token" | grep -qE '^[0-9]+$'; then
          warn "Skipping invalid input: $token"
          continue
        fi
        map_idx=$((token - 1))
        if [ "$map_idx" -lt 0 ] || [ "$map_idx" -ge "${#remove_map[@]}" ]; then
          warn "Skipping out-of-range: $token"
          continue
        fi
        remove_indices+=("${remove_map[$map_idx]}")
      done
    fi
  fi

else
  # ── Install / update mode ──
  if [ "$HAS_GUM" -eq 1 ]; then
    # Build lines with install status markers and write to temp file
    tmpfile="$(mktemp)"
    for i in $(seq 0 $((total - 1))); do
      cat_label=""
      case "${ITEM_CATEGORY[$i]}" in
        skills)    cat_label="skill " ;;
        agents)    cat_label="agent " ;;
        *)         cat_label="${ITEM_CATEGORY[$i]}" ;;
      esac
      status_mark=""
      if [ "${ITEM_STATUS[$i]}" = "installed" ]; then
        status_mark="↻ "
      else
        status_mark="  "
      fi
      printf "%d|%s[%s]  %-28s  %s\n" "$i" "$status_mark" "$cat_label" "${ITEM_SLUG[$i]}" "${ITEM_DESC[$i]}" >> "$tmpfile"
    done

    printf "  ${GRAY}Arrow keys to navigate · Space to select · Enter to confirm${RESET}\n"
    printf "  ${GRAY}↻ = already installed (select to update)${RESET}\n\n"

    selected="$(gum filter \
      --no-limit \
      --height 15 \
      --header "Select assets to install / update" \
      --header.foreground 214 \
      --indicator "▸" \
      --indicator.foreground 214 \
      --selected-prefix "✓ " \
      --selected-indicator.foreground 214 \
      --unselected-prefix "  " \
      --match.foreground 214 < "$tmpfile")" || selected=""
    rm -f "$tmpfile"

    if [ -z "$selected" ]; then
      echo "  Nothing selected. Bye!"
      exit 0
    fi

    # Map selected lines back to indices (extract the index prefix)
    while IFS= read -r sel_line; do
      idx="${sel_line%%|*}"
      install_indices+=("$idx")
    done <<< "$selected"

  else
    # ── Bash: improved numbered menu ──
    prev_cat=""
    for i in $(seq 0 $((total - 1))); do
      cat_raw="${ITEM_CATEGORY[$i]}"
      grp="${ITEM_GROUP[$i]}"
      if [ "$cat_raw" = "agents" ]; then
        header="Agents"
      else
        grp_label="$(echo "$grp" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')"
        header="Skills › ${grp_label}"
      fi

      if [ "$header" != "$prev_cat" ]; then
        [ -n "$prev_cat" ] && echo ""
        printf "  ${AMBER}${BOLD}%s${RESET}\n" "$header"
        printf "  ${GRAY}────────────────────────────────────────${RESET}\n"
        prev_cat="$header"
      fi

      num=$((i + 1))
      status_mark=""
      if [ "${ITEM_STATUS[$i]}" = "installed" ]; then
        status_mark=" ${GREEN}✓${RESET}"
      fi
      printf "  ${WHITE}%2d)${RESET}%b  ${BOLD}%-28s${RESET}  ${GRAY}%s${RESET}\n" "$num" "$status_mark" "${ITEM_SLUG[$i]}" "${ITEM_DESC[$i]}"
    done

    echo ""
    if [ "$installed_count" -gt 0 ]; then
      printf "  ${GRAY}✓ = already installed (select to update)${RESET}\n"
    fi
    printf "  ${AMBER}▸${RESET} Enter numbers (space-separated), ${BOLD}'all'${RESET}, or ${BOLD}'q'${RESET} to quit: "
    read -r selection < "$TTY_INPUT"

    if [ -z "$selection" ] || [ "$selection" = "q" ] || [ "$selection" = "Q" ]; then
      echo "  Nothing to install. Bye!"
      exit 0
    fi

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
        idx=$((token - 1))
        if [ "$idx" -lt 0 ] || [ "$idx" -ge "$total" ]; then
          warn "Skipping out-of-range: $token"
          continue
        fi
        install_indices+=("$idx")
      done
    fi
  fi
fi

if [ ${#install_indices[@]} -eq 0 ] && [ ${#remove_indices[@]} -eq 0 ]; then
  echo "  Nothing selected. Bye!"
  exit 0
fi

# ── Resolve dependencies for selected agents ────────────────────────────────
final_indices=()
for idx in "${install_indices[@]}"; do
  final_indices+=("$idx")
  if [ "${ITEM_CATEGORY[$idx]}" = "agents" ]; then
    dep_indices=()
    visited_deps=()
    resolve_deps "$idx"
    for dep_idx in "${dep_indices[@]}"; do
      # Add if not already selected and not already installed
      already=0
      for existing in "${final_indices[@]}"; do
        [ "$existing" = "$dep_idx" ] && already=1 && break
      done
      if [ "$already" -eq 0 ] && [ "${ITEM_STATUS[$dep_idx]}" != "installed" ]; then
        final_indices+=("$dep_idx")
      fi
    done
  fi
done

# Show dependency summary if any deps were added
dep_count=$(( ${#final_indices[@]} - ${#install_indices[@]} ))
if [ "$dep_count" -gt 0 ]; then
  echo ""
  info "Resolving dependencies: $dep_count additional item(s) will be installed"
  for idx in "${final_indices[@]}"; do
    # Check if this was an auto-resolved dependency
    is_dep=1
    for orig in "${install_indices[@]}"; do
      [ "$orig" = "$idx" ] && is_dep=0 && break
    done
    if [ "$is_dep" -eq 1 ]; then
      printf "    ${GRAY}+ [%s] %s${RESET}\n" "${ITEM_CATEGORY[$idx]}" "${ITEM_SLUG[$idx]}"
    fi
  done
  echo ""
fi
install_indices=("${final_indices[@]}")

# ── Step 7: Remove selected items ────────────────────────────────────────────
echo ""
declare -a summary=()

for idx in "${remove_indices[@]}"; do
  cat="${ITEM_CATEGORY[$idx]}"
  slug="${ITEM_SLUG[$idx]}"

  case "$cat" in
    skills|agents)
      target_link="$SKILLS_DIR/$slug"
      if [ -L "$target_link" ]; then
        rm "$target_link"
        summary+=("$(printf "${RED}✗${RESET}  %-12s  %-28s  removed" "[$cat]" "$slug")")
      elif [ -d "$target_link" ]; then
        warn "$slug is a directory (not a symlink) -- skipping removal"
        summary+=("$(printf "${YELLOW}–${RESET}  %-12s  %-28s  skipped (not a symlink)" "[$cat]" "$slug")")
      else
        summary+=("$(printf "${YELLOW}–${RESET}  %-12s  %-28s  not found" "[$cat]" "$slug")")
      fi
      ;;
    *)
      warn "Removal is only supported for skills and agents"
      ;;
  esac
done

# ── Step 8: Install selected items ───────────────────────────────────────────
for idx in "${install_indices[@]}"; do
  cat="${ITEM_CATEGORY[$idx]}"
  slug="${ITEM_SLUG[$idx]}"
  desc="${ITEM_DESC[$idx]}"
  group="${ITEM_GROUP[$idx]}"
  item_path="${ITEM_PATH[$idx]}"
  src="$CACHE_DIR/$item_path"

  if [ ! -f "$src" ]; then
    warn "Source not found: $src -- skipping $slug"
    continue
  fi

  is_update="no"
  [ "${ITEM_STATUS[$idx]}" = "installed" ] && is_update="yes"

  case "$cat" in
    skills|agents)
      skill_src_dir="$(dirname "$src")"
      target_link="$SKILLS_DIR/$slug"
      mkdir -p "$SKILLS_DIR"

      if [ -L "$target_link" ]; then
        rm "$target_link"
      elif [ -d "$target_link" ]; then
        summary+=("$(printf "${YELLOW}–${RESET}  %-12s  %-28s  skipped (dir exists)" "[$cat]" "$slug")")
        continue
      fi

      ln -s "$skill_src_dir" "$target_link"
      if [ "$is_update" = "yes" ]; then
        summary+=("$(printf "${GREEN}↻${RESET}  %-12s  %-28s  updated → %s" "[$cat]" "$slug" "$target_link")")
      else
        summary+=("$(printf "${GREEN}✓${RESET}  %-12s  %-28s  → %s" "[$cat]" "$slug" "$target_link")")
      fi
      ;;
  esac
done

# ── Step 9: Print summary ────────────────────────────────────────────────────
echo ""
if [ ${#summary[@]} -eq 0 ]; then
  printf "  Nothing was installed.\n"
else
  if [ "$HAS_GUM" -eq 1 ]; then
    summary_text=""
    for line in "${summary[@]}"; do
      summary_text+="$(printf '%b' "$line")"$'\n'
    done
    printf '%s' "$summary_text" | gum style \
      --border rounded \
      --border-foreground 214 \
      --padding "1 2"
  else
    printf "  ${AMBER}${BOLD}Installation Summary${RESET}\n"
    printf "  ${GRAY}────────────────────────────────────────────────────────────${RESET}\n"
    for line in "${summary[@]}"; do
      printf "  %b\n" "$line"
    done
    printf "  ${GRAY}────────────────────────────────────────────────────────────${RESET}\n"
  fi
fi
echo ""
