# Quickstart: Webapp Base Project

**Date**: 2026-05-25 | **Feature**: 004-webapp-base-project

## Prerequisites

- Node.js LTS (v20 or later)
- npm (bundled with Node.js)

## Setup

```bash
cd webapp
npm install
```

## Development

```bash
npm start
```

Opens at `http://localhost:3000` (or next available port). Hot module replacement is active — saving a file updates the browser instantly without a full reload.

## Production Build

```bash
npm run build
```

Output is written to `webapp/dist/`. The directory contains:
- `index.html` — entry HTML with injected bundle references
- `bundle.[hash].js` — minified JavaScript bundle

## TypeScript Type Check (without bundling)

```bash
npm run type-check
```

Runs `tsc --noEmit` to report type errors without emitting files. Useful in CI.

## npm Scripts Reference

| Script | Command | Purpose |
|--------|---------|---------|
| `start` | `webpack serve` | Start dev server with HMR |
| `build` | `webpack --mode production` | Production bundle to `dist/` |
| `type-check` | `tsc --noEmit` | Type-check only, no output |

## Project Layout

```text
webapp/
├── public/
│   └── index.html           # HTML template
├── src/
│   ├── index.tsx             # Entry point
│   ├── App.tsx               # Root component
│   └── components/
│       └── ExamplePage.tsx   # Example page
├── dist/                     # Build output (git-ignored)
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## Adding a New Component

1. Create `src/components/MyComponent.tsx`
2. Export a typed React function component
3. Import and render it where needed
4. Save — the dev server hot-reloads automatically
