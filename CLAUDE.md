# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**MonPortfolio** — static personal portfolio website. No framework, no build tool, no dependencies.

Owner context is in `CLAUDE.local.md` (not versioned): name, GitHub, email, title.

## Stack

- Pure HTML5, CSS3, vanilla JavaScript
- No npm, no bundler, no preprocessor
- Served as static files (open `index.html` directly or via a local static server)

## Development

```bash
# Serve locally (Python)
python -m http.server 8080

# Or with Node
npx serve .
```

No build step, no lint command, no test suite. Edit files and refresh the browser.

## Architecture

Single-page static site. All assets live at the root or in subdirectories:

```
index.html        # entry point
css/style.css     # all styles
js/main.js        # all scripts
assets/
  images/         # photos, project screenshots, avatar
  icons/          # SVG icons, favicon
```

JavaScript is vanilla. Keep all scripts in `js/main.js` unless a section grows large enough to justify a dedicated file (e.g. `js/contact.js`, `js/nav.js`) — in that case, add a `<script>` tag per file in `index.html`. No bundler, no imports.

## Conventions

**Language split:**
- Code (variables, functions, comments, class names, IDs) → English
- All visible content (text, labels, headings, `alt` attributes) → French

**Design:**
- Dark background, minimal, professional
- Mobile-first CSS: base styles target small screens, `min-width` media queries for larger breakpoints
  - Tablet: `640px` — 2-column layouts
  - Desktop: `1024px` — 3-column layouts

**CSS:**
- CSS custom properties (`--color-bg`, `--color-text`, etc.) defined on `:root` for the dark theme
- BEM-like naming for classes: `.section__title`, `.card__body`

**Assets file naming:** kebab-case (e.g. `profile-photo.jpg`, `icon-github.svg`)

**JavaScript:**
- Wrap logic in named functions — no loose code at the top level
- DOM manipulation only, no external libraries
