#!/usr/bin/env bash
#
# build-catalog.sh -- Walk skills/, templates/, prompts/ and produce catalog.json
# Uses only standard unix tools (awk/sed/grep).
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="$REPO_ROOT/catalog.json"

# Collect entries per category into shell variables
skills_json=""
templates_json=""
prompts_json=""

process_file() {
  local filepath="$1"
  # Make path relative to repo root
  local relpath="${filepath#$REPO_ROOT/}"

  # Determine category (top-level dir)
  local category
  category="$(echo "$relpath" | cut -d/ -f1)"

  # Determine group (second-level dir)
  local group
  group="$(echo "$relpath" | cut -d/ -f2)"

  # Determine slug
  local slug
  if [ "$category" = "skills" ]; then
    # For skills, slug is the parent directory name (e.g. code-review from skills/general/code-review/SKILL.md)
    slug="$(basename "$(dirname "$filepath")")"
  else
    # For templates/prompts, slug is filename without .md
    slug="$(basename "$filepath" .md)"
  fi

  # Extract YAML frontmatter (lines between first and second ---)
  local frontmatter
  frontmatter="$(awk 'BEGIN{found=0} /^---$/{found++; next} found==1{print} found>=2{exit}' "$filepath")"

  # Parse name (strip surrounding quotes if present)
  local name
  name="$(echo "$frontmatter" | grep '^name:' | sed 's/^name:[[:space:]]*//' | sed 's/^["'"'"']//' | sed 's/["'"'"']$//')"

  # Parse description (strip surrounding quotes if present)
  local description
  description="$(echo "$frontmatter" | grep '^description:' | sed 's/^description:[[:space:]]*//' | sed 's/^["'"'"']//' | sed 's/["'"'"']$//')"

  # Parse tags -- extract content inside brackets, split by comma, build JSON array
  local tags_raw
  tags_raw="$(echo "$frontmatter" | grep '^tags:' | sed 's/^tags:[[:space:]]*//' | sed 's/^\[//' | sed 's/\]$//')"
  local tags_json="["
  local first=1
  IFS=',' read -ra tag_arr <<< "$tags_raw"
  for tag in "${tag_arr[@]}"; do
    tag="$(echo "$tag" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' | sed 's/^["'"'"']//' | sed 's/["'"'"']$//')"
    if [ -n "$tag" ]; then
      if [ "$first" -eq 1 ]; then
        first=0
      else
        tags_json+=", "
      fi
      tags_json+="\"$tag\""
    fi
  done
  tags_json+="]"

  # Build JSON object for this entry
  local entry
  entry="    {\"name\": \"$name\", \"slug\": \"$slug\", \"description\": \"$description\", \"tags\": $tags_json, \"group\": \"$group\", \"path\": \"$relpath\"}"

  # Append to the right category
  case "$category" in
    skills)
      if [ -n "$skills_json" ]; then
        skills_json+=$',\n'
      fi
      skills_json+="$entry"
      ;;
    templates)
      if [ -n "$templates_json" ]; then
        templates_json+=$',\n'
      fi
      templates_json+="$entry"
      ;;
    prompts)
      if [ -n "$prompts_json" ]; then
        prompts_json+=$',\n'
      fi
      prompts_json+="$entry"
      ;;
  esac
}

# Walk all three directories for .md files (excluding .gitkeep)
for dir in skills templates prompts; do
  target="$REPO_ROOT/$dir"
  if [ -d "$target" ]; then
    while IFS= read -r -d '' mdfile; do
      process_file "$mdfile"
    done < <(find "$target" -name '*.md' ! -name '.gitkeep' -print0 | sort -z)
  fi
done

# Write catalog.json
cat > "$OUTPUT" <<EOF
{
  "skills": [
${skills_json}
  ],
  "templates": [
${templates_json}
  ],
  "prompts": [
${prompts_json}
  ]
}
EOF

echo "catalog.json generated at $OUTPUT"
echo "$(grep -c '"slug"' "$OUTPUT") entries written."
