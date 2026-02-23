#!/usr/bin/env bash
#
# install.sh -- Agents Assemble: pick your team, deploy your agents
#
# Usage:
#   curl -fsSL assemble.sporich.dev/install.sh | bash
#
set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────
REPO_URL="https://github.com/nsporich/agents-assemble"
CACHE_DIR="$HOME/.agents-assemble"
SKILLS_DIR="$HOME/.claude/skills"

# ── Colors & gum detection ──────────────────────────────────────────────────
if [ -t 1 ]; then
  BOLD='\033[1m'
  DIM='\033[2m'
  RESET='\033[0m'
  RED='\033[38;5;196m'
  WHITE='\033[97m'
  GRAY='\033[38;5;245m'
  GREEN='\033[32m'
  YELLOW='\033[33m'
  CYAN='\033[36m'
else
  BOLD='' DIM='' RESET='' RED='' WHITE='' GRAY='' GREEN='' YELLOW='' CYAN=''
fi

HAS_GUM=0
command -v gum >/dev/null 2>&1 && HAS_GUM=1

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
info()  { printf "${RED}  ▸${RESET} %s\n" "$*"; }
ok()    { printf "${GREEN}  ✓${RESET} %s\n" "$*"; }
warn()  { printf "${YELLOW}  !${RESET} %s\n" "$*"; }
err()   { printf "${RED}  ✗${RESET} %s\n" "$*" >&2; }
die()   { err "$@"; exit 1; }

# ── Banner ───────────────────────────────────────────────────────────────────
show_banner() {
  echo ""
  if [ "$HAS_GUM" -eq 1 ]; then
    gum style \
      --border double \
      --border-foreground 196 \
      --foreground 196 \
      --align center \
      --width 42 \
      --padding "1 2" \
      "AGENTS ASSEMBLE" \
      "" \
      "Pick your team. We handle the rest."
  else
    printf "${RED}  ╭──────────────────────────────────────╮${RESET}\n"
    printf "${RED}  │${RESET}                                      ${RED}│${RESET}\n"
    printf "${RED}  │${RESET}    ${BOLD}${WHITE}AGENTS ASSEMBLE${RESET}                   ${RED}│${RESET}\n"
    printf "${RED}  │${RESET}    ${GRAY}───────────────────${RESET}               ${RED}│${RESET}\n"
    printf "${RED}  │${RESET}    ${GRAY}Pick your team. We handle${RESET}         ${RED}│${RESET}\n"
    printf "${RED}  │${RESET}    ${GRAY}the rest.${RESET}                         ${RED}│${RESET}\n"
    printf "${RED}  │${RESET}                                      ${RED}│${RESET}\n"
    printf "${RED}  ╰──────────────────────────────────────╯${RESET}\n"
  fi
  echo ""
}

