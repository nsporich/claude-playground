#!/usr/bin/env bash
#
# install.sh -- Agents Assemble: pick your team, deploy your agents
#
# Usage:
#   curl -fsSL assemble.sporich.dev/install.sh | bash
#
set -euo pipefail

# ── Flags ─────────────────────────────────────────────────────────────────────
UNINSTALL=0
for arg in "$@"; do
  case "$arg" in
    --uninstall) UNINSTALL=1 ;;
  esac
done

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

# ── Uninstall mode ────────────────────────────────────────────────────────────
if [ "$UNINSTALL" -eq 1 ]; then
  CACHE_DIR="$HOME/.agents-assemble"
  SKILLS_DIR="$HOME/.claude/skills"

  echo ""
  printf "  ${BOLD}${WHITE}DISBAND THE TEAM${RESET}\n"
  printf "  ${GRAY}──────────────────────────────────────────────${RESET}\n"

  # Find installed agents-assemble symlinks
  removed=0
  if [ -d "$SKILLS_DIR" ]; then
    for link in "$SKILLS_DIR"/*/; do
      link="${link%/}"
      [ -L "$link" ] || continue
      target="$(readlink "$link")"
      case "$target" in
        */.agents-assemble/*)
          slug="$(basename "$link")"
          printf "  ${RED}✗${RESET}  %s\n" "$slug"
          removed=$((removed + 1))
          ;;
      esac
    done
  fi

  if [ "$removed" -eq 0 ]; then
    echo ""
    info "No agents-assemble assets found. Nothing to remove."
    echo ""
    exit 0
  fi

  echo ""
  printf "  ${YELLOW}This will remove ${BOLD}$removed${RESET}${YELLOW} assets and the local cache.${RESET}\n"
  printf "\n  ${RED}▸${RESET} Disband the entire team? [y/${BOLD}N${RESET}]: "
  read -r confirm < "$TTY_INPUT"

  case "$confirm" in
    y|Y|yes|YES)
      for link in "$SKILLS_DIR"/*/; do
        link="${link%/}"
        [ -L "$link" ] || continue
        target="$(readlink "$link")"
        case "$target" in
          */.agents-assemble/*) rm "$link" ;;
        esac
      done
      rm -rf "$CACHE_DIR"
      echo ""
      ok "Team disbanded. All agents and skills removed."
      echo ""
      ;;
    *)
      echo ""
      info "Aborted. Your team is still deployed."
      echo ""
      ;;
  esac
  exit 0
fi

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
      "Assembling your team."
  else
    printf "${RED}  ╭──────────────────────────────────────╮${RESET}\n"
    printf "${RED}  │${RESET}                                      ${RED}│${RESET}\n"
    printf "${RED}  │${RESET}    ${BOLD}${WHITE}AGENTS ASSEMBLE${RESET}                   ${RED}│${RESET}\n"
    printf "${RED}  │${RESET}    ${GRAY}───────────────────${RESET}               ${RED}│${RESET}\n"
    printf "${RED}  │${RESET}    ${GRAY}Assembling your team.${RESET}             ${RED}│${RESET}\n"
    printf "${RED}  │${RESET}                                      ${RED}│${RESET}\n"
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

# ── Step 5: Resolve all agents and skills ────────────────────────────────────
# Install everything — no selection needed
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

  list_contains "$slug" "${visited[@]+"${visited[@]}"}" && return
  visited+=("$slug")

  if ! list_contains "$slug" "${needed_agent_slugs[@]+"${needed_agent_slugs[@]}"}"; then
    needed_agent_slugs+=("$slug")
    needed_agent_idxs+=("$idx")
  fi

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

  if [ -n "${AGENT_REQ_AGENTS[$idx]}" ]; then
    IFS=',' read -ra agents <<< "${AGENT_REQ_AGENTS[$idx]}"
    for a in "${agents[@]}"; do
      a="$(echo "$a" | tr -d ' ')"
      [ -z "$a" ] && continue
      for j in $(seq 0 $((agent_count - 1))); do
        if [ "${AGENT_SLUG[$j]}" = "$a" ]; then
          resolve_agent "$j"
          break
        fi
      done
    done
  fi
}

for i in $(seq 0 $((agent_count - 1))); do
  resolve_agent "$i"
done

# ── Step 6: Scan installed state ─────────────────────────────────────────────
declare -a agent_status=()  # "current", "update", or "deploy"
update_count=0
deploy_count=0

for i in $(seq 0 $((${#needed_agent_slugs[@]} - 1))); do
  slug="${needed_agent_slugs[$i]}"
  idx="${needed_agent_idxs[$i]}"
  target="$SKILLS_DIR/$slug"
  src="$CACHE_DIR/${AGENT_PATH[$idx]}"
  src_dir="$(dirname "$src")"

  if [ -L "$target" ]; then
    existing="$(readlink "$target")"
    if [ "$existing" = "$src_dir" ]; then
      agent_status+=("current")
    else
      agent_status+=("update")
      update_count=$((update_count + 1))
    fi
  elif [ -d "$target" ]; then
    agent_status+=("update")
    update_count=$((update_count + 1))
  else
    agent_status+=("deploy")
    deploy_count=$((deploy_count + 1))
  fi
done

declare -a skill_status=()
for slug in "${needed_skill_list[@]+"${needed_skill_list[@]}"}"; do
  target="$SKILLS_DIR/$slug"
  if [ -L "$target" ] || [ -d "$target" ]; then
    skill_status+=("current")
  else
    skill_status+=("deploy")
    deploy_count=$((deploy_count + 1))
  fi
done

# ── Step 7: Show roster ──────────────────────────────────────────────────────
show_banner

printf "  ${BOLD}${WHITE}ASSEMBLING YOUR TEAM${RESET}\n"
printf "  ${GRAY}──────────────────────────────────────────────${RESET}\n"

for i in $(seq 0 $((${#needed_agent_slugs[@]} - 1))); do
  slug="${needed_agent_slugs[$i]}"
  idx="${needed_agent_idxs[$i]}"
  name="${AGENT_NAME[$idx]}"
  desc="${AGENT_DESC[$idx]}"
  status="${agent_status[$i]}"

  # Icon: ★ for Director, ✓ for installed, + for new
  if [ "$slug" = "director" ]; then
    icon="${YELLOW}★${RESET}"
  elif [ "$status" = "deploy" ]; then
    icon="${GREEN}+${RESET}"
  else
    icon="${GREEN}✓${RESET}"
  fi

  # Status label
  case "$status" in
    current) status_label="${GREEN}✓ current${RESET}" ;;
    update)  status_label="${CYAN}↑ update${RESET}" ;;
    deploy)  status_label="${GREEN}+ deploy${RESET}" ;;
  esac

  # Extract codename from description (text before the em dash)
  title="$(echo "$desc" | sed 's/ — .*//')"

  printf "  %b  ${BOLD}%-14s${RESET}${GRAY}%-22s${RESET} %b\n" "$icon" "$name" "$title" "$status_label"
