#!/usr/bin/env bash
#
# build-catalog.sh -- Walk skills/ and agents/ and produce catalog.json
# Uses only standard unix tools (awk/sed/grep).
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="$REPO_ROOT/catalog.json"

# Collect entries per category into shell variables
skills_json=""
agents_json=""

# Track agent requirements for computing used_by
# Format: "agent_slug:skill_slug" pairs
declare -a agent_skill_deps=()

parse_frontmatter() {
  local filepath="$1"
  awk 'BEGIN{found=0} /^---$/{found++; next} found==1{print} found>=2{exit}' "$filepath"
}

parse_field() {
  local frontmatter="$1"
  local field="$2"
  echo "$frontmatter" | grep "^${field}:" | sed "s/^${field}:[[:space:]]*//" | sed 's/^["'"'"']//' | sed 's/["'"'"']$//'
}

parse_array() {
  local raw="$1"
  raw="$(echo "$raw" | sed 's/^\[//' | sed 's/\]$//')"
  local json="["
  local first=1
  IFS=',' read -ra arr <<< "$raw"
  for item in "${arr[@]+"${arr[@]}"}"; do
    item="$(echo "$item" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' | sed 's/^["'"'"']//' | sed 's/["'"'"']$//')"
    if [ -n "$item" ]; then
      if [ "$first" -eq 1 ]; then
        first=0
      else
        json+=", "
      fi
      json+="\"$item\""
    fi
  done
  json+="]"
  echo "$json"
}

process_skill() {
  local filepath="$1"
  local relpath="${filepath#$REPO_ROOT/}"
  local slug
  slug="$(basename "$(dirname "$filepath")")"
  local group
  group="$(echo "$relpath" | cut -d/ -f2)"

  local frontmatter
  frontmatter="$(parse_frontmatter "$filepath")"

  local name
  name="$(parse_field "$frontmatter" "name")"
  local description
  description="$(parse_field "$frontmatter" "description")"
  local tags_raw
  tags_raw="$(parse_field "$frontmatter" "tags")"
  local tags_json
  tags_json="$(parse_array "$tags_raw")"

  # used_by will be filled in after all agents are processed
  local entry
  entry="    {\"name\": \"$name\", \"slug\": \"$slug\", \"description\": \"$description\", \"tags\": $tags_json, \"group\": \"$group\", \"path\": \"$relpath\", \"used_by\": []}"

  if [ -n "$skills_json" ]; then
    skills_json+=$',\n'
  fi
  skills_json+="$entry"
}

process_agent() {
  local filepath="$1"
  local relpath="${filepath#$REPO_ROOT/}"
  local slug
  slug="$(basename "$(dirname "$filepath")")"

  local frontmatter
  frontmatter="$(parse_frontmatter "$filepath")"

  local name
  name="$(parse_field "$frontmatter" "name")"
  local description
  description="$(parse_field "$frontmatter" "description")"
  local tags_raw
  tags_raw="$(parse_field "$frontmatter" "tags")"
  local tags_json
  tags_json="$(parse_array "$tags_raw")"

  # Parse requires.skills and requires.agents from indented YAML
  local req_skills_raw
  req_skills_raw="$(echo "$frontmatter" | awk '/^requires:/{found=1; next} found && /^  skills:/{print; next} found && /^  agents:/{next} found && /^[^ ]/{exit}' | sed 's/^  skills:[[:space:]]*//')"
  local req_agents_raw
  req_agents_raw="$(echo "$frontmatter" | awk '/^requires:/{found=1; next} found && /^  agents:/{print; next} found && /^  skills:/{next} found && /^[^ ]/{exit}' | sed 's/^  agents:[[:space:]]*//')"

  local req_skills_json
  req_skills_json="$(parse_array "$req_skills_raw")"
  local req_agents_json
  req_agents_json="$(parse_array "$req_agents_raw")"

  # Parse features
  local features_raw
  features_raw="$(parse_field "$frontmatter" "features")"
  local features_json
  features_json="$(parse_array "$features_raw")"

  # Track skill dependencies for used_by computation
  local clean_skills
  clean_skills="$(echo "$req_skills_raw" | sed 's/^\[//' | sed 's/\]$//')"
  IFS=',' read -ra skill_arr <<< "$clean_skills"
  for skill in "${skill_arr[@]+"${skill_arr[@]}"}"; do
    skill="$(echo "$skill" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' | sed 's/^["'"'"']//' | sed 's/["'"'"']$//')"
    if [ -n "$skill" ]; then
      agent_skill_deps+=("${slug}:${skill}")
    fi
  done

  local entry
  entry="    {\"name\": \"$name\", \"slug\": \"$slug\", \"description\": \"$description\", \"tags\": $tags_json, \"path\": \"$relpath\", \"requires\": {\"skills\": $req_skills_json, \"agents\": $req_agents_json}, \"features\": $features_json}"

  if [ -n "$agents_json" ]; then
    agents_json+=$',\n'
  fi
  agents_json+="$entry"
}

