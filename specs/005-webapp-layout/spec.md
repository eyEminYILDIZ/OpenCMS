# Feature Specification: Web Application Base Layout

**Feature Branch**: `005-webapp-layout`

**Created**: 2026-05-27

**Status**: Draft

**Input**: GitHub Issue #27 — Setup routing and base layout

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate via Grid Menu (Priority: P1)

A user opens the web application and sees the full layout. They can identify the six menu items displayed as large grid tiles in the left sidebar. Each menu tile shows a badge with a count. Clicking a menu item (e.g., Assets) highlights it as active and updates the item list below.

**Why this priority**: The menu is the primary navigation mechanism; without it, no section of the app is reachable.

**Independent Test**: Open the app, verify all six menu tiles are visible with badges, click each one and confirm the active state changes visually.

**Acceptance Scenarios**:

1. **Given** the app is loaded, **When** the user views the left sidebar, **Then** six menu items are displayed as large grid tiles with badge counts visible on each.
2. **Given** the layout is loaded, **When** the user clicks the "Assets" menu tile, **Then** the tile becomes visually active/selected and the item list area below reflects the selected section.
3. **Given** a menu item is active, **When** the user clicks a different menu item, **Then** the previous item deactivates and the new item activates.

---

### User Story 2 - View Item List in Left Panel (Priority: P2)

A user has a menu item selected. Below the grid menu, they see a scrollable list of items belonging to that section. At the top of the list is a command bar with an "Add" button. Each item in the list shows basic info and a delete button.

**Why this priority**: The item list is the core content browser; it enables all CRUD operations via the right panel.

**Independent Test**: With a menu item selected, verify the list renders with placeholder items, the "Add" command button is present at the top, and each list item shows a delete action.

**Acceptance Scenarios**:

1. **Given** a menu item is selected, **When** the user views the left sidebar below the menu, **Then** a list of items is displayed with an "Add" button at the top.
2. **Given** the item list is visible, **When** the user clicks an item in the list, **Then** the right panel opens/becomes visible with that item's details.
3. **Given** the item list is visible, **When** the user clicks the "Add" button, **Then** the right panel opens showing a create form.
4. **Given** the item list is visible, **When** the user clicks the delete button on a list item, **Then** the right panel opens showing a delete confirmation.

---

### User Story 3 - Interact via Right Panel (Priority: P2)

A user performs create, view, update, and delete interactions exclusively through a slide-in right panel (Microsoft-style, similar to a side drawer). The panel is not visible at all when not in use. When triggered, it slides in from the right edge over or beside the center content. When the user dismisses it or completes an action, it slides back out and disappears entirely. No modal popups are used.

**Why this priority**: The right panel is the sole interaction surface for all CRUD operations; it replaces all dialogs/modals in the design.

**Independent Test**: Trigger the right panel via "Add", item click, and delete; confirm it slides in from the right each time, is fully hidden when not triggered, and no modal/dialog appears.

**Acceptance Scenarios**:

1. **Given** the right panel is hidden, **When** the user selects an item or clicks Add/Delete, **Then** the right panel slides in from the right side and shows the relevant content.
2. **Given** the right panel is open with a form, **When** the user submits or cancels, **Then** the panel slides out and becomes fully hidden.
3. **Given** the right panel is open, **When** the user clicks the close/dismiss control, **Then** the panel slides out and is no longer visible.
4. **Given** the right panel is open, **When** the user switches to a different menu item, **Then** the right panel closes and hides.

---

### User Story 4 - Read Header and Status Bar (Priority: P3)

A user can always see the top header bar and bottom status bar. The header shows the app logo on the left, a breadcrumb in the center reflecting the current section, and a user box on the right. The status bar spans the full width at the bottom and displays informational messages.

**Why this priority**: These are persistent UI chrome elements; they provide context and feedback but are not blocking for core functionality.

**Independent Test**: Navigate between menu items and verify the breadcrumb updates, the logo is visible, the user box is visible, and the status bar is present at the bottom.

**Acceptance Scenarios**:

1. **Given** the app is loaded, **When** the user views the page, **Then** the header contains a logo (left), breadcrumb (center), and user box (right).
2. **Given** a menu item is selected, **When** the user views the breadcrumb, **Then** it reflects the current section name.
3. **Given** the app is loaded, **When** the user views the bottom of the page, **Then** a full-width status bar is visible.

---

### Edge Cases

