---
name: angular-material-styleguide
description: Guided creation of a shareable style guide on Angular Material
tags: [angular, material, css, design-system]
---

# Angular Material Style Guide Skill

Guide the creation of a shareable style guide built on Angular Material's M3 theming API, structured as a publishable SCSS package with design tokens, custom themes, and component-level overrides.

## Workflow

### Step 1: Assess the Project

Determine the current state of the project:

```bash
# Check Angular Material version
node -e "const p = require('./package.json'); console.log(p.dependencies['@angular/material'])"

# Check if a custom theme already exists
find src -name "*.scss" | head -20
grep -rl "mat\." src/styles/ 2>/dev/null || echo "No existing Material theme files found"
```

Confirm:
- Angular Material v17+ is installed (required for M3 theming API)
- If using v15 or v16, recommend upgrading first (use the `angular-upgrade` skill)
- Whether a custom theme already exists or this is a fresh setup

If Angular Material is not installed:
```bash
ng add @angular/material
```

### Step 2: Define Design Tokens

Create a design tokens file that serves as the single source of truth for the style guide. Ask the user about their brand requirements, or use sensible defaults.

Create `src/styles/tokens/` directory with the following files:

#### `_colors.scss`

Define the color palette using M3 token structure:

```scss
// Brand colors -- the primary seed colors for M3 palette generation
$brand-primary: #1a73e8;    // Primary brand color
$brand-secondary: #34a853;  // Secondary brand color
$brand-tertiary: #fbbc04;   // Tertiary/accent color
$brand-error: #ea4335;      // Error color

// Neutral colors for surfaces and text
$neutral: #191c1e;
$neutral-variant: #404944;

// Custom semantic colors (extend beyond M3 defaults)
$semantic-success: #34a853;
$semantic-warning: #fbbc04;
$semantic-info: #1a73e8;

// Surface colors
$surface-dim: #d9dbd9;
$surface-bright: #f7faf7;
```

#### `_typography.scss`

Define the type scale:

```scss
@use '@angular/material' as mat;

// Font families
$font-family-plain: 'Inter', 'Roboto', sans-serif;
$font-family-brand: 'Inter', 'Roboto', sans-serif;
$font-family-code: 'Fira Code', 'Roboto Mono', monospace;

// Custom type scale overrides (M3 type scale tokens)
// These will be applied via mat.define-theme()
$type-scale: (
  // Display
  display-large-font: $font-family-brand,
  display-large-size: 57px,
  display-large-line-height: 64px,
  display-large-weight: 400,

  // Headline
  headline-large-font: $font-family-brand,
  headline-large-size: 32px,
  headline-large-line-height: 40px,

  // Title
  title-large-font: $font-family-plain,
  title-large-size: 22px,
  title-large-line-height: 28px,

  // Body
  body-large-font: $font-family-plain,
  body-large-size: 16px,
  body-large-line-height: 24px,

  body-medium-font: $font-family-plain,
  body-medium-size: 14px,
  body-medium-line-height: 20px,

  // Label
  label-large-font: $font-family-plain,
  label-large-size: 14px,
  label-large-line-height: 20px,
  label-large-weight: 500,
);
```

#### `_spacing.scss`

Define spacing scale and layout tokens:

```scss
// Base spacing unit (4px grid)
$spacing-unit: 4px;

// Spacing scale
$spacing-xxs: $spacing-unit;       // 4px
$spacing-xs: $spacing-unit * 2;    // 8px
$spacing-sm: $spacing-unit * 3;    // 12px
$spacing-md: $spacing-unit * 4;    // 16px
$spacing-lg: $spacing-unit * 6;    // 24px
$spacing-xl: $spacing-unit * 8;    // 32px
$spacing-xxl: $spacing-unit * 12;  // 48px
$spacing-xxxl: $spacing-unit * 16; // 64px

// Layout widths
$layout-max-width: 1280px;
$layout-content-width: 960px;
$layout-sidebar-width: 280px;

// Border radius (M3 shape tokens)
$radius-none: 0;
$radius-xs: 4px;
$radius-sm: 8px;
$radius-md: 12px;
$radius-lg: 16px;
$radius-xl: 28px;
$radius-full: 9999px;
```

#### `_elevation.scss`

Define elevation/shadow tokens aligned with M3 levels:

```scss
// M3 elevation levels (0-5)
$elevation-0: none;
$elevation-1: 0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15);
$elevation-2: 0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15);
$elevation-3: 0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3);
$elevation-4: 0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px rgba(0, 0, 0, 0.3);
$elevation-5: 0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px rgba(0, 0, 0, 0.3);

// Semantic elevation mappings
$elevation-card: $elevation-1;
$elevation-dialog: $elevation-3;
$elevation-nav: $elevation-2;
$elevation-fab: $elevation-3;
$elevation-menu: $elevation-2;
```

### Step 3: Create the M3 Theme

Create the main theme file that uses Angular Material's M3 theming API.

#### `src/styles/_theme.scss`

