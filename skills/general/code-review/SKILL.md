---
name: code-review
description: Structured code review with severity ratings
tags: [review, general]
---

# Code Review Skill

Perform a structured code review with findings rated by severity across four dimensions: security, performance, correctness, and style.

## Workflow

### Step 1: Identify Files to Review

Determine which files to review using one of these approaches (in priority order):

1. **User-specified paths** -- If the user provided file paths or glob patterns, use those.
2. **Staged changes** -- Run `git diff --cached --name-only` to find staged files.
3. **Unstaged changes** -- Run `git diff --name-only` to find modified but unstaged files.
4. **Branch diff** -- Run `git diff main...HEAD --name-only` (or the appropriate base branch) to find all files changed on the current branch.

If no files are found, ask the user which files to review.

### Step 2: Read the Files and Diffs

For each file identified:

- Read the full file content to understand context.
- Run `git diff` (or `git diff --cached`) for that file to see the actual changes. Focus your review on the changed lines, but use the full file for context.
- Note the language/framework to apply language-specific review criteria.

### Step 3: Evaluate Across Four Dimensions

Review every changed section against each dimension. Be specific -- reference exact line numbers and code snippets.

#### 3a. Security

Look for:
- Injection vulnerabilities (SQL, XSS, command injection, template injection)
- Hardcoded secrets, API keys, credentials, or tokens
- Insecure deserialization or unsafe parsing
- Missing input validation or sanitization
- Improper authentication/authorization checks
- Path traversal or file access vulnerabilities
- Insecure use of cryptographic functions
- Exposure of sensitive data in logs, errors, or responses

#### 3b. Performance

Look for:
- N+1 query patterns or unnecessary database calls
- Missing indexes implied by new query patterns
- Unbounded loops, recursion without limits, or unbounded data fetching
- Large allocations or memory leaks (unclosed resources, event listener leaks)
- Blocking operations in async/event-loop contexts
- Redundant computation that could be cached or memoized
- Inefficient data structures for the access pattern

#### 3c. Correctness

Look for:
- Logic errors, off-by-one mistakes, incorrect boundary conditions
- Null/undefined handling gaps
- Race conditions or concurrency issues
- Unhandled error cases or swallowed exceptions
- Incorrect type assumptions or unsafe type coercion
- Missing edge cases (empty arrays, zero values, negative numbers, Unicode)
- State mutation side effects
- Broken contracts with callers (changed return types, removed fields)

#### 3d. Style

Look for:
- Naming that is unclear, misleading, or inconsistent with codebase conventions
- Functions or methods that are too long or do too many things
- Dead code, commented-out code, or leftover debug statements
- Missing or misleading documentation on public APIs
- Inconsistent formatting (only flag if no auto-formatter is configured)
- Magic numbers or strings that should be named constants
- Overly complex expressions that could be simplified

### Step 4: Rate Each Finding

Assign a severity to every finding:

| Severity | Meaning | Action Required |
|----------|---------|-----------------|
| **critical** | Bug, vulnerability, or data loss risk. Must fix before merge. | Block merge |
| **warning** | Potential issue or significant improvement. Should fix. | Strongly recommended |
| **info** | Style nit, minor suggestion, or optional improvement. | Nice to have |

### Step 5: Output the Review

Format the review as follows:

```markdown
## Code Review: [brief description of what was reviewed]

**Files reviewed:** [count]
**Findings:** [X critical, Y warnings, Z info]

---

### Critical

#### [CRITICAL-1] [Short title]
- **File:** `path/to/file.ts`, line XX
- **Dimension:** Security | Performance | Correctness | Style
- **Description:** [Clear explanation of the issue]
- **Code:**
  ```
  [the problematic code snippet]
  ```
- **Suggestion:** [Specific fix with code example if applicable]

---

### Warnings

#### [WARN-1] [Short title]
- **File:** `path/to/file.ts`, line XX
- **Dimension:** Security | Performance | Correctness | Style
- **Description:** [Clear explanation]
- **Suggestion:** [Specific fix]

---

### Info

#### [INFO-1] [Short title]
- **File:** `path/to/file.ts`, line XX
- **Dimension:** Security | Performance | Correctness | Style
- **Description:** [Clear explanation]
- **Suggestion:** [Specific improvement]

---

### Summary

[2-3 sentence overall assessment. Call out what was done well. State whether this is safe to merge or what must be addressed first.]
```

### Rules

- If there are **no critical findings**, explicitly say "No critical issues found -- safe to merge pending warning review."
- If there are **no findings at all**, say so clearly rather than inventing issues.
- Always reference specific line numbers and code.
- Provide concrete fix suggestions, not vague advice. Show corrected code when possible.
- Group multiple related findings into a single entry rather than repeating similar issues.
- Do not review auto-generated files, lock files, or vendored dependencies unless specifically asked.
