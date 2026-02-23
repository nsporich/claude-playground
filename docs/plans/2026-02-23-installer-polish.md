# Installer Output Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Polish the installer's terminal output — fix the roster title extraction, add skills count, and replace the flat deployment summary with a two-column grouped layout.

**Architecture:** Three targeted edits to `install.sh`: fix one sed pattern, update the summary line format, and rewrite the Step 10 summary block. Then sync to `web/public/install.sh`.

**Tech Stack:** Bash (install.sh)

---

### Task 1: Fix roster title extraction

The roster currently shows long descriptions (text after the em dash) instead of short codenames (text before it). Fix the sed pattern.

**Files:**
- Modify: `install.sh:383-384`

**Step 1: Fix the sed pattern**

Change line 383-384 from:

```bash
  # Extract title from description (text after the em dash)
  title="$(echo "$desc" | sed 's/.*— //')"
```

To:

```bash
  # Extract codename from description (text before the em dash)
  title="$(echo "$desc" | sed 's/ — .*//')"
```

This changes `"The commander — assembles the right team for any mission"` → `"The commander"` instead of `"assembles the right team for any mission"`.

**Step 2: Verify syntax**

```bash
bash -n install.sh && echo "Syntax OK"
```

Expected: `Syntax OK`

**Step 3: Commit**