```scss
@use '@angular/material' as mat;
@use './tokens/colors' as colors;
@use './tokens/typography' as typography;

// Define the M3 theme using Angular Material's define-theme API
$light-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$azure-palette,       // Replace with custom palette if needed
    tertiary: mat.$blue-palette,
    use-system-variables: true,
  ),
  typography: (
    plain-family: typography.$font-family-plain,
    brand-family: typography.$font-family-brand,
    use-system-variables: true,
  ),
  density: (
    scale: 0,
  ),
));

$dark-theme: mat.define-theme((
  color: (
    theme-type: dark,
    primary: mat.$azure-palette,
    tertiary: mat.$blue-palette,
    use-system-variables: true,
  ),
  typography: (
    plain-family: typography.$font-family-plain,
    brand-family: typography.$font-family-brand,
    use-system-variables: true,
  ),
  density: (
    scale: 0,
  ),
));
```

#### `src/styles/styles.scss` (application entry point)

```scss
@use '@angular/material' as mat;
@use './theme' as theme;
@use './tokens/spacing' as spacing;
@use './tokens/elevation' as elevation;
@use './component-overrides' as overrides;

// Apply the base M3 theme
html {
  @include mat.all-component-themes(theme.$light-theme);
  @include mat.system-level-colors(theme.$light-theme);
  @include mat.system-level-typography(theme.$light-theme);
}

// Dark mode support
.dark-theme,
[data-theme="dark"] {
  @include mat.system-level-colors(theme.$dark-theme);
}

// Apply component overrides
@include overrides.all();
```

### Step 4: Create Component-Level Style Overrides

Create `src/styles/_component-overrides.scss` for targeted adjustments to specific Material components.

```scss
@use '@angular/material' as mat;
@use './tokens/spacing' as spacing;
@use './tokens/elevation' as elevation;

@mixin all() {
  @include button-overrides();
  @include card-overrides();
  @include form-field-overrides();
  @include dialog-overrides();
  @include table-overrides();
}

@mixin button-overrides() {
  .mat-mdc-button,
  .mat-mdc-raised-button,
  .mat-mdc-flat-button,
  .mat-mdc-outlined-button {
    border-radius: spacing.$radius-xl;
    letter-spacing: 0.02em;
    font-weight: 500;
  }

  // Increase touch target for mobile
  .mat-mdc-icon-button {
    --mdc-icon-button-state-layer-size: 48px;
  }
}

@mixin card-overrides() {
  .mat-mdc-card {
    border-radius: spacing.$radius-md;
    box-shadow: elevation.$elevation-card;
    padding: spacing.$spacing-lg;
  }

  .mat-mdc-card-title {
    margin-bottom: spacing.$spacing-xs;
  }
}

@mixin form-field-overrides() {
  .mat-mdc-form-field {
    width: 100%;
  }

  // Consistent spacing between stacked form fields
  .mat-mdc-form-field + .mat-mdc-form-field {
    margin-top: spacing.$spacing-sm;
  }
}

@mixin dialog-overrides() {
  .mat-mdc-dialog-container {
    --mdc-dialog-container-shape: #{spacing.$radius-lg};
  }

  .mat-mdc-dialog-actions {
    padding: spacing.$spacing-md spacing.$spacing-lg;
    gap: spacing.$spacing-xs;
  }
}

@mixin table-overrides() {
  .mat-mdc-table {
    border-radius: spacing.$radius-sm;
    overflow: hidden;
  }

  .mat-mdc-header-cell {
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .mat-mdc-row:hover {
    background-color: var(--mat-sys-surface-variant);
  }
}
```

### Step 5: Structure as a Publishable Package

Organize the style guide so it can be consumed by other Angular projects:

```
src/styles/
  _theme.scss                   # Main theme definition
  _component-overrides.scss     # Component-level overrides
  styles.scss                   # Application entry point
  tokens/
    _colors.scss                # Color tokens
    _typography.scss            # Typography tokens
    _spacing.scss               # Spacing and shape tokens
    _elevation.scss             # Elevation/shadow tokens
    _index.scss                 # Barrel export for all tokens
```

Create `src/styles/tokens/_index.scss`:

```scss
@forward 'colors';
@forward 'typography';
@forward 'spacing';
@forward 'elevation';
```

If this should be a standalone publishable package, create a `package.json` for the styles directory:

```json
{
  "name": "@org/design-tokens",
  "version": "1.0.0",
  "description": "Design tokens and Angular Material theme for [Organization]",
  "main": "styles.scss",
  "files": [
    "*.scss",
    "tokens/**/*.scss"
  ],
  "peerDependencies": {
    "@angular/material": ">=17.0.0"
  }
}
```

### Step 6: Verify the Theme

Run a build to verify everything compiles:

```bash
ng build
```

Check for:
- No SCSS compilation errors
- No missing `@use` or `@forward` references
- M3 system-level CSS variables are being generated in the output
- Dark mode toggle works (if applicable)

### Rules

- Always use the M3 theming API (`mat.define-theme()`) rather than the legacy `mat.define-light-theme()` / `mat.define-dark-theme()` for Angular Material v17+.
- Use `@use` and `@forward` exclusively. Never use `@import` (deprecated in Dart Sass).
- Token values should be customized to the user's brand. The defaults in this skill are starting points -- always ask the user for brand colors, fonts, and design preferences before finalizing.
- Keep component overrides minimal. Prefer token customization over CSS overrides wherever possible.
- Use CSS custom properties (`var(--mat-sys-*)`) in application code rather than referencing SCSS variables directly, to support runtime theme switching.
- If the user has an existing theme, migrate it to the M3 API rather than starting from scratch. Preserve their design intent.
- Test both light and dark themes. Verify contrast ratios meet WCAG 2.1 AA minimum (4.5:1 for normal text, 3:1 for large text).
