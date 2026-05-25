# Tasks: Webapp Base Project

**Input**: Design documents from `specs/004-webapp-base-project/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | quickstart.md ✅

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

All source paths are relative to `webapp/` (the project root for this sub-project).

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Scaffold the npm project and directory structure. No code yet — just bones.

- [x] T001 Initialize npm project: create `webapp/package.json` with name, version, and empty scripts block (`npm init -y` in `webapp/`)
- [x] T002 Install runtime dependencies: `react`, `react-dom` in `webapp/`
- [x] T003 Install dev dependencies: `typescript`, `webpack`, `webpack-cli`, `webpack-dev-server`, `ts-loader`, `html-webpack-plugin`, `@types/react`, `@types/react-dom` in `webapp/`
- [x] T004 [P] Create source directories: `webapp/src/`, `webapp/src/components/`, `webapp/public/`
- [x] T005 [P] Add `webapp/dist/` and `webapp/node_modules/` to root `.gitignore` (or create `webapp/.gitignore`)

**Checkpoint**: `webapp/package.json` exists, `node_modules/` populated, directory tree in place.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Configuration files that ALL user stories depend on. Nothing can run until these exist.

**⚠️ CRITICAL**: Phase 3+ cannot begin until this phase is complete.

- [x] T006 Create `webapp/tsconfig.json` with: `"target": "ES2020"`, `"module": "ESNext"`, `"moduleResolution": "bundler"`, `"jsx": "react-jsx"`, `"strict": true`, `"esModuleInterop": true`, `"sourceMap": true`, `"rootDir": "./src"`, `"outDir": "./dist"`
- [x] T007 Create `webapp/webpack.config.js` with: entry `./src/index.tsx`, output `dist/bundle.[hash].js`, `ts-loader` rule for `.tsx?` files, `html-webpack-plugin` referencing `public/index.html`, `resolve.extensions: ['.tsx', '.ts', '.js']`
- [x] T008 Create `webapp/public/index.html` template: standard HTML5 boilerplate with `<div id="root"></div>` and a meaningful `<title>` (html-webpack-plugin injects the bundle `<script>` automatically — do NOT add one manually)

**Checkpoint**: `tsconfig.json`, `webpack.config.js`, and `public/index.html` are correct and consistent with each other.

---

## Phase 3: User Story 1 — Developer Runs the Project (Priority: P1) 🎯 MVP

**Goal**: Developer installs, starts the dev server, and sees the example page in the browser with hot reload active.

**Independent Test**: Run `npm install && npm start` in `webapp/`. Browser at `http://localhost:3000` must show the example page. Edit `ExamplePage.tsx` — change must appear in the browser without a full reload.

### Implementation

- [x] T009 [US1] Create `webapp/src/components/ExamplePage.tsx`: stateless functional component that renders a `<main>` with an `<h1>` heading and a short paragraph; export as default; no imports beyond React types (react-jsx transform handles the rest)
- [x] T010 [US1] Create `webapp/src/App.tsx`: imports and renders `<ExamplePage />`; single responsibility — root shell only
- [x] T011 [US1] Create `webapp/src/index.tsx`: imports `App`, calls `ReactDOM.createRoot(document.getElementById('root')!).render(<App />)`
- [x] T012 [US1] Add dev-server configuration to `webapp/webpack.config.js`: `devServer: { port: 3000, hot: true, open: true }` (HMR requires `hot: true`)
- [x] T013 [US1] Add `"start"` and `"type-check"` scripts to `webapp/package.json`: `"start": "webpack serve --mode development"`, `"type-check": "tsc --noEmit"`

**Checkpoint**: `npm start` in `webapp/` opens the browser, renders the example page, and hot-reloads on save. `npm run type-check` exits with code 0.

---

## Phase 4: User Story 2 — Developer Builds for Production (Priority: P2)

**Goal**: Developer runs one command and receives a deployable `dist/` directory with no errors.

**Independent Test**: Run `npm run build` in `webapp/`. `dist/index.html` and at least one `.js` file must exist. Opening `dist/index.html` in a browser must render the example page.

### Implementation

