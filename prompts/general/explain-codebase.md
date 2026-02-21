---
name: Explain Codebase
description: Structured codebase tour prompt
tags: [general, onboarding]
---

# Explain This Codebase

Give me a structured tour of this codebase. Work through each section below methodically, reading files as needed to give accurate answers rather than guessing.

## 1. Project Identity

- What type of project is this? (web app, CLI tool, library, API server, monorepo, etc.)
- What programming language(s) are used?
- What framework(s) or runtime(s) does it rely on? Include version numbers from lockfiles or config.
- Is there a build step? What tooling is used (bundler, compiler, transpiler)?

## 2. Directory Structure

Map out the top-level directory structure. For each directory, explain:

- Its purpose and what kind of files live there
- Whether it is source code, configuration, generated output, or something else
- Any naming conventions that indicate its role (e.g., `src/`, `lib/`, `dist/`, `tests/`, `scripts/`)

If the project is a monorepo, explain the workspace layout and how packages relate to each other.

## 3. Key Entry Points

Identify the main entry points into the application:

- The primary entry file (e.g., `main.ts`, `index.js`, `app.py`, `cmd/main.go`)
- Configuration bootstrap files (e.g., `next.config.js`, `vite.config.ts`, `settings.py`)
- Route definitions or request handlers
- Any CLI entry points or bin scripts defined in package.json or equivalent

## 4. Request / Data Flow

Pick the most representative operation this project performs (e.g., handling an HTTP request, processing a CLI command, rendering a page) and trace the flow from start to finish:

- Where does input arrive?
- What layers does it pass through (routing, middleware, validation, business logic, data access)?
- Where does output get produced?
- Are there any async patterns, queues, or event-driven flows?

## 5. Key Dependencies

List the most important dependencies (not every single one) and explain what each is used for. Group them into categories such as:

- Framework / runtime
- Data access / ORM / database
- Authentication / authorization
- Testing
- Build tooling / dev utilities
- Any domain-specific libraries

## 6. Non-Obvious Patterns and Conventions

Highlight anything a new developer would not immediately understand by scanning the file tree:

- Custom abstractions, base classes, or decorators that are used project-wide
- Code generation steps or generated files that should not be edited by hand
- Environment variable conventions or required configuration
- Unusual file naming patterns or directory structures
- Implicit conventions enforced by linters, pre-commit hooks, or CI checks
- Any "magic" (auto-registration, dynamic imports, convention-based routing)

Format your response with clear headings and bullet points. Be specific -- reference actual file paths and names rather than speaking in generalities.
