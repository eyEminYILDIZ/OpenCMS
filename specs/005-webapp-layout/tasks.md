# Tasks: Web Application Base Layout

**Input**: Design documents from `specs/005-webapp-layout/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Exact file paths included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directories, shared types, UI primitives, and CSS additions needed by all stories.

- [ ] T001 Create all component subdirectories: `webapp/src/context/`, `webapp/src/types/`, `webapp/src/components/layout/navbar/`, `webapp/src/components/layout/sidebar/grid-menu/`, `webapp/src/components/layout/sidebar/item-list/`, `webapp/src/components/layout/right-panel/`
- [ ] T002 Add `@keyframes sheet-slide-in` and `@keyframes sheet-slide-out` keyframe animations to `webapp/src/styles/globals.css` (translateX 100%→0 and 0→100% respectively; apply on Radix `data-state="open"` / `data-state="closed"`)
- [ ] T003 Create `webapp/src/types/layout.ts` — define `MenuSection` union type (`'assets' | 'agents' | 'operations' | 'placeholder1' | 'placeholder2' | 'placeholder3'`), `RightPanelMode` union type (`'details' | 'create' | 'delete' | null`), `LayoutState` interface, `LayoutContextValue` interface, `FakeListItem` interface
- [ ] T004 [P] Create `webapp/src/components/ui/Badge.tsx` — Shadcn-style badge using `class-variance-authority`; accepts `count: number` and `variant` prop; styles from CSS variables; follow the same pattern as existing `Button.tsx`
- [ ] T005 [P] Create `webapp/src/components/ui/Sheet.tsx` — wrap `@radix-ui/react-dialog` primitives as a right-anchored side panel; apply `sheet-slide-in` / `sheet-slide-out` animations; no backdrop overlay; expose `open`, `onClose`, `title`, and `children` props; follow the pattern of existing `Dialog.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared state and the root shell must exist before any story can render visually.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T006 Create `webapp/src/context/LayoutContext.tsx` — implement `LayoutProvider` component and `useLayout` hook; initial state: `{ activeSection: 'assets', rightPanelMode: null, selectedItemId: null }`; expose `setActiveSection` (also resets `rightPanelMode` to `null`), `openRightPanel(mode, itemId?)`, and `closeRightPanel`; use React `createContext` + `useState`
- [ ] T007 Create `webapp/src/components/layout/AppLayout.tsx` — 5-region CSS grid shell (header row / [sidebar + center] row / status bar row); all five regions are `<div>` placeholders with CSS class names and fixed dimensions; import and wrap with `LayoutProvider`; no real child components yet
- [ ] T008 Create `webapp/src/components/layout/sidebar/Sidebar.tsx` — left column container with two stacked regions: a grid-menu region (fixed height) and an item-list region (fills remaining height); both regions start as `<div>` placeholders
- [ ] T009 Update `webapp/src/App.tsx` — remove `StudentsPage` import; import `AppLayout`; replace `<StudentsPage />` with `<AppLayout />`; the `LayoutProvider` wrapping is handled inside `AppLayout.tsx`

**Checkpoint**: `npm start` shows the 5-region layout shell (all placeholder divs) with no console errors and `npm run type-check` passes.

---

## Phase 3: User Story 1 — Navigate via Grid Menu (Priority: P1) 🎯 MVP

**Goal**: Six large grid tiles are visible in the left sidebar, each with a badge count. Clicking a tile marks it active and updates shared state (breadcrumb and item list will read this in later stories).

**Independent Test**: Open app → verify 6 tiles with badges render in the sidebar → click each tile → confirm active tile highlights → no page reload occurs.

- [ ] T010 [P] [US1] Create `webapp/src/components/layout/sidebar/grid-menu/GridMenuItem.tsx` — single tile component; props: `section: MenuSection`, `label: string`, `badgeCount: number`, `isActive: boolean`, `onClick: () => void`; renders a `<button>` with a `Badge`, label text, and CSS active state; uses `aria-current="page"` when active and is keyboard-focusable
- [ ] T011 [US1] Create `webapp/src/components/layout/sidebar/grid-menu/GridMenu.tsx` — 2-column CSS grid container; define the 6 menu section configs (Assets, Agents, Operations, Placeholder 1, Placeholder 2, Placeholder 3) with fake badge counts; reads `activeSection` and `setActiveSection` from `useLayout`; renders one `GridMenuItem` per section
- [ ] T012 [US1] Update `webapp/src/components/layout/sidebar/Sidebar.tsx` — import and render `GridMenu` in the grid-menu region (replace the placeholder div)

**Checkpoint**: Six tiles visible with badges; clicking any tile highlights it; active state persists until another tile is clicked.

---

## Phase 4: User Story 2 — View Item List in Left Panel (Priority: P2)

**Goal**: Below the grid menu, a scrollable item list shows fake items for the active section. An Add button sits at the top. Each item has a delete button. Clicking Add or delete opens the right panel (right panel wired in US3; for now just calls `openRightPanel`).

