---
name: Storybook Setup
description: Get Storybook running in an existing project
tags: [storybook, ui, testing]
---

# Set Up Storybook

Set up Storybook in this project so I can develop and preview UI components in isolation. Follow the steps below in order.

## 1. Detect the Project Framework

Before installing anything, examine the project to determine:

- The UI framework in use (React, Vue, Angular, Svelte, Web Components, etc.)
- The build tool (Vite, Webpack, esbuild, Angular CLI, etc.)
- The language (TypeScript or JavaScript)
- The package manager (npm, yarn, pnpm)
- The styling approach (CSS modules, Tailwind, Sass, styled-components, etc.)

State your findings before proceeding so I can confirm.

## 2. Install and Configure Storybook

- Use the official `storybook@latest init` command appropriate for the detected framework, or manually install if the automatic setup does not apply.
- Make sure the Storybook version is 8.x or later.
- Verify that the generated `.storybook/main.ts` (or `.js`) config is correct for this project's build tool and framework.
- Update `.storybook/preview.ts` to import the project's global styles, fonts, and any required providers or wrappers (theme providers, router context, i18n, store, etc.) so components render the same way they do in the real app.
- If the project uses TypeScript, make sure Storybook is configured to handle it (paths, aliases, decorators).

## 3. Create Example Stories

Pick 2-3 existing components from the project and write stories for them. Choose components that:

- Have props/inputs that are interesting to explore (not just a static logo)
- Represent different complexity levels (one simple, one with multiple variants or states)

For each component, create a story file colocated next to the component (e.g., `Button.stories.tsx` next to `Button.tsx`). Each story file should include:

- A default export with `title`, `component`, and `tags: ['autodocs']`
- An `args`-based primary story showing the most common usage
- At least one additional story showing a different state or variant
- Use of `argTypes` to provide controls for key props (dropdowns for enums, color pickers for colors, etc.)

## 4. Set Up Essential Addons

Make sure the following addons are installed and configured in `.storybook/main.ts`:

- **@storybook/addon-essentials** (controls, actions, viewport, docs) -- typically included by default
- **@storybook/addon-a11y** -- install separately and add to the addons array
- **@storybook/addon-interactions** -- if not already included, add it for play-function testing

Verify each addon appears in the `addons` array in `.storybook/main.ts`.

## 5. Add npm Scripts

Add or update the following scripts in `package.json`:

```json
{
  "storybook": "storybook dev -p 6006",
  "storybook:build": "storybook build -o storybook-static"
}
```

Add `storybook-static/` to `.gitignore` if it is not already there.

## 6. Optional: CI Configuration

If the project already has a CI pipeline (GitHub Actions, GitLab CI, etc.), offer to add a Storybook step that either:

- **Builds Storybook statically** (`storybook build`) as a build verification step
- **Runs Chromatic** for visual regression testing (mention that a Chromatic project token is needed)

Provide the CI config as a separate file or step that I can choose to include.

## 7. Verify

After setup is complete, run `npm run storybook` (or the equivalent for the detected package manager) and confirm that:

- Storybook starts without errors
- The example stories render correctly
- Controls, actions, and a11y panels work in the Storybook UI

List any warnings or issues found and how to resolve them.