done

printf "  ${GRAY}──────────────────────────────────────────────${RESET}\n"

# Summary line
if [ "$update_count" -eq 0 ] && [ "$deploy_count" -eq 0 ]; then
  echo ""
  ok "All agents current — nothing to do."
  echo ""
  exit 0
fi

parts=()
[ "$update_count" -gt 0 ] && parts+=("$update_count update$([ "$update_count" -ne 1 ] && echo 's')")
[ "$deploy_count" -gt 0 ] && parts+=("$deploy_count new deployment$([ "$deploy_count" -ne 1 ] && echo 's')")
summary_line="$(IFS=' • '; echo "${parts[*]}")"
printf "  ${GRAY}%s${RESET}\n" "$summary_line"

echo ""

# ── Step 8: Confirm ──────────────────────────────────────────────────────────
printf "  ${RED}▸${RESET} Assemble the team? [${BOLD}Y${RESET}/n]: "
read -r confirm < "$TTY_INPUT"

case "$confirm" in
  n|N|no|NO)
    echo ""
    info "Aborted. Run again when you're ready, commander."
    echo ""
    exit 0
    ;;
esac

echo ""

# ── Step 9: Install everything ───────────────────────────────────────────────
mkdir -p "$SKILLS_DIR"

declare -a summary=()

# Install skills first
for i in $(seq 0 $((${#needed_skill_list[@]} - 1))); do
  slug="${needed_skill_list[$i]}"
  status="${skill_status[$i]}"

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

  if [ "$status" = "current" ]; then
    continue
  fi

  is_update="no"
  if [ -L "$target" ]; then
    rm "$target"
    is_update="yes"
  fi

  ln -s "$src_dir" "$target"
  if [ "$is_update" = "yes" ]; then
    summary+=("$(printf "${CYAN}↻${RESET}  %-14s  ${GRAY}skill updated${RESET}" "$slug")")
  else
    summary+=("$(printf "${GREEN}✓${RESET}  %-14s  ${GRAY}skill deployed${RESET}" "$slug")")
  fi
done

# Install agents
for i in $(seq 0 $((${#needed_agent_slugs[@]} - 1))); do
  slug="${needed_agent_slugs[$i]}"
  idx="${needed_agent_idxs[$i]}"
  status="${agent_status[$i]}"
  src="$CACHE_DIR/${AGENT_PATH[$idx]}"
  src_dir="$(dirname "$src")"
  target="$SKILLS_DIR/$slug"

  if [ ! -f "$src" ]; then
    warn "Source not found: $src -- skipping"
    continue
  fi

  if [ "$status" = "current" ]; then
    continue
  fi

  is_update="no"
  if [ -L "$target" ]; then
    rm "$target"
    is_update="yes"
  fi

  ln -s "$src_dir" "$target"
  if [ "$is_update" = "yes" ]; then
    summary+=("$(printf "${CYAN}↻${RESET}  %-14s  ${GRAY}agent updated${RESET}" "$slug")")
  else
    summary+=("$(printf "${GREEN}✓${RESET}  %-14s  ${GRAY}agent deployed${RESET}" "$slug")")
  fi
done

# ── Step 10: Summary ─────────────────────────────────────────────────────────
printf "  ${BOLD}${WHITE}DEPLOYMENT COMPLETE${RESET}\n"
printf "  ${GRAY}──────────────────────────────────────────────${RESET}\n"
for line in "${summary[@]}"; do
  printf "  %b\n" "$line"
done
printf "  ${GRAY}──────────────────────────────────────────────${RESET}\n"
echo ""
printf "  ${BOLD}${WHITE}Your team is assembled.${RESET}\n"
printf "  ${GRAY}Open Claude Code and type ${WHITE}/director${GRAY} to start.${RESET}\n"
echo ""
