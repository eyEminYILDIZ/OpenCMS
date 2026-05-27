# Quickstart: Web Application Base Layout

**Branch**: `005-webapp-layout`

## Prerequisites

- Node.js 18+
- npm (no yarn/pnpm)

## Run the app

```bash
cd webapp
npm install
npm start
# → http://localhost:3000
```

The dev server hot-reloads on every file save.

## What you should see

1. **Splash screen** — logo animates for 2 seconds (existing behavior).
2. **App layout** — after splash, the full shell renders:
   - Top header: logo (left), breadcrumb showing "Assets" (center), user placeholder (right).
   - Left sidebar: 6-tile grid menu with badges; item list below with fake items and an Add button.
   - Center: styled placeholder box.
   - Right panel: **hidden** on initial load.
   - Bottom: status bar with placeholder message.

## Try the right panel

- Click any item in the list → right panel slides in showing item details stub.
- Click the "Add" button → right panel slides in showing create form stub.
- Click the delete icon on a list item → right panel slides in showing delete confirmation stub.
- Click the × in the panel header or press Escape → panel slides out and disappears.

## Switch menu sections

- Click any of the 6 grid tiles → active tile highlights, breadcrumb updates, item list refreshes with that section's fake items, right panel closes if open.

## Type check

```bash
cd webapp
npm run type-check
# Should exit 0 with no errors
```

## Key files

| File | Purpose |
|------|---------|
| `src/context/LayoutContext.tsx` | Layout state provider + `useLayout` hook |
| `src/types/layout.ts` | `MenuSection`, `RightPanelMode`, `LayoutState` types |
| `src/components/layout/AppLayout.tsx` | Root shell composing all five regions |
| `src/components/layout/navbar/Navbar.tsx` | Header bar container |
| `src/components/layout/navbar/Logo.tsx` | App logo image |
| `src/components/layout/navbar/Breadcrumb.tsx` | Active section breadcrumb |
| `src/components/layout/navbar/UserBox.tsx` | User placeholder |
| `src/components/layout/sidebar/Sidebar.tsx` | Left column container |
| `src/components/layout/sidebar/grid-menu/GridMenu.tsx` | 6-tile grid menu |
| `src/components/layout/sidebar/grid-menu/GridMenuItem.tsx` | Single menu tile |
| `src/components/layout/sidebar/item-list/ItemList.tsx` | Item list container |
| `src/components/layout/sidebar/item-list/ItemListCommandBar.tsx` | Add button bar |
| `src/components/layout/sidebar/item-list/ItemListItem.tsx` | Single list row |
| `src/components/layout/right-panel/RightPanel.tsx` | Slide-in Sheet drawer |
| `src/components/layout/right-panel/RightPanelDetails.tsx` | Details stub |
| `src/components/layout/right-panel/RightPanelCreateForm.tsx` | Create form stub |
| `src/components/layout/right-panel/RightPanelDeleteConfirm.tsx` | Delete confirmation stub |
| `src/components/layout/StatusBar.tsx` | Full-width bottom status bar |
| `src/components/ui/Sheet.tsx` | Radix Dialog-based Sheet primitive |
| `src/components/ui/Badge.tsx` | Badge primitive for menu tile counts |