- What happens when the right panel is open and the user switches menu items? (Panel should close/reset.)
- How does the layout respond when the browser window is narrow? (Left sidebar or right panel should be collapsible.)
- What is shown in the center area when no map is present? (Placeholder or empty state.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The layout MUST consist of five distinct regions: top header, left sidebar, center content area, right panel, and bottom status bar.
- **FR-002**: The top header MUST display the application logo on the left side using `public/assets/img/logo.png`.
- **FR-003**: The top header MUST display a breadcrumb component in the center that reflects the currently selected menu section.
- **FR-004**: The top header MUST display a user box on the right side.
- **FR-005**: The left sidebar MUST contain a grid menu with exactly 6 items: Assets, Agents, Operations, and three placeholder items.
- **FR-006**: Each grid menu item MUST display a badge with a numeric count (fake/static data for now).
- **FR-007**: Only one grid menu item can be active at a time; the active item MUST be visually distinguished.
- **FR-008**: The left sidebar MUST contain an item list below the grid menu, displaying items for the currently active menu section.
- **FR-009**: The item list MUST have a command bar at the top containing at minimum an "Add" button.
- **FR-010**: Each item in the item list MUST have a delete action.
- **FR-011**: The right panel MUST NOT be visible on initial load. It MUST slide in from the right side of the screen when triggered by: selecting an item, clicking Add, or clicking a delete action. It MUST slide out and disappear entirely when dismissed or after a completed action. This behavior follows the Microsoft-style side panel pattern (a persistent drawer that is fully hidden when not in use).
- **FR-012**: The right panel MUST display one of three content modes: item details (view), create/update form, or delete confirmation.
- **FR-013**: No modal popups or dialogs MUST be used for CRUD interactions; all interactions occur in the right panel.
- **FR-014**: The center content area MUST render as a placeholder (the map integration is out of scope for this issue).
- **FR-015**: The bottom status bar MUST span the full width and be persistently visible.
- **FR-016**: All colors MUST be sourced from the existing CSS theme variables defined in `globals.css`.
- **FR-017**: Routing is out of scope; menu navigation updates the layout state without changing the URL.

### Key Entities

- **Layout**: The top-level shell component composing all five regions.
- **Header**: Top region containing logo, breadcrumb, and user box.
- **GridMenu**: Left-sidebar menu rendered as large grid tiles with badge counts.
- **MenuItem**: A single tile in the grid menu; holds label, badge count, and active state.
- **ItemList**: Scrollable list of items below the grid menu; includes a command bar.
- **RightPanel**: Hidden-by-default side drawer that slides in from the right; renders one of: item details, create/update form, or delete confirmation. Fully disappears when not in use.
- **StatusBar**: Full-width bar at the bottom for status messages.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On initial load, four layout regions are visible (header, left sidebar, center, status bar); the right panel is hidden and does not occupy space until triggered.
- **SC-002**: Clicking any of the 6 menu items changes the active state within one user interaction, with no page reload.
- **SC-003**: The right panel opens in response to item selection, Add click, or delete action in 100% of triggered interactions.
- **SC-004**: Zero modal/dialog popups appear during any CRUD trigger action; all interactions are confined to the right panel.
- **SC-005**: The breadcrumb updates to reflect the active menu section every time the user switches sections.
- **SC-006**: The layout renders without visual overflow, clipping, or broken regions at standard desktop viewport widths (1280px and above).
- **SC-007**: All colors used in the layout are drawn from the CSS theme variables; no hardcoded color values are introduced outside the theme file.

## Assumptions

- Routing is explicitly deferred; menu selection is managed via component state only.
- The center content area will render a styled placeholder (e.g., a labeled empty box) since the OpenStreetMap integration is a separate issue.
- The user box in the header will render as a static placeholder (avatar/name) since authentication is not in scope for this issue.
- Item list content will use static/fake data to demonstrate the layout; real data fetching is out of scope.
- Badge counts on menu items are static/fake numbers for this issue.
- The right panel placeholder content (forms, details, confirmation) will be minimal stubs sufficient to demonstrate the panel behavior.
- The existing `globals.css` CSS variable theme is the authoritative color source; no separate theme file needs to be created.
- The layout targets desktop viewports (1280px+); mobile responsiveness is not required for this issue.
- Shadcn UI component primitives MUST be used wherever a matching component exists; custom implementations are only acceptable for layout structure not covered by Shadcn.
- If shared layout state (active menu item, right panel visibility/mode) requires a state management solution, the Context API is the only permitted approach; no third-party state libraries will be introduced.
