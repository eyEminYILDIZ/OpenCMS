# Implementation Plan: Web Application Base Layout

**Branch**: `005-webapp-layout` | **Date**: 2026-05-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-webapp-layout/spec.md`

## Summary

Build the persistent application shell for the OpenCMS web application. The shell consists of five layout regions: a top header (logo + breadcrumb + user box), a left sidebar (6-tile grid menu + item list with command bar), a center placeholder area, a hidden-by-default slide-in right panel (Microsoft-style drawer for all CRUD interactions), and a full-width bottom status bar. State (active menu section, right panel visibility/mode) is managed exclusively through the React Context API. All interactive components use Shadcn/Radix UI primitives where available.

## Technical Context

**Language/Version**: TypeScript 6 / React 19 (strict mode enabled)

**Primary Dependencies**: React 19, @radix-ui/react-dialog (Sheet/drawer), lucide-react (icons), clsx, class-variance-authority, Shadcn UI components (Button, Badge, Sheet to be added)

**Storage**: N/A — layout state is in-memory (React Context), no persistence

**Testing**: N/A — this issue delivers visual layout; no automated test harness is in scope

**Target Platform**: Desktop browser, 1280px+ viewport

**Project Type**: Web application (single-page, React)

**Performance Goals**: Standard web expectations; layout render under 100ms on initial load

**Constraints**:
- No Tailwind utility classes; all styles via CSS variables from `globals.css`
- No third-party state management; Context API only
- Shadcn UI components MUST be used wherever a matching primitive exists
- No modal/dialog popups for CRUD; right panel is the sole interaction surface
- TypeScript strict mode; no `any`, no `as` assertions

**Scale/Scope**: ~17 new component files, 1 context, 2 new shared types, organized in component-scoped subdirectories

## Constitution Check

*GATE: Must pass before implementation begins.*

### Core Principles

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | PASS | Layout shell only; no data fetching, no routing, no abstractions beyond what the feature requires |
| II. Readable Code | PASS | Components named by role (AppHeader, GridMenu, RightPanel, etc.); each does one thing |
| III. SOLID | PASS | Each component has single responsibility; Context injected via provider, not instantiated inside components |

### Webapp Principles

| Principle | Status | Notes |
|-----------|--------|-------|
| W-I. Component Simplicity | PASS | Presentational components contain no business logic; layout state lives in `LayoutContext` hook; JSX trees remain shallow |
| W-II. Typed Contracts | PASS | All props typed with named interfaces; `MenuSection` and `RightPanelMode` union types defined in `types/layout.ts`; no `any` |
| W-III. Accessibility | PASS | Shadcn/Radix primitives provide keyboard navigation and ARIA roles out of the box; interactive elements (menu tiles, list items) labelled |
| W-IV. State Management Simplicity | PASS | Active menu item and right panel state are genuinely shared across unrelated components (header breadcrumb, sidebar, right panel) — Context promotion is justified |

### Complexity Tracking

No constitution violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/005-webapp-layout/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code

Each component lives in its own file. When a component owns child components, those children are co-located in a subdirectory named after the parent (lowercase).

```text
webapp/src/
├── context/
│   └── LayoutContext.tsx              # Layout state provider + useLayout hook
├── types/
│   └── layout.ts                      # MenuSection, RightPanelMode, LayoutState types
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx              # Root shell: composes all five regions
│   │   ├── navbar/
│   │   │   ├── Navbar.tsx             # Header bar container (positions Logo, Breadcrumb, UserBox)
│   │   │   ├── Logo.tsx               # App logo image (logo.png)
│   │   │   ├── Breadcrumb.tsx         # Active section label
│   │   │   └── UserBox.tsx            # User placeholder (avatar + name)
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx            # Left column container (positions GridMenu above ItemList)
│   │   │   ├── grid-menu/
│   │   │   │   ├── GridMenu.tsx       # 2×3 tile grid container
│   │   │   │   └── GridMenuItem.tsx   # Single tile: label + Badge + active state
│   │   │   └── item-list/
│   │   │       ├── ItemList.tsx       # Scrollable list container + command bar
│   │   │       ├── ItemListCommandBar.tsx  # Top bar with Add button
│   │   │       └── ItemListItem.tsx   # Single list row: label + delete action
│   │   ├── right-panel/
│   │   │   ├── RightPanel.tsx         # Sheet wrapper; routes to correct content by mode
│   │   │   ├── RightPanelDetails.tsx  # Item detail stub (mode: 'details')
│   │   │   ├── RightPanelCreateForm.tsx  # Create form stub (mode: 'create')
│   │   │   └── RightPanelDeleteConfirm.tsx  # Delete confirmation stub (mode: 'delete')
│   │   └── StatusBar.tsx              # Full-width bottom bar (no children)
│   └── ui/
│       ├── Badge.tsx                  # Shadcn-style numeric badge
│       └── Sheet.tsx                  # Radix Dialog anchored right; slide-in/out animation
└── App.tsx                            # Updated: replace StudentsPage with AppLayout
```

**Structure Decision**: Single-project web application. Component subdirectories are named in lowercase after their parent component (e.g., `navbar/`, `sidebar/`, `grid-menu/`, `item-list/`, `right-panel/`). A subdirectory is created only when a parent owns two or more child components. Leaf components with no children (StatusBar, Logo, Breadcrumb, UserBox, etc.) are single files. New Shadcn-compatible primitives go under `src/components/ui/`. Context in `src/context/`. Shared types in `src/types/`.
