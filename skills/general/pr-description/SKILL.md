---
name: pr-description
description: Generate well-structured PR descriptions from diff context
tags: [git, pr, general]
---

# PR Description Generator Skill

Generate a well-structured pull request description from the current branch's diff against its base branch.

## Workflow

### Step 1: Determine the Base Branch

Identify the base branch to diff against:

1. Check if the user specified a base branch. If so, use it.
2. Otherwise, detect the default branch:
   ```bash
   git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'
   ```
3. If that fails, try `main`, then `master`, then `develop`.

Store the result as `BASE_BRANCH`.

### Step 2: Gather Diff Context

Run the following commands to collect all relevant information:

```bash
# Full diff of all changes on this branch vs the base
git diff $BASE_BRANCH...HEAD

# List of changed files with stats
git diff $BASE_BRANCH...HEAD --stat

# All commit messages on this branch
git log $BASE_BRANCH..HEAD --format="%h %s%n%b" --reverse

# Current branch name
git branch --show-current
```

If the diff is very large (more than 50 files changed), also run:
```bash
# Just file names grouped by directory for a high-level view
git diff $BASE_BRANCH...HEAD --name-only | sort
```

### Step 3: Analyze the Changes

Review the collected information and categorize:

1. **What changed** -- Identify the primary purpose (feature, bugfix, refactor, chore, docs, etc.)
2. **Why it changed** -- Infer from commit messages and code context
3. **What areas are affected** -- Group changes by module, feature area, or concern
4. **Testing** -- Look for new or modified test files, test helpers, or test configuration
5. **Breaking changes** -- Look for:
   - Changed public API signatures or return types
   - Removed or renamed exports, endpoints, or database columns
   - Changed configuration formats or environment variables
   - Major dependency version bumps
   - Migration files

### Step 4: Generate the PR Description

Output the PR description in this format, ready to copy-paste:

```markdown
## Summary

[1-3 sentences describing what this PR does and why. Be specific -- "Adds rate limiting to the /api/upload endpoint to prevent abuse" not "Updates API".]

## Changes

[Group related changes under sub-headings. Use bullet points. Be specific but concise.]

### [Area/Module 1]
- [Change description with relevant detail]
- [Change description]

### [Area/Module 2]
- [Change description]

## Testing

[Describe how the changes were tested or should be tested. Include any of the following that apply:]

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed -- [describe steps]
- [ ] No testing required -- [explain why, e.g., docs-only change]

## Breaking Changes

[If none, write "None." If there are breaking changes, describe each one:]

- **[What broke]:** [Description of the change and what consumers need to do to migrate]
```

### Step 5: Add Optional Sections

Include these sections only when relevant:

**Dependencies** -- If `package.json`, `Cargo.toml`, `go.mod`, or similar files changed:
```markdown
## Dependencies

- Added `package-name@version` -- [why]
- Updated `package-name` from X to Y -- [why]
- Removed `package-name` -- [why]
```

**Migration Steps** -- If there are database migrations, config changes, or manual steps needed:
```markdown
## Migration Steps

1. [Step with specific command or action]
2. [Step]
```

**Screenshots** -- If UI changes are involved:
```markdown
## Screenshots

[Remind the author to add before/after screenshots here]
```

### Rules

- Write in a clear, direct tone. Avoid filler phrases like "This PR aims to..." -- just say what it does.
- Be specific. Reference actual file names, function names, and endpoints rather than vague descriptions.
- If the diff is trivial (e.g., a one-line typo fix), generate a proportionally short description. Do not over-elaborate.
- Keep bullet points to one line each when possible. Details go in sub-bullets if needed.
- If commit messages are well-written, use them as source material for the description.
- Do not include implementation details that are obvious from the code (e.g., "Added import for X") -- focus on intent and impact.
- Output only the markdown. Do not wrap it in a code block -- the user should be able to copy it directly.
