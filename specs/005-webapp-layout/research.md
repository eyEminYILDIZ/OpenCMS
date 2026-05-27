# Research: Web Application Base Layout

**Date**: 2026-05-27 | **Branch**: `005-webapp-layout`

## Decision 1: Right Panel (Microsoft-style slide-in drawer)

**Decision**: Implement the right panel as a Shadcn `Sheet` component anchored to `side="right"`.

**Rationale**: Shadcn's Sheet is a thin wrapper over `@radix-ui/react-dialog` that positions the dialog at a screen edge and adds a slide-in/out animation. `@radix-ui/react-dialog` is already installed in the project. This matches the Microsoft-style "task pane" pattern exactly — hidden when `open={false}`, slides in from the right when `open={true}`, and supports a backdrop-free overlay. No new dependency is needed beyond a new `Sheet.tsx` UI component (following the existing pattern of Dialog.tsx, Select.tsx, etc.).

**Alternatives considered**:
- Custom CSS `position: fixed` drawer — requires manual focus trap, keyboard handling, and ARIA; rejected because Radix already solves these.
- Shadcn Drawer (Vaul) — designed for bottom sheets on mobile; semantically wrong for a side panel.

---

## Decision 2: Grid Menu Tile Layout

**Decision**: Use CSS Grid (`display: grid; grid-template-columns: repeat(2, 1fr)`) for the 6-tile grid, with each tile as a styled `<button>` using the existing `Button` component variant or a custom tile component with CSS class `.menu-tile`. Each tile includes a label and a `Badge` component for the count.

**Rationale**: No Shadcn component exists for a large grid-tile menu. The tile is a presentational layout pattern best handled with a small amount of CSS. Two columns × three rows gives the "Boxed Grid Menu" shape from the design wireframe.

**Alternatives considered**:
- Using `<Card>` component per tile — adds unnecessary nesting and DOM weight for a simple clickable area.

---

## Decision 3: Badge Component

**Decision**: Add a `Badge.tsx` component to `src/components/ui/` following the same Shadcn-compatible pattern as existing UI primitives. The badge uses `class-variance-authority` for variant support and `globals.css` CSS variables for colors.

**Rationale**: `class-variance-authority` and `clsx` are already installed. The project already uses this exact pattern for Button. No new dependency needed.

**Alternatives considered**:
- Inline span with hardcoded style — violates the pattern established by the existing UI primitives and makes theming harder.

---

## Decision 4: Sheet Component

**Decision**: Add a `Sheet.tsx` component to `src/components/ui/`. It wraps `@radix-ui/react-dialog` with a fixed right-side position, a CSS slide-in animation, and a close button. The Sheet does NOT render a backdrop overlay (to match the Microsoft side-pane UX where the main content remains interactive while the panel is open).

**Rationale**: `@radix-ui/react-dialog` is already installed. A backdrop-free panel keeps the center area visible and accessible, consistent with the Microsoft-style pattern. The existing `Dialog.tsx` already shows how to compose Radix dialog primitives — `Sheet.tsx` follows the same pattern with different positioning and animation.

---

## Decision 5: Layout State via Context API

**Decision**: One `LayoutContext` with the following shape:

```typescript
type MenuSection = 'assets' | 'agents' | 'operations' | 'placeholder1' | 'placeholder2' | 'placeholder3';
type RightPanelMode = 'details' | 'create' | 'delete' | null;

interface LayoutState {
  activeSection: MenuSection;
  rightPanelMode: RightPanelMode;
  selectedItemId: string | null;
}

interface LayoutContextValue extends LayoutState {
  setActiveSection: (section: MenuSection) => void;
  openRightPanel: (mode: Exclude<RightPanelMode, null>, itemId?: string) => void;
  closeRightPanel: () => void;
}
```

**Rationale**: Three unrelated components share this state — `AppHeader` (breadcrumb), `AppSidebar` (active menu item highlight), and `RightPanel` (open/closed, content mode). This satisfies the Constitution W-IV threshold for promoting to context. The context is minimal: no reducers, no derived state, no middleware.

**Alternatives considered**:
- Prop drilling from `AppLayout` — would require passing `activeSection` and `rightPanelMode` through `AppSidebar → GridMenu → GridMenuItem` and `AppLayout → AppHeader → Breadcrumb`, spanning more than two levels, which violates W-I guidance.
- Redux/Zustand — explicitly prohibited by the spec and Constitution.

---

## Decision 6: Breadcrumb

**Decision**: Implement a minimal custom `Breadcrumb` component (no Shadcn Breadcrumb is installed). It reads `activeSection` from `LayoutContext` and renders a single-level label (e.g., "Assets", "Agents"). A Shadcn Breadcrumb component can be added via `npx shadcn-ui` in a future issue if multi-level navigation is needed.

**Rationale**: No `@radix-ui/react-breadcrumb` is installed. The current requirement is a single-level breadcrumb that just mirrors the active menu section name. A simple `<nav>` with `<ol>/<li>` is sufficient and accessible.

---

## Decision 7: CSS Animation for Sheet Slide-in

**Decision**: Add two keyframe animations to `globals.css`:

```css
@keyframes sheet-slide-in {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}
@keyframes sheet-slide-out {
  from { transform: translateX(0); }
  to   { transform: translateX(100%); }
}
```

These are applied to the `Sheet` content panel when `data-state="open"` and `data-state="closed"` respectively (Radix Dialog sets these attributes automatically).

**Rationale**: Consistent with how `globals.css` already defines animations for Dialog and Select. No additional animation library needed.

---

## Decision 8: Item List Content

**Decision**: The item list uses static/fake data (array of `{ id, label }` objects) per section. The `ItemList` component accepts the active section and renders a hardcoded stub list. Real data fetching is out of scope for this issue.

**Rationale**: Spec assumption: "Item list content will use static/fake data to demonstrate the layout."
