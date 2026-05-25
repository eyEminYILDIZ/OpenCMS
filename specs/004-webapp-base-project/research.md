# Research: Webapp Base Project

**Date**: 2026-05-25 | **Feature**: 004-webapp-base-project

## Decision Log

### 1. TypeScript Loader: ts-loader vs babel-loader

**Decision**: ts-loader

**Rationale**: ts-loader invokes the TypeScript compiler directly inside Webpack. This means the same type-checking that runs on `tsc --noEmit` runs at bundle time — TypeScript errors fail the build. babel-loader can transpile TypeScript faster but silently skips type errors (Babel strips types without checking them). For a base project whose primary goal is demonstrating type-safe React, ts-loader is the correct choice.

**Alternatives considered**:
- `babel-loader` + `@babel/preset-typescript`: Faster cold builds but no type checking at bundle time. Rejected because FR-003 requires type-checking enforced at build time.
- `esbuild-loader`: Fastest option; same drawback as Babel — no type checking. Rejected for same reason.

---

### 2. Development Server: webpack-dev-server

**Decision**: webpack-dev-server (bundled with webpack ecosystem)

**Rationale**: webpack-dev-server is the canonical, zero-extra-config dev server for Webpack 5 projects. It provides HMR (hot module replacement) out of the box via the `hot: true` option. No separate process or proxy is needed for a pure frontend project.

**Alternatives considered**:
- `vite`: Excellent DX but uses Rollup as bundler — contradicts the Webpack requirement from the spec.
- `parcel`: Zero-config but again not Webpack. Rejected.

---

### 3. HTML Entry: html-webpack-plugin

**Decision**: html-webpack-plugin

**Rationale**: Webpack does not serve HTML directly; it emits JS/CSS bundles. html-webpack-plugin generates (or wraps) an HTML file and automatically injects the emitted bundle `<script>` tag. This is the universally adopted pattern for Webpack SPAs and avoids manual `<script src>` maintenance.

**Alternatives considered**:
- Manual `public/index.html` with a hardcoded script tag: Error-prone when hashes or filenames change. Rejected.
- `mini-html-webpack-plugin`: Lighter but less feature-complete. Not needed for a base project. Rejected.

---

### 4. JSX Runtime: `react-jsx` (React 17+ automatic transform)

**Decision**: `"jsx": "react-jsx"` in tsconfig + Webpack config

**Rationale**: The automatic JSX transform (React 17+) removes the need to `import React from 'react'` in every component file. This is the modern default for all new React projects. TypeScript 4.1+ supports it via `"jsx": "react-jsx"`.

**Alternatives considered**:
- `"jsx": "react"` (classic): Requires `import React` in every file. Deprecated pattern. Rejected.

---

### 5. TypeScript Configuration: Strict Mode

**Decision**: `"strict": true` in tsconfig.json

**Rationale**: Constitution principle W-II mandates strict TypeScript. Strict mode enables `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, and related checks. For a base project, enabling strict from the start prevents accumulated tech debt.

**Key tsconfig settings**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true
  }
}
```

---

### 6. Package Manager: npm

**Decision**: npm (specified by user, FR-010)

**Rationale**: npm ships with Node.js — no additional tooling required. A `package-lock.json` file will be committed to ensure reproducible installs.

---

## Resolved Unknowns

All NEEDS CLARIFICATION items from the spec have been resolved above. No open questions remain.