- [x] T014 [US2] Add production webpack configuration to `webapp/webpack.config.js`: set `mode` based on `process.env.NODE_ENV`, enable `optimization.minimize: true` for production, configure `output.clean: true` so stale files are removed on each build
- [x] T015 [US2] Add `"build"` script to `webapp/package.json`: `"build": "webpack --mode production"`

**Checkpoint**: `npm run build` completes with exit code 0, `webapp/dist/` contains `index.html` and a minified JS bundle, and the page renders correctly when opened directly in a browser.

---

## Phase 5: User Story 3 — Developer Adds a New Component (Priority: P3)

**Goal**: The project structure and tsconfig are set up so a developer can drop in a new `.tsx` file and immediately use it with full type checking.

**Independent Test**: Create `webapp/src/components/DemoComponent.tsx` with a typed prop interface. Import it in `ExamplePage.tsx`. Run `npm run type-check` — must pass. Run `npm start` — component must render.

### Implementation

- [x] T016 [US3] Verify `webapp/tsconfig.json` has `"include": ["src"]` and `"exclude": ["node_modules", "dist"]` so the compiler discovers all files under `src/` automatically (no manual file lists required when adding components)
- [x] T017 [US3] Update `webapp/CLAUDE.md` with: component naming convention (PascalCase, one component per file), rule against `any` types, rule against `as` type assertions, and the three-command workflow (`npm install`, `npm start`, `npm run build`) — this is the living conventions document for the webapp sub-project

**Checkpoint**: A new `.tsx` file added to `src/components/` is automatically picked up by TypeScript and Webpack. `npm run type-check` catches type errors in the new file.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency checks and documentation alignment.

- [x] T018 [P] Validate `webapp/quickstart.md` (from `specs/004-webapp-base-project/quickstart.md`) accurately matches the actual npm scripts and directory layout — update if any discrepancy was introduced during implementation
- [x] T019 [P] Confirm `webapp/dist/` is listed in `webapp/.gitignore` (or root `.gitignore`) and does not appear in `git status`
- [x] T020 Run full validation: `npm install`, `npm run type-check`, `npm start` (smoke test in browser), `npm run build` — all must succeed with zero errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 completion — **blocks all user stories**
- **Phase 3 (US1 — P1)**: Depends on Phase 2 — this is MVP
- **Phase 4 (US2 — P2)**: Depends on Phase 2; integrates with Phase 3 scripts
- **Phase 5 (US3 — P3)**: Depends on Phase 2; verifies Phase 3 structure is extensible
- **Phase 6 (Polish)**: Depends on all story phases complete

### User Story Dependencies

- **US1 (P1)**: Unblocked after Phase 2 — no story dependencies
- **US2 (P2)**: Unblocked after Phase 2 — shares `webpack.config.js` and `package.json` with US1 (edit sequentially or coordinate)
- **US3 (P3)**: Unblocked after Phase 2 — independent of US1/US2 implementation tasks

### Within Each Story

- Configuration tasks before component tasks
- Components before entry point (index.tsx imports App which imports components)
- All files in place before running the dev server smoke test

### Parallel Opportunities

- T004 and T005 can run in parallel (different files)
- T009 and T010 can run in parallel within US1 (different files)
- T018 and T019 can run in parallel within Polish

---

## Parallel Example: User Story 1

```bash
# T009 and T010 have no dependency on each other — run together:
Task: "Create webapp/src/components/ExamplePage.tsx"
Task: "Create webapp/src/App.tsx"

# Then T011 (depends on T009+T010 both existing):
Task: "Create webapp/src/index.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks everything)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `npm start` → example page renders, hot reload works, `npm run type-check` passes
5. Demo-ready webapp scaffold

### Incremental Delivery

1. Setup + Foundational → skeleton in place
2. US1 → running dev server with example page (MVP)
3. US2 → production build confirmed
4. US3 → extensibility verified
5. Polish → all scripts validated end-to-end

---

## Notes

- [P] tasks operate on different files and have no unresolved predecessors — safe to parallelize
- [Story] label provides traceability back to spec.md acceptance scenarios
- No test tasks generated (not requested in spec)
- No state management or UI libraries are to be installed at any point
- npm is the only permitted package manager — do not generate `yarn.lock` or `pnpm-lock.yaml`
