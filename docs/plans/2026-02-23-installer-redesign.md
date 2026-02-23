# Installer Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite the installer to deploy all agents and skills by default with a rich superhero-themed roster readout, removing the selection UI entirely.

**Architecture:** The installer keeps its existing clone/catalog/parse infrastructure (Steps 1-4) but replaces the selection and deployment flow (Steps 5-10) with: scan installed state → show roster table → single confirm → install everything. A `--uninstall` flag provides a clean removal path. The getting-started page is updated to match.

**Tech Stack:** Bash (install.sh), React/Next.js (getting-started page)

---

### Task 1: Add `--uninstall` flag handling

**Files:**
- Modify: `install.sh`

**Step 1: Add uninstall flag parsing and handler**

Insert after line 8 (`set -euo pipefail`), before the Configuration section:

```bash
# ── Flags ─────────────────────────────────────────────────────────────────────
UNINSTALL=0
for arg in "$@"; do
  case "$arg" in
    --uninstall) UNINSTALL=1 ;;
  esac
done
```

Then insert after the helpers section (after the `die()` function on line 48), before Step 1:

```bash
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
```

**Step 2: Verify syntax**

```bash
bash -n install.sh && echo "Syntax OK"
```

Expected: `Syntax OK`

**Step 3: Commit**

```bash
git add install.sh
git commit -m "feat(installer): add --uninstall flag to disband entire team

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Update banner tagline

**Files:**
- Modify: `install.sh`

**Step 1: Update the banner text**

In `show_banner()`, change the gum branch tagline from:

```
"Pick your team. We handle the rest."
```

To:

```
"Assembling your team."
```

And in the non-gum branch, change:

```
    printf "${RED}  │${RESET}    ${GRAY}Pick your team. We handle${RESET}         ${RED}│${RESET}\n"
    printf "${RED}  │${RESET}    ${GRAY}the rest.${RESET}                         ${RED}│${RESET}\n"
```

To:

```
    printf "${RED}  │${RESET}    ${GRAY}Assembling your team.${RESET}             ${RED}│${RESET}\n"
    printf "${RED}  │${RESET}                                      ${RED}│${RESET}\n"
```

**Step 2: Commit**

```bash
git add install.sh
git commit -m "feat(installer): update banner tagline for all-install model

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Replace selection UI with roster table and install-all flow

This is the main rewrite. Replace everything from Step 5 through Step 10 (lines 186-517 in the current file) with the new flow.

**Files:**
- Modify: `install.sh`

**Step 1: Replace Steps 5-10**

Delete everything from the `# ── Step 5: Show the roster` comment through the end of the file. Replace with:

```bash
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

  # Extract title from description (text after the em dash)
  title="$(echo "$desc" | sed 's/.*— //')"

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
```

**Step 2: Verify syntax**

```bash
bash -n install.sh && echo "Syntax OK"
```

Expected: `Syntax OK`

**Step 3: Commit**

```bash
git add install.sh
git commit -m "feat(installer): replace selection UI with install-all roster flow

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Update getting-started page deployment sequence

**Files:**
- Modify: `web/src/app/getting-started/page.tsx`

**Step 1: Update the Deployment Sequence section**

In the Deployment Sequence card, update Step 2 from "Select your team" to reflect the new flow. Change:

- Step 2 title: "Select your team" → "Review the roster"
- Step 2 description: Update to say the installer shows all agents with their status and asks for confirmation.
- Remove the mention of entering numbers or typing `all`.

**Step 2: Build and verify**

```bash
cd web && npx next build
```

Expected: Clean build.

**Step 3: Commit**

```bash
git add web/src/app/getting-started/page.tsx
git commit -m "fix(web): update deployment sequence for install-all model

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: Copy updated install.sh to web/public

The web app serves `install.sh` from `web/public/install.sh`. The prebuild script handles this (`cp ../install.sh public/install.sh`), but verify the build copies it correctly.

**Step 1: Build and verify**

```bash
cd web && npx next build
```

Check that `web/out/install.sh` contains the updated installer.

**Step 2: Commit if needed**

If `web/public/install.sh` is stale and not auto-copied by prebuild:

```bash
cp install.sh web/public/install.sh
git add web/public/install.sh
git commit -m "chore: sync install.sh to web/public

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
