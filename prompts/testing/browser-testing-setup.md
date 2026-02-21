---
name: Browser Testing Setup
description: Set up automated browser testing
tags: [testing, e2e, playwright, cypress]
---

# Set Up Browser Testing

Set up automated end-to-end browser testing for this project. Follow the steps below in order.

## 1. Evaluate and Recommend a Framework

Examine the project and recommend either **Playwright** or **Cypress** based on:

- The existing tech stack and test tooling already in use
- Whether cross-browser testing is needed (Playwright has stronger multi-browser support)
- Whether the team already has Cypress or Playwright as a dependency
- Whether the project needs API testing alongside E2E (Playwright handles this natively)

**Default to Playwright** unless there is a clear reason to prefer Cypress (e.g., Cypress is already partially set up, or the team has explicitly requested it).

State your recommendation and reasoning before proceeding.

## 2. Install and Configure

### If Playwright:

- Install `@playwright/test` as a dev dependency.
- Run `npx playwright install --with-deps chromium` to install the minimum browser binary needed for local development. Do NOT install all browsers unless asked.
- Create `playwright.config.ts` with:
  - `baseURL` pointing to the project's local dev server URL
  - `testDir` set to `e2e/` (or `tests/e2e/` if the project already has a `tests/` directory)
  - Projects for chromium only by default (with commented-out firefox and webkit entries)
  - `webServer` block that starts the dev server automatically when tests run
  - Sensible defaults: `retries: 2` in CI, `retries: 0` locally, `use.trace: 'on-first-retry'`

### If Cypress:

- Install `cypress` as a dev dependency.
- Create `cypress.config.ts` with:
  - `baseUrl` pointing to the project's local dev server URL
  - `e2e.specPattern` set to `cypress/e2e/**/*.cy.{ts,js}`
  - Video and screenshot settings appropriate for CI
  - Sensible retry configuration

## 3. Set Up the Page Object Pattern

Create a base page class that other page objects will extend:

```
e2e/
  pages/
    base.page.ts      # Base class with common helpers
    home.page.ts       # Page object for the main/home page
  tests/
    smoke.spec.ts      # Smoke test using the page objects
```

The **base page class** should include:

- A constructor that accepts the page/browser instance
- Helper methods for common actions: `navigate(path)`, `waitForPageLoad()`, `getTitle()`
- A method to assert the page URL matches an expected pattern
- Any project-specific helpers (e.g., login if the app has auth)

The **home page object** should:

- Extend the base page class
- Define locators for key elements on the main page (navigation, headings, primary CTA)
- Provide semantic methods like `clickMainCTA()` or `getNavItems()` rather than exposing raw selectors

## 4. Write a Smoke Test

Create a smoke test (`smoke.spec.ts`) that validates the app's primary flow:

- Navigate to the app's root URL
- Assert the page loads successfully (title, key element visible)
- Interact with at least one element (click a link, fill a form, navigate to a second page)
- Assert the result of that interaction

Use the page objects created in step 3. The test should be a realistic example that the team can use as a template for future tests.

## 5. Configure for CI

### If Playwright:

Create or update the CI config (e.g., `.github/workflows/e2e.yml`) with a job that:

- Installs dependencies and Playwright browsers (`npx playwright install --with-deps chromium`)
- Runs tests in headless mode with `npx playwright test`
- Uploads the Playwright HTML report and trace files as artifacts on failure
- Uses `retries: 2` in the CI configuration

### If Cypress:

Create or update the CI config with a job that:

- Installs dependencies
- Starts the dev server in the background
- Runs `cypress run` in headless mode
- Uploads screenshots and videos as artifacts on failure

Provide the CI config as a separate file so I can review it before merging.

## 6. Add npm Scripts

Add the following scripts to `package.json`:

### Playwright:

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:report": "playwright show-report"
}
```

### Cypress:

```json
{
  "test:e2e": "cypress run",
  "test:e2e:open": "cypress open",
  "test:e2e:headed": "cypress run --headed"
}
```

## 7. Verify

Run the smoke test and confirm:

- The dev server starts automatically (or instruct me to start it manually)
- The test passes in headless mode
- The test report is generated and viewable
- Any flakiness or timing issues are addressed with proper waits (never `sleep`)

List any issues found and how they were resolved.