```bash
git add install.sh
git commit -m "fix(installer): extract codename before em dash in roster display

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Add skills count to summary line

The summary line currently only shows deployment counts. Add agent and skill totals for context.

**Files:**
- Modify: `install.sh:399-403`

**Step 1: Update the summary line**

Replace lines 399-403:

```bash
parts=()
[ "$update_count" -gt 0 ] && parts+=("$update_count update$([ "$update_count" -ne 1 ] && echo 's')")
[ "$deploy_count" -gt 0 ] && parts+=("$deploy_count new deployment$([ "$deploy_count" -ne 1 ] && echo 's')")
summary_line="$(IFS=' • '; echo "${parts[*]}")"
printf "  ${GRAY}%s${RESET}\n" "$summary_line"
```

With:

```bash
# Counts line: "7 agents · 8 skills • 3 new deployments"
agent_total=${#needed_agent_slugs[@]}
skill_total=${#needed_skill_list[@]}

change_parts=()
[ "$update_count" -gt 0 ] && change_parts+=("$update_count update$([ "$update_count" -ne 1 ] && echo 's')")
[ "$deploy_count" -gt 0 ] && change_parts+=("$deploy_count new deployment$([ "$deploy_count" -ne 1 ] && echo 's')")
change_summary="$(IFS=' • '; echo "${change_parts[*]}")"

printf "  ${GRAY}%s agents · %s skills • %s${RESET}\n" "$agent_total" "$skill_total" "$change_summary"
```

**Step 2: Verify syntax**

```bash
bash -n install.sh && echo "Syntax OK"
```

Expected: `Syntax OK`

**Step 3: Commit**

```bash
git add install.sh
git commit -m "feat(installer): add agent and skill counts to roster summary line

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Replace deployment summary with two-column grouped layout

Replace the flat per-item summary list (Step 9 accumulation + Step 10 display) with a two-column AGENTS | SKILLS layout.

**Files:**
- Modify: `install.sh:425` (remove `declare -a summary=()`)
- Modify: `install.sh:466-470` (remove skill summary accumulation)
- Modify: `install.sh:498-502` (remove agent summary accumulation)
- Modify: `install.sh:505-515` (rewrite Step 10)

**Step 1: Remove summary array declaration**

Delete line 425:

```bash
declare -a summary=()
```

**Step 2: Remove skill summary accumulation in the skills install loop**

In the skills install loop (around lines 466-470), remove these lines:

```bash
  if [ "$is_update" = "yes" ]; then
    summary+=("$(printf "${CYAN}↻${RESET}  %-14s  ${GRAY}skill updated${RESET}" "$slug")")
  else
    summary+=("$(printf "${GREEN}✓${RESET}  %-14s  ${GRAY}skill deployed${RESET}" "$slug")")
  fi
```

Replace with:

```bash
  # (summary handled in Step 10)
```

**Step 3: Remove agent summary accumulation in the agents install loop**

In the agents install loop (around lines 498-502), remove these lines:

```bash
  if [ "$is_update" = "yes" ]; then
    summary+=("$(printf "${CYAN}↻${RESET}  %-14s  ${GRAY}agent updated${RESET}" "$slug")")
  else
    summary+=("$(printf "${GREEN}✓${RESET}  %-14s  ${GRAY}agent deployed${RESET}" "$slug")")
  fi
```

Replace with:

```bash
  # (summary handled in Step 10)
```

**Step 4: Rewrite Step 10 with two-column layout**

Replace lines 505-515:

```bash
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

With:

```bash
# ── Step 10: Summary ─────────────────────────────────────────────────────────
printf "  ${BOLD}${WHITE}DEPLOYMENT COMPLETE${RESET}\n"
printf "  ${GRAY}──────────────────────────────────────────────${RESET}\n"
printf "  ${BOLD}${WHITE}%-26s${RESET}${BOLD}${WHITE}%s${RESET}\n" "AGENTS" "SKILLS"

# Build arrays for two-column display
agent_total=${#needed_agent_slugs[@]}
skill_total=${#needed_skill_list[@]}
max_rows=$(( agent_total > skill_total ? agent_total : skill_total ))

for r in $(seq 0 $((max_rows - 1))); do
  left=""
  right=""

  if [ "$r" -lt "$agent_total" ]; then
    a_slug="${needed_agent_slugs[$r]}"
    a_idx="${needed_agent_idxs[$r]}"
    a_name="${AGENT_NAME[$a_idx]}"
    a_status="${agent_status[$r]}"
    if [ "$a_status" = "current" ]; then
      left="$(printf "${GREEN}✓${RESET} %s" "$a_name")"
    elif [ "$a_status" = "update" ]; then
      left="$(printf "${CYAN}↻${RESET} %s" "$a_name")"
    else
      left="$(printf "${GREEN}✓${RESET} %s" "$a_name")"
    fi
  fi

  if [ "$r" -lt "$skill_total" ]; then
    s_slug="${needed_skill_list[$r]}"
    s_status="${skill_status[$r]}"
    if [ "$s_status" = "current" ]; then
      right="$(printf "${GREEN}✓${RESET} %s" "$s_slug")"
    elif [ "$s_status" = "update" ]; then
      right="$(printf "${CYAN}↻${RESET} %s" "$s_slug")"
    else
      right="$(printf "${GREEN}✓${RESET} %s" "$s_slug")"
    fi
  fi

  # Print with fixed column width (strip ANSI for padding calculation)
  if [ -n "$left" ]; then
    a_plain="${AGENT_NAME[${needed_agent_idxs[$r]}]}"
    pad=$(( 24 - ${#a_plain} ))
    printf "  %b%*s" "$left" "$pad" ""
  else
    printf "  %26s" ""
  fi

  if [ -n "$right" ]; then
    printf "%b" "$right"
  fi
  printf "\n"
done

printf "  ${GRAY}──────────────────────────────────────────────${RESET}\n"
echo ""
printf "  ${BOLD}${WHITE}Your team is assembled.${RESET}\n"
printf "  ${GRAY}Open Claude Code and type ${WHITE}/director${GRAY} to start.${RESET}\n"
echo ""
```

**Step 5: Verify syntax**

```bash
bash -n install.sh && echo "Syntax OK"
```

Expected: `Syntax OK`

**Step 6: Commit**

```bash
git add install.sh
git commit -m "feat(installer): two-column grouped deployment summary

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Sync install.sh to web/public

**Files:**
- Modify: `web/public/install.sh`

**Step 1: Copy**

```bash
cp install.sh web/public/install.sh
```

**Step 2: Verify identical**

```bash
diff install.sh web/public/install.sh
```

Expected: no output (files identical)

**Step 3: Commit**

```bash
git add web/public/install.sh
git commit -m "chore: sync install.sh to web/public

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
