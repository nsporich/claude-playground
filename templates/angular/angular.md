---
name: Angular
description: CLAUDE.md for Angular projects
tags: [angular, frontend]
---

# CLAUDE.md

## Project Overview

<!-- TODO: Describe what this Angular application does -->

[FILL IN: Brief description of the application and its purpose]

## Tech Stack

- **Framework:** Angular [FILL IN: version]
- **Language:** TypeScript
- **Styling:** [FILL IN: CSS / SCSS / Tailwind]
- **State Management:** [FILL IN: NgRx / Signals / Services]
- **Testing:** Jasmine + Karma / Jest
- **E2E:** [FILL IN: Cypress / Playwright]

## Project Structure

```
src/
├── app/
│   ├── core/           # Singleton services, guards, interceptors, app-wide providers
│   ├── shared/         # Reusable components, directives, pipes
│   ├── features/       # Feature modules (lazy-loaded)
│   │   ├── feature-a/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── feature-a.routes.ts
│   │   └── feature-b/
│   ├── layouts/        # Layout components (shell, sidebar, header)
│   └── app.config.ts
├── assets/
├── environments/
└── styles/
```

## Angular Conventions

- **Use standalone components** — do not use NgModules for new components
- **Prefer signals over BehaviorSubject** for reactive state
- **Use `inject()` function** instead of constructor injection
- **Use OnPush change detection** on all components (`changeDetection: ChangeDetectionStrategy.OnPush`)
- **Use the new control flow syntax** (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`
- Prefer reactive forms over template-driven forms
- Use `DestroyRef` and `takeUntilDestroyed()` for subscription cleanup
- Colocate component template and styles inline for small components; use separate files for larger ones

## NgRx Patterns

<!-- Remove this section if not using NgRx -->

- Use **feature stores** with `createFeature()` for each domain area
- Keep effects in dedicated `*.effects.ts` files
- Use **selectors** for all state access — never access store state directly
- Use `createActionGroup()` for grouping related actions
- Follow the pattern: actions describe events, reducers handle state, effects handle side effects
- Use `concatLatestFrom` instead of `withLatestFrom` in effects

## Testing Patterns

- Use `TestBed.configureTestingModule()` with standalone component imports
- Prefer **component harnesses** (`HarnessPredicate`) over querying DOM directly
- Use **Spectator** for simplified component/service testing where adopted
- Mock services with `jasmine.createSpyObj` or jest mocks
- Test component inputs/outputs, not internal implementation
- For services, test the public API; mock HTTP calls with `HttpTestingController`

## Development Commands

- **Dev server:** `ng serve` (default: http://localhost:4200)
- **Run tests:** `ng test`
- **Run single test:** `ng test --include=**/feature-name/**`
- **Build:** `ng build`
- **Production build:** `ng build --configuration=production`
- **Lint:** `ng lint`
- **Generate component:** `ng generate component features/feature-name/components/my-component --standalone`
- **Generate service:** `ng generate service core/services/my-service`