**Independent Test**: Click a menu tile → verify item list below updates → verify Add button is present → verify each item has a delete action.

- [ ] T013 [P] [US2] Create `webapp/src/components/layout/sidebar/item-list/ItemListItem.tsx` — single list row; props: `item: FakeListItem`, `onSelect: (id: string) => void`, `onDelete: (id: string) => void`; renders label and a delete icon button (use lucide-react `Trash2` icon); clicking row calls `onSelect`, clicking delete icon calls `onDelete`
- [ ] T014 [P] [US2] Create `webapp/src/components/layout/sidebar/item-list/ItemListCommandBar.tsx` — top command bar; props: `onAdd: () => void`; renders an Add button (use existing Shadcn `Button` component)
- [ ] T015 [US2] Create `webapp/src/components/layout/sidebar/item-list/ItemList.tsx` — scrollable list container; reads `activeSection` from `useLayout`; defines `FAKE_ITEMS` map (one static array per `MenuSection`, 4–5 items each); calls `openRightPanel('create')` from Add, `openRightPanel('details', id)` from row click, `openRightPanel('delete', id)` from delete; renders `ItemListCommandBar` at top and one `ItemListItem` per fake item
- [ ] T016 [US2] Update `webapp/src/components/layout/sidebar/Sidebar.tsx` — import and render `ItemList` in the item-list region (replace the placeholder div)

**Checkpoint**: Active section's fake items list correctly; Add and delete buttons are clickable (right panel stays hidden until US3 — `openRightPanel` updates context state but RightPanel component isn't wired yet, so no visible effect is expected here).

---

## Phase 5: User Story 3 — Interact via Right Panel (Priority: P2)

**Goal**: The right panel slides in from the right when triggered (item select, Add, or delete). It shows the correct stub content per mode. It is fully hidden on initial load and on dismiss.

**Independent Test**: Click an item → Sheet slides in showing details stub; click Add → Sheet shows create form stub; click delete → Sheet shows delete confirmation stub; click × or press Escape → Sheet slides out and disappears entirely.

- [ ] T017 [P] [US3] Create `webapp/src/components/layout/right-panel/RightPanelDetails.tsx` — details stub; props: `itemId: string | null`; renders a heading "Item Details" and the `itemId`; uses CSS variables for styling
- [ ] T018 [P] [US3] Create `webapp/src/components/layout/right-panel/RightPanelCreateForm.tsx` — create form stub; renders a heading "Create New Item" and a placeholder description; no real form fields yet
- [ ] T019 [P] [US3] Create `webapp/src/components/layout/right-panel/RightPanelDeleteConfirm.tsx` — delete confirmation stub; props: `itemId: string | null`; renders a heading "Delete Item", the `itemId`, and a placeholder confirm/cancel description
- [ ] T020 [US3] Create `webapp/src/components/layout/right-panel/RightPanel.tsx` — reads `rightPanelMode`, `selectedItemId`, and `closeRightPanel` from `useLayout`; renders a `Sheet` component with `open={rightPanelMode !== null}` and `onClose={closeRightPanel}`; conditionally renders `RightPanelDetails`, `RightPanelCreateForm`, or `RightPanelDeleteConfirm` based on `rightPanelMode`
- [ ] T021 [US3] Update `webapp/src/components/layout/AppLayout.tsx` — import and render `RightPanel` alongside the main content area (replace or position beside the center placeholder)

**Checkpoint**: Right panel is hidden on load; triggers from Phase 4 now produce visible slide-in panel; Escape and × dismiss it with slide-out animation; no modal/dialog popup appears.

---

## Phase 6: User Story 4 — Header and Status Bar (Priority: P3)

**Goal**: The top header is always visible showing the app logo, the active section name in the breadcrumb, and a user box placeholder. The status bar is always visible at the bottom.

**Independent Test**: Load app → header with logo, breadcrumb showing "Assets", and user placeholder visible at top → click a menu tile → breadcrumb updates to new section name → status bar visible at bottom.

- [ ] T022 [P] [US4] Create `webapp/src/components/layout/navbar/Logo.tsx` — renders the logo image from `public/assets/img/logo.png`; no props required; uses an `<img>` tag with appropriate `alt` text and a fixed height via CSS
- [ ] T023 [P] [US4] Create `webapp/src/components/layout/navbar/Breadcrumb.tsx` — reads `activeSection` from `useLayout`; maps the `MenuSection` value to a display label (e.g., `'assets' → 'Assets'`); renders a `<nav aria-label="breadcrumb">` with a single `<span>` showing the label
- [ ] T024 [P] [US4] Create `webapp/src/components/layout/navbar/UserBox.tsx` — static placeholder; renders an avatar circle (CSS initials-based) and the text "Admin User"; no props required
- [ ] T025 [US4] Create `webapp/src/components/layout/navbar/Navbar.tsx` — header bar container; imports `Logo`, `Breadcrumb`, and `UserBox`; positions Logo on the left, Breadcrumb in the center, UserBox on the right using CSS flexbox; height matches the design wireframe header row
- [ ] T026 [P] [US4] Create `webapp/src/components/layout/StatusBar.tsx` — full-width bottom bar; no props; renders a static message "Ready" using `--muted-foreground` color and `--muted` background from CSS variables
- [ ] T027 [US4] Update `webapp/src/components/layout/AppLayout.tsx` — import and render `Navbar` in the header region and `StatusBar` in the status bar region (replace placeholder divs)

