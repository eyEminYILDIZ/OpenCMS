# Data Model: Webapp Base Project

**Date**: 2026-05-25 | **Feature**: 004-webapp-base-project

## Overview

This feature is a pure frontend scaffold with no persistent data layer. There are no database entities, remote data sources, or shared client state. The only "model" is the React component tree.

## Component Tree

```
<App>
  └── <ExamplePage>
```

| Component | File | Responsibility |
|-----------|------|----------------|
| `App` | `src/App.tsx` | Root component. Renders the application shell and mounts `<ExamplePage />`. |
| `ExamplePage` | `src/components/ExamplePage.tsx` | Static presentational page demonstrating a minimal React component. |

## Entry Point

| File | Purpose |
|------|---------|
| `src/index.tsx` | Calls `ReactDOM.createRoot` and mounts `<App />` into `#root` in `public/index.html`. |
| `public/index.html` | HTML template. Contains `<div id="root">`. Bundles are injected by html-webpack-plugin. |

## State

No application state. `ExamplePage` is a stateless presentational component. If local state is ever needed, it stays inside the component that owns it (W-IV).

## No External Data

- No API calls
- No local storage reads/writes
- No context providers

This is intentional. The base project is a scaffold only.