# ── Spinner ──────────────────────────────────────────────────────────────────
run_with_spinner() {
  local msg="$1"
  shift
  if [ "$HAS_GUM" -eq 1 ]; then
    gum spin --spinner dot --title "$msg" -- "$@"
    printf "  ${GREEN}✓${RESET} %s\n" "$msg"
  else
    local frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
    local i=0
    printf "  ${RED}%s${RESET} %s" "${frames[0]}" "$msg"
    "$@" &
    local pid=$!
    while kill -0 "$pid" 2>/dev/null; do
      printf "\r  ${RED}%s${RESET} %s" "${frames[$i]}" "$msg"
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
command -v git >/dev/null 2>&1 || die "git is required but not found."

# ── Step 2: Clone or pull the repo ───────────────────────────────────────────
if [ -d "$CACHE_DIR/.git" ]; then
  run_with_spinner "Updating roster..." git -C "$CACHE_DIR" pull --ff-only --quiet 2>/dev/null || warn "Could not pull latest; using cached version."
else
  rm -rf "$CACHE_DIR"
  run_with_spinner "Fetching roster..." git clone --quiet "$REPO_URL" "$CACHE_DIR" || die "Failed to clone $REPO_URL"
fi

# ── Step 3: Build catalog if needed ──────────────────────────────────────────
CATALOG="$CACHE_DIR/catalog.json"
BUILD_SCRIPT="$CACHE_DIR/scripts/build-catalog.sh"

needs_rebuild=0
if [ ! -f "$CATALOG" ]; then
  needs_rebuild=1
else
  while IFS= read -r -d '' mdfile; do
    if [ "$mdfile" -nt "$CATALOG" ]; then
      needs_rebuild=1
      break
    fi
  done < <(find "$CACHE_DIR/skills" "$CACHE_DIR/agents" -name '*.md' -print0 2>/dev/null)
fi

if [ "$needs_rebuild" -eq 1 ]; then
  if [ -f "$BUILD_SCRIPT" ]; then
    run_with_spinner "Building catalog..." bash "$BUILD_SCRIPT"
  else
    die "catalog.json missing and build-catalog.sh not found."
  fi
fi

[ -f "$CATALOG" ] || die "catalog.json not found."

# ── Step 4: Parse catalog ────────────────────────────────────────────────────
declare -a AGENT_NAME=()
declare -a AGENT_SLUG=()
declare -a AGENT_DESC=()
declare -a AGENT_PATH=()
declare -a AGENT_REQ_SKILLS=()
declare -a AGENT_REQ_AGENTS=()

declare -a SKILL_SLUG=()
declare -a SKILL_PATH=()

current_category=""

while IFS= read -r line; do
  # Category headers (e.g. "skills": [...) don't contain "slug"
  # Data lines do — check slug first to avoid false category matches
  # (agent entries contain "skills" in their requires field)
  if ! echo "$line" | grep -q '"slug"'; then
    echo "$line" | grep -q '"skills"' && current_category="skills"
    echo "$line" | grep -q '"agents"' && current_category="agents"
    continue
  fi

  local_name="$(echo "$line" | sed 's/.*"name":[[:space:]]*"\([^"]*\)".*/\1/')"
  local_slug="$(echo "$line" | sed 's/.*"slug":[[:space:]]*"\([^"]*\)".*/\1/')"
  local_desc="$(echo "$line" | sed 's/.*"description":[[:space:]]*"\([^"]*\)".*/\1/')"
  local_path="$(echo "$line" | sed 's/.*"path":[[:space:]]*"\([^"]*\)".*/\1/')"

  if [ "$current_category" = "agents" ]; then
    local_req_skills="$(echo "$line" | sed -n 's/.*"skills":[[:space:]]*\[\([^]]*\)\].*/\1/p' | sed 's/"//g' | sed 's/[[:space:]]//g')"
    local_req_agents="$(echo "$line" | sed -n 's/.*"agents":[[:space:]]*\[\([^]]*\)\].*/\1/p' | sed 's/"//g' | sed 's/[[:space:]]//g')"

    AGENT_NAME+=("$local_name")
    AGENT_SLUG+=("$local_slug")
    AGENT_DESC+=("$local_desc")
    AGENT_PATH+=("$local_path")
    AGENT_REQ_SKILLS+=("$local_req_skills")
    AGENT_REQ_AGENTS+=("$local_req_agents")
  elif [ "$current_category" = "skills" ]; then
    SKILL_SLUG+=("$local_slug")
    SKILL_PATH+=("$local_path")
  fi
done < "$CATALOG"

agent_count=${#AGENT_SLUG[@]}
[ "$agent_count" -eq 0 ] && die "No agents found in catalog."

# ── Step 5: Show the roster ──────────────────────────────────────────────────
show_banner

# Check what's already installed
installed_agents=()
for i in $(seq 0 $((agent_count - 1))); do
  if [ -L "$SKILLS_DIR/${AGENT_SLUG[$i]}" ] || [ -d "$SKILLS_DIR/${AGENT_SLUG[$i]}" ]; then
    installed_agents+=("${AGENT_SLUG[$i]}")
  fi
done

declare -a selected_agents=()

if [ "$HAS_GUM" -eq 1 ]; then
  # ── Gum multi-select ─────────────────────────────────────────────────────
  declare -a choices=()
  declare -a preselected_args=()
  for i in $(seq 0 $((agent_count - 1))); do
    label="${AGENT_NAME[$i]} — ${AGENT_DESC[$i]}"
    choices+=("$label")
    # Pre-select already-installed agents
    for inst in "${installed_agents[@]+"${installed_agents[@]}"}"; do
      if [ "$inst" = "${AGENT_SLUG[$i]}" ]; then
        preselected_args+=(--selected "$label")
        break
      fi
    done
  done

  selection="$(printf '%s\n' "${choices[@]}" | gum choose \
    --no-limit \
    --header "Select agents to deploy (space to toggle, enter to confirm)" \
    --header.foreground 196 \
    --cursor-prefix "[ ] " \
    --selected-prefix "[✓] " \
    --unselected-prefix "[ ] " \
    "${preselected_args[@]+"${preselected_args[@]}"}" \
    < "$TTY_INPUT")" || true

  if [ -z "$selection" ]; then
    echo "  Nothing to deploy. Bye!"
    exit 0
  fi

  # Map selected lines back to indices
  while IFS= read -r sel_line; do
    [ -z "$sel_line" ] && continue
    for i in $(seq 0 $((agent_count - 1))); do
      if [ "$sel_line" = "${AGENT_NAME[$i]} — ${AGENT_DESC[$i]}" ]; then
        selected_agents+=("$i")
        break
      fi
    done
  done <<< "$selection"
else
  # ── Bash numbered list ───────────────────────────────────────────────────
  printf "  ${BOLD}${WHITE}THE ROSTER${RESET}\n"
  printf "  ${GRAY}──────────────────────────────────────────────${RESET}\n"

  for i in $(seq 0 $((agent_count - 1))); do
    num=$((i + 1))
    status_mark="  "
    for inst in "${installed_agents[@]+"${installed_agents[@]}"}"; do
      [ "$inst" = "${AGENT_SLUG[$i]}" ] && status_mark=" ${GREEN}✓${RESET}" && break
    done
    printf "  ${WHITE}%2d)${RESET}%b  ${BOLD}%-14s${RESET}  ${GRAY}%s${RESET}\n" "$num" "$status_mark" "${AGENT_NAME[$i]}" "${AGENT_DESC[$i]}"
  done

  echo ""
  if [ ${#installed_agents[@]} -gt 0 ]; then
    printf "  ${GRAY}✓ = already deployed (select to update)${RESET}\n"
  fi
  printf "\n  ${RED}▸${RESET} Select agents (space-separated), ${BOLD}'all'${RESET}, or ${BOLD}'q'${RESET} to quit: "
  read -r selection < "$TTY_INPUT"

  if [ -z "$selection" ] || [ "$selection" = "q" ] || [ "$selection" = "Q" ]; then
    echo "  Nothing to deploy. Bye!"
    exit 0
  fi

  # ── Parse selection ──────────────────────────────────────────────────────
  if [ "$selection" = "all" ] || [ "$selection" = "ALL" ]; then
    for i in $(seq 0 $((agent_count - 1))); do
      selected_agents+=("$i")
    done
  else
    for token in $selection; do
      if ! echo "$token" | grep -qE '^[0-9]+$'; then
        warn "Skipping invalid input: $token"
        continue
      fi
      idx=$((token - 1))
      if [ "$idx" -lt 0 ] || [ "$idx" -ge "$agent_count" ]; then
        warn "Skipping out-of-range: $token"
        continue
      fi
      selected_agents+=("$idx")
    done
  fi
fi

if [ ${#selected_agents[@]} -eq 0 ]; then
  echo "  Nothing selected. Bye!"
  exit 0
fi

# ── Step 7: Resolve dependencies ─────────────────────────────────────────────
# Collect all required skill slugs and agent slugs
# (Using indexed arrays for Bash 3.2 compatibility — no declare -A)
declare -a needed_skill_list=()
declare -a needed_agent_slugs=()
declare -a needed_agent_idxs=()
declare -a visited=()

list_contains() {
  local needle="$1"
  shift
  for item in "$@"; do
    [ "$item" = "$needle" ] && return 0
  done
  return 1
}

resolve_agent() {
  local idx="$1"
  local slug="${AGENT_SLUG[$idx]}"

  # Guard against circular deps
  list_contains "$slug" "${visited[@]+"${visited[@]}"}" && return
  visited+=("$slug")

  if ! list_contains "$slug" "${needed_agent_slugs[@]+"${needed_agent_slugs[@]}"}"; then
    needed_agent_slugs+=("$slug")
    needed_agent_idxs+=("$idx")
  fi

  # Required skills
  if [ -n "${AGENT_REQ_SKILLS[$idx]}" ]; then
    IFS=',' read -ra skills <<< "${AGENT_REQ_SKILLS[$idx]}"
    for s in "${skills[@]}"; do
      s="$(echo "$s" | tr -d ' ')"
      [ -z "$s" ] && continue
      if ! list_contains "$s" "${needed_skill_list[@]+"${needed_skill_list[@]}"}"; then
        needed_skill_list+=("$s")
      fi
    done
  fi

  # Required agents (recursive)
  if [ -n "${AGENT_REQ_AGENTS[$idx]}" ]; then
    IFS=',' read -ra agents <<< "${AGENT_REQ_AGENTS[$idx]}"
    for a in "${agents[@]}"; do
      a="$(echo "$a" | tr -d ' ')"
      [ -z "$a" ] && continue
      # Find the agent index
      for j in $(seq 0 $((agent_count - 1))); do
        if [ "${AGENT_SLUG[$j]}" = "$a" ]; then
          resolve_agent "$j"
          break
        fi
      done
    done
  fi
}

for idx in "${selected_agents[@]}"; do
  resolve_agent "$idx"
done

# ── Step 8: Show deployment plan ─────────────────────────────────────────────
echo ""

if [ "$HAS_GUM" -eq 1 ]; then
  # Build deployment plan text for gum style
  plan_text="DEPLOYMENT PLAN\n"
  plan_text+="──────────────────────────────────────────────\n"
  for slug in "${needed_agent_slugs[@]+"${needed_agent_slugs[@]}"}"; do
    plan_text+="●  $(printf '%-14s' "$slug")  agent\n"
  done
  for slug in "${needed_skill_list[@]+"${needed_skill_list[@]}"}"; do
    already_installed=0
    if [ -L "$SKILLS_DIR/$slug" ] || [ -d "$SKILLS_DIR/$slug" ]; then
      already_installed=1
    fi
    if [ "$already_installed" -eq 1 ]; then
      plan_text+="●  $(printf '%-14s' "$slug")  skill (installed)\n"
    else
      plan_text+="●  $(printf '%-14s' "$slug")  skill (auto)\n"
    fi
  done
  printf '%b' "$plan_text" | gum style \
    --border rounded \
    --border-foreground 196 \
    --padding "0 2"
else
  printf "  ${BOLD}${WHITE}DEPLOYMENT PLAN${RESET}\n"
  printf "  ${GRAY}──────────────────────────────────────────────${RESET}\n"

  # Agents
  for slug in "${needed_agent_slugs[@]+"${needed_agent_slugs[@]}"}"; do
    printf "  ${RED}●${RESET}  ${BOLD}%-14s${RESET}  ${GRAY}agent${RESET}\n" "$slug"
  done

  # Skills
  for slug in "${needed_skill_list[@]+"${needed_skill_list[@]}"}"; do
    already_installed=0
    if [ -L "$SKILLS_DIR/$slug" ] || [ -d "$SKILLS_DIR/$slug" ]; then
      already_installed=1
    fi
    if [ "$already_installed" -eq 1 ]; then
      printf "  ${CYAN}●${RESET}  ${DIM}%-14s${RESET}  ${GRAY}skill (installed)${RESET}\n" "$slug"
    else
      printf "  ${CYAN}●${RESET}  %-14s  ${GRAY}skill (auto)${RESET}\n" "$slug"
    fi
  done
fi

echo ""

# ── Step 9: Install everything ───────────────────────────────────────────────
mkdir -p "$SKILLS_DIR"

declare -a summary=()

# Install skills first
for slug in "${needed_skill_list[@]+"${needed_skill_list[@]}"}"; do
  # Find skill path
  skill_path=""
  for j in $(seq 0 $((${#SKILL_SLUG[@]} - 1))); do
    if [ "${SKILL_SLUG[$j]}" = "$slug" ]; then
      skill_path="${SKILL_PATH[$j]}"
      break
    fi
  done

  if [ -z "$skill_path" ]; then
    warn "Skill '$slug' not found in catalog -- skipping"
    continue
  fi

  src="$CACHE_DIR/$skill_path"
  src_dir="$(dirname "$src")"
  target="$SKILLS_DIR/$slug"

  if [ ! -f "$src" ]; then
    warn "Source not found: $src -- skipping"
    continue
  fi

  is_update="no"
  if [ -L "$target" ]; then
    rm "$target"
    is_update="yes"
  fi

  ln -s "$src_dir" "$target"
  if [ "$is_update" = "yes" ]; then
    summary+=("$(printf "${GREEN}↻${RESET}  ${CYAN}skill${RESET}   %-14s  updated" "$slug")")
  else
    summary+=("$(printf "${GREEN}✓${RESET}  ${CYAN}skill${RESET}   %-14s  deployed" "$slug")")
  fi
done

# Install agents
for i in $(seq 0 $((${#needed_agent_slugs[@]} - 1))); do
  slug="${needed_agent_slugs[$i]}"
  idx="${needed_agent_idxs[$i]}"
  src="$CACHE_DIR/${AGENT_PATH[$idx]}"
  src_dir="$(dirname "$src")"
  target="$SKILLS_DIR/$slug"

  if [ ! -f "$src" ]; then
    warn "Source not found: $src -- skipping"
    continue
  fi

  is_update="no"
  if [ -L "$target" ]; then
    rm "$target"
    is_update="yes"
  fi

  ln -s "$src_dir" "$target"
  if [ "$is_update" = "yes" ]; then
    summary+=("$(printf "${GREEN}↻${RESET}  ${RED}agent${RESET}   %-14s  updated" "$slug")")
  else
    summary+=("$(printf "${GREEN}✓${RESET}  ${RED}agent${RESET}   %-14s  deployed" "$slug")")
  fi
done

# ── Step 10: Summary ─────────────────────────────────────────────────────────
echo ""

if [ "$HAS_GUM" -eq 1 ]; then
  summary_text="DEPLOYMENT COMPLETE\n"
  summary_text+="──────────────────────────────────────────────\n"
  for line in "${summary[@]}"; do
    summary_text+="$(printf '%b' "$line")\n"
  done
  summary_text+="\nOpen Claude Code in any project to use your agents."
  printf '%b' "$summary_text" | gum style \
    --border rounded \
    --border-foreground 34 \
    --padding "0 2"
else
  printf "  ${BOLD}${WHITE}DEPLOYMENT COMPLETE${RESET}\n"
  printf "  ${GRAY}──────────────────────────────────────────────${RESET}\n"
  for line in "${summary[@]}"; do
    printf "  %b\n" "$line"
  done
  printf "  ${GRAY}──────────────────────────────────────────────${RESET}\n"
  echo ""
  printf "  ${GRAY}Open Claude Code in any project to use your agents.${RESET}\n"
fi

echo ""