**Checkpoint**: Full layout visible with logo, live breadcrumb, user box, and status bar; breadcrumb updates on every menu section click.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Type safety, accessibility, style audit, and final manual validation.

- [ ] T028 Run `npm run type-check` in `webapp/` and fix all TypeScript errors across all new files
- [ ] T029 [P] Accessibility audit on `webapp/src/components/layout/sidebar/grid-menu/GridMenuItem.tsx` — confirm `aria-current`, keyboard focus, and visible focus ring are correct
- [ ] T030 [P] Accessibility audit on `webapp/src/components/layout/sidebar/item-list/ItemListItem.tsx` — confirm delete button has `aria-label`, row is keyboard-navigable
- [ ] T031 [P] CSS audit — search all new layout component files for hardcoded hex/rgb color values; replace any found with the appropriate CSS variable from `globals.css`
- [ ] T032 Manual validation — run `npm start`; follow every scenario in `specs/005-webapp-layout/quickstart.md` and confirm each behaves as described

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately; T004 and T005 are parallel
- **Foundational (Phase 2)**: Requires Phase 1 complete — **blocks all user stories**
- **US1 (Phase 3)**: Requires Phase 2 — T010 and T011 parallel; T012 after T011
- **US2 (Phase 4)**: Requires Phase 2 — T013 and T014 parallel; T015 after T013+T014; T016 after T015
- **US3 (Phase 5)**: Requires Phase 2 — T017, T018, T019 parallel; T020 after T017+T018+T019; T021 after T020
- **US4 (Phase 6)**: Requires Phase 2 — T022, T023, T024, T026 parallel; T025 after T022+T023+T024; T027 after T025+T026
- **Polish (Phase 7)**: Requires all user stories complete — T029, T030, T031 parallel; T028 before T032

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — no dependency on other stories
- **US2 (P2)**: Can start after Phase 2 — independent of US1 (reads LayoutContext, not US1 components)
- **US3 (P2)**: Can start after Phase 2 — independent of US1 and US2 (Sheet + RightPanel stand alone)
- **US4 (P3)**: Can start after Phase 2 — independent; Breadcrumb reads LayoutContext directly

---

## Parallel Opportunities

### Phase 1 Parallel

```
T004: Create Badge.tsx
T005: Create Sheet.tsx
```

### US1 Parallel

```
T010: Create GridMenuItem.tsx   (then T011 GridMenu, then T012 wire)
```

### US2 Parallel

```
T013: Create ItemListItem.tsx
T014: Create ItemListCommandBar.tsx
(then T015 ItemList, then T016 wire)
```

### US3 Parallel

```
T017: Create RightPanelDetails.tsx
T018: Create RightPanelCreateForm.tsx
T019: Create RightPanelDeleteConfirm.tsx
(then T020 RightPanel, then T021 wire)
```

### US4 Parallel

```
T022: Create Logo.tsx
T023: Create Breadcrumb.tsx
T024: Create UserBox.tsx
T026: Create StatusBar.tsx
(then T025 Navbar, then T027 wire)
```

### Polish Parallel

```
T029: GridMenuItem a11y audit
T030: ItemListItem a11y audit
T031: CSS color audit
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T005)
2. Complete Phase 2: Foundational (T006–T009)
3. Complete Phase 3: US1 Grid Menu (T010–T012)
4. **STOP and VALIDATE**: Six clickable tiles with badges; active state highlights correctly
5. Continue with US2, US3, US4 in priority order

### Incremental Delivery

1. Phase 1 + Phase 2 → layout shell visible
2. Phase 3 (US1) → grid menu navigable ← **MVP**
3. Phase 4 (US2) → item list functional
4. Phase 5 (US3) → right panel interactive
5. Phase 6 (US4) → header and status bar complete
6. Phase 7 → polished, accessible, type-safe

---

## Notes

- [P] = parallelizable; different files, no dependencies on incomplete tasks in the same phase
- AppLayout.tsx is updated in Phases 2, 5, and 6 — do not run these tasks in parallel
- Sidebar.tsx is updated in Phases 2, 3, and 4 — do not run these tasks in parallel
- All colors must come from `globals.css` CSS variables; verify with T031
- Right panel must have zero visible presence on initial load; verify with T032
- `npm run type-check` must pass with zero errors before marking T028 complete
