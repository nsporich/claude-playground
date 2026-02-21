---
name: NPM Package
description: CLAUDE.md for npm package development
tags: [npm, package, library]
---

# CLAUDE.md

## Project Overview

<!-- TODO: Describe what this package does and who it's for -->

[FILL IN: Brief description of the package, its purpose, and target consumers]

## Package Configuration

Ensure `package.json` includes proper entry points:

```jsonc
{
  "name": "[FILL IN: package-name or @scope/package-name]",
  "version": "0.0.0",
  "main": "./dist/index.cjs",        // CommonJS entry
  "module": "./dist/index.js",       // ESM entry
  "types": "./dist/index.d.ts",      // TypeScript declarations
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist", "README.md", "LICENSE"]
}
```

- Always define `exports` for explicit subpath control
- Include `types` condition in exports for TypeScript consumers
- Keep `files` array minimal — only ship what consumers need

## Bundling Setup

<!-- TODO: Choose your bundler and fill in details -->

- **Bundler:** [FILL IN: tsup / rollup / unbundled (tsc only)]
- **Output formats:** ESM + CJS (dual package)
- **Target:** [FILL IN: e.g., ES2020, Node 18+]

If using **tsup** (recommended for most packages):

```ts
// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
});
```

## Versioning Strategy

- Follow **semver** strictly:
  - **patch** — bug fixes, no API changes
  - **minor** — new features, backward-compatible
  - **major** — breaking changes
- Tool: [FILL IN: changesets / standard-version / manual]

<!-- If using changesets: -->
<!-- Run `npx changeset` before merging PRs with user-facing changes -->
<!-- CI runs `npx changeset version` and `npx changeset publish` on release -->

## Publishing Workflow

- **Pre-publish checks:** `prepublishOnly` script should run build + tests
- **Publish command:** `npm publish` (or `npm publish --access public` for scoped packages)
- **Dry run first:** Always verify with `npm publish --dry-run` before publishing
- **Tag releases:** Use `npm version patch|minor|major` or your versioning tool to tag

```jsonc
// Recommended package.json scripts
{
  "scripts": {
    "build": "[FILL IN]",
    "test": "[FILL IN]",
    "prepublishOnly": "npm run build && npm test",
    "release": "[FILL IN: e.g., npx changeset publish]"
  }
}
```

## Peer Dependency Strategy

- Declare frameworks and large shared libraries as `peerDependencies` (e.g., `react`, `vue`, `angular`)
- Provide a wide peer range to maximize compatibility (e.g., `"react": "^17.0.0 || ^18.0.0 || ^19.0.0"`)
- Add the same packages to `devDependencies` for local development and testing
- Only use `dependencies` for packages your library bundles or directly requires at runtime
- Document required peer dependencies clearly in README

## Testing Approach

- Write unit tests for all exported functions and public API surface
- Test both ESM and CJS entry points to catch module resolution issues
- Use [FILL IN: vitest / jest] as the test runner
- Test edge cases: invalid inputs, boundary values, error conditions
- For packages with types, verify type exports with `tsd` or `attw`
- Run tests against the built output (not just source) before publishing

## Development Commands

- **Build:** `[FILL IN]`
- **Test:** `[FILL IN]`
- **Test watch:** `[FILL IN]`
- **Lint:** `[FILL IN]`
- **Type check:** `tsc --noEmit`
- **Publish dry run:** `npm publish --dry-run`
