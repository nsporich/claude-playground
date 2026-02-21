---
name: angular-upgrade
description: Guided Angular version migration
tags: [angular, migration, upgrade]
---

# Angular Version Upgrade Skill

Guide a developer through upgrading an Angular project from its current version to a target version, handling breaking changes, dependency updates, and code migrations step by step.

## Workflow

### Step 1: Detect Current State

Read `package.json` and determine the current versions:

```bash
# Core Angular version
node -e "const p = require('./package.json'); console.log(p.dependencies['@angular/core'] || p.devDependencies['@angular/core'])"

# Angular CLI version
node -e "const p = require('./package.json'); console.log(p.devDependencies['@angular/cli'])"

# TypeScript version
node -e "const p = require('./package.json'); console.log(p.devDependencies['typescript'])"

# RxJS version
node -e "const p = require('./package.json'); console.log(p.dependencies['rxjs'])"

# Node.js version
node --version
```

Also check for:
- **Angular Material**: `@angular/material` and `@angular/cdk` versions
- **NgRx**: `@ngrx/store` and related packages
- **Other Angular ecosystem packages**: `@angular/fire`, `@angular-eslint/*`, `@angular/pwa`, etc.
- **Build system**: Check if using `@angular-devkit/build-angular` or `@angular/build` (v18+)

Record the current major version as `CURRENT` and ask the user for the target version (or assume latest stable).

### Step 2: Plan the Upgrade Path

Angular supports upgrading one major version at a time. If upgrading across multiple major versions, plan the sequential path:

- Example: v14 -> v18 means upgrades through v14->v15, v15->v16, v16->v17, v17->v18.

For each version hop, reference the Angular Update Guide at:
`https://angular.dev/update-guide?v=CURRENT-TARGET&l=3`

Provide the user with the full upgrade path before starting.

### Step 3: Execute Each Version Hop

For each major version increment, follow these sub-steps:

#### 3a. Pre-Upgrade Checks

```bash
# Ensure clean working tree
git status

# Run existing tests to establish baseline
ng test --watch=false --browsers=ChromeHeadless 2>/dev/null || npm test

# Build to confirm current state compiles
ng build 2>/dev/null || npm run build
```

If tests or build fail, stop and notify the user. Do not upgrade on a broken baseline.

#### 3b. Run ng update

Execute the Angular CLI update command for the target minor version:

```bash
# Update Angular core and CLI first
npx @angular/cli@TARGET update @angular/core@TARGET @angular/cli@TARGET

# If Angular Material is used
npx @angular/cli@TARGET update @angular/material@TARGET
```

Replace `TARGET` with the specific major version (e.g., `16`, `17`, `18`).

Review any automatic migrations that ran. The CLI will print a summary.

#### 3c. Handle Version-Specific Breaking Changes

Apply the relevant set of manual changes based on the version being upgraded to:

**v15 -> v16:**
- Angular requires Node.js 16.14+ and TypeScript 4.9+
- `RouterModule` deprecated lazy loading with string syntax -- use `loadComponent` / `loadChildren` with dynamic imports
- `@angular/common/http` deprecations: `HttpClientModule` can be replaced with `provideHttpClient()`
- Angular Compiler option `enableIvy` removed (Ivy is the only engine)

**v16 -> v17:**
- New control flow syntax available (`@if`, `@for`, `@switch`) -- optional but recommended
- Run the schematic to migrate: `ng generate @angular/core:control-flow`
- `NgModule`-based bootstrapping deprecated in favor of standalone
- Vite/esbuild is the new default dev server (opt out with `"builder": "@angular-devkit/build-angular:browser"` if needed)
- Run `ng generate @angular/core:standalone` to begin standalone migration

**v17 -> v18:**
- Zoneless change detection available as experimental (`provideExperimentalZonelessChangeDetection()`)
- New build system `@angular/build` replaces `@angular-devkit/build-angular` for new projects
- `HttpClientModule` removed -- must use `provideHttpClient()` in standalone providers
- Route-level `canActivate` etc. support functional guards (class-based still works)
- Signal inputs, signal queries, and model inputs are stable

**v18 -> v19:**
- Standalone is now the default. `standalone: true` no longer required in decorator (it is implied).
- Signal-based inputs, outputs, and queries are the recommended pattern.
- `linkedSignal` and `resource` API introduced (experimental).
- Incremental hydration available for SSR apps.
- Karma deprecated in favor of Web Test Runner or Jest. Run `ng generate @angular/core:web-test-runner` to migrate.

#### 3d. Update RxJS

RxJS compatibility matrix:
| Angular | RxJS |
|---------|------|
| 15 | 7.x |
| 16 | 7.x |
| 17 | 7.x |
| 18 | 7.x |
| 19 | 7.x |

If upgrading RxJS from 6.x to 7.x (relevant for Angular <15 upgrades):
```bash
npm install rxjs@7
```

Key RxJS 7 breaking changes:
- `toPromise()` removed -- use `firstValueFrom()` or `lastValueFrom()`
- `Observable.create()` removed -- use `new Observable()`
- Several deprecated operators removed: `pluck` (use `map`), `tap` signature changes
- `TestScheduler.run()` callback is now required for marble tests

#### 3e. Update Third-Party Dependencies

After each Angular version hop, check and update ecosystem packages:

```bash
# Check for outdated packages
npm outdated

# Update Angular ecosystem packages to compatible versions
npm install @angular-eslint/builder@TARGET @angular-eslint/eslint-plugin@TARGET @angular-eslint/schematics@TARGET 2>/dev/null
npm install @ngrx/store@TARGET @ngrx/effects@TARGET @ngrx/entity@TARGET @ngrx/store-devtools@TARGET 2>/dev/null
```

For each third-party package, check its own release notes for Angular compatibility.

#### 3f. Verify the Upgrade

After each version hop:

```bash
# Install dependencies cleanly
rm -rf node_modules package-lock.json
npm install

# Build
ng build

# Run tests
ng test --watch=false --browsers=ChromeHeadless 2>/dev/null || npm test

# Run linting
ng lint 2>/dev/null || npm run lint
```

Fix any errors before proceeding to the next version hop.

#### 3g. Commit the Version Hop

```bash
git add -A
git commit -m "chore: upgrade Angular from vCURRENT to vTARGET"
```

### Step 4: Post-Upgrade Recommendations

After all version hops are complete, suggest optional modernization steps:

1. **Standalone migration** (v16+): Convert NgModules to standalone components if not already done.
2. **Control flow migration** (v17+): Migrate `*ngIf`, `*ngFor`, `*ngSwitch` to `@if`, `@for`, `@switch`.
3. **Signal adoption** (v17+): Migrate key state management to Signals where it simplifies code.
4. **Inject function** (v14+): Replace constructor injection with `inject()` for cleaner code.
5. **Functional guards/resolvers** (v15+): Replace class-based guards with functional ones.
6. **New build system** (v17+): Switch to the esbuild/Vite-based builder for faster builds.

### Rules

- Always upgrade one major version at a time. Never skip versions.
- Always commit after each successful version hop so the user can revert if a later step fails.
- If `ng update` suggests running schematics, always run them.
- If a step fails, provide the exact error and a targeted fix rather than generic advice.
- Do not modify code unrelated to the upgrade.
- If the project uses a monorepo tool (Nx, Lerna), note that `ng update` may not apply -- recommend the tool-specific upgrade command (e.g., `nx migrate`).