# Process skills
if [ -d "$REPO_ROOT/skills" ]; then
  while IFS= read -r -d '' mdfile; do
    process_skill "$mdfile"
  done < <(find "$REPO_ROOT/skills" -name 'SKILL.md' -print0 | sort -z)
fi

# Process agents in display order (new agents not in this list are appended alphabetically)
AGENT_ORDER=(ironclad deadeye aegis titan lorekeeper oracle)

if [ -d "$REPO_ROOT/agents" ]; then
  # Parallel arrays instead of associative array (Bash 3.2 compat)
  declare -a agent_file_slugs=()
  declare -a agent_file_paths=()
  while IFS= read -r -d '' mdfile; do
    aslug="$(basename "$(dirname "$mdfile")")"
    agent_file_slugs+=("$aslug")
    agent_file_paths+=("$mdfile")
  done < <(find "$REPO_ROOT/agents" -name 'AGENT.md' -print0)

  declare -a processed_agents=()

  # Process in explicit order first
  for aslug in "${AGENT_ORDER[@]}"; do
    for i in $(seq 0 $((${#agent_file_slugs[@]} - 1))); do
      if [ "${agent_file_slugs[$i]}" = "$aslug" ]; then
        process_agent "${agent_file_paths[$i]}"
        processed_agents+=("$aslug")
        break
      fi
    done
  done

  # Then any remaining agents alphabetically
  for aslug in $(printf '%s\n' "${agent_file_slugs[@]}" | sort -u); do
    already_done=0
    for p in "${processed_agents[@]+"${processed_agents[@]}"}"; do
      [ "$p" = "$aslug" ] && already_done=1 && break
    done
    [ "$already_done" -eq 1 ] && continue
    for i in $(seq 0 $((${#agent_file_slugs[@]} - 1))); do
      if [ "${agent_file_slugs[$i]}" = "$aslug" ]; then
        process_agent "${agent_file_paths[$i]}"
        break
      fi
    done
  done
fi

# Compute used_by for each skill by scanning agent_skill_deps
for dep in "${agent_skill_deps[@]}"; do
  agent_slug="${dep%%:*}"
  skill_slug="${dep#*:}"
  if echo "$skills_json" | grep -q "\"slug\": \"$skill_slug\""; then
    skills_json="$(echo "$skills_json" | awk -v slug="$skill_slug" -v agent="$agent_slug" '
    {
      if (index($0, "\"slug\": \"" slug "\"") > 0) {
        if (index($0, "\"used_by\": []") > 0) {
          gsub("\"used_by\": \\[\\]", "\"used_by\": [\"" agent "\"]")
        } else {
          match($0, /"used_by": \[[^\]]*/)
          before = substr($0, 1, RSTART + RLENGTH - 1)
          after = substr($0, RSTART + RLENGTH)
          $0 = before ", \"" agent "\"" after
        }
      }
      print
    }')"
  fi
done

# Write catalog.json
cat > "$OUTPUT" <<EOF
{
  "skills": [
${skills_json}
  ],
  "agents": [
${agents_json}
  ]
}
EOF

echo "catalog.json generated at $OUTPUT"
echo "$(grep -c '"slug"' "$OUTPUT") entries written."
