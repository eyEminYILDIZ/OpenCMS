# Data Model: Web Application Base Layout

**Date**: 2026-05-27 | **Branch**: `005-webapp-layout`

> This feature contains no persistent data. All entities described here are in-memory UI state types defined in `src/types/layout.ts`.

---

## MenuSection

Represents one of the six navigation sections available in the grid menu.

| Field | Type | Notes |
|-------|------|-------|
| id | `MenuSection` (string union) | `'assets' \| 'agents' \| 'operations' \| 'placeholder1' \| 'placeholder2' \| 'placeholder3'` |
| label | `string` | Display name shown on the tile and in the breadcrumb |
| badgeCount | `number` | Fake/static numeric count shown on the tile badge |
| icon | `LucideIcon` (optional) | lucide-react icon component reference |

**State transitions**: Only one section is active at a time. Selecting a section:
1. Sets `activeSection` in LayoutContext.
2. Resets `rightPanelMode` to `null` (closes the right panel).
3. Updates the breadcrumb label.

---

## RightPanelMode

Controls what content is rendered inside the right panel drawer.

| Value | Meaning |
|-------|---------|
| `null` | Panel is hidden (default on load) |
| `'details'` | Triggered by clicking an item in the list; shows item detail stub |
| `'create'` | Triggered by clicking the "Add" button; shows create form stub |
| `'delete'` | Triggered by clicking the delete action on a list item; shows delete confirmation stub |

---

## LayoutState

The single shared state object managed by `LayoutContext`.

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| activeSection | `MenuSection` | `'assets'` | The currently highlighted menu tile |
| rightPanelMode | `RightPanelMode` | `null` | Drives Sheet open/closed and content rendered |
| selectedItemId | `string \| null` | `null` | ID of the list item that triggered the panel (details or delete mode) |

---

## FakeListItem

Stub data shape used to populate the item list per section.

| Field | Type | Notes |
|-------|------|-------|
| id | `string` | Unique identifier (e.g., `'asset-1'`) |
| label | `string` | Display name in the list row |

Static arrays of `FakeListItem` are defined per `MenuSection` inside `ItemList.tsx` (or a co-located constants file). No API calls, no caching.

---

## Component State Ownership

| State | Owner | Shared via |
|-------|-------|-----------|
| `activeSection` | `LayoutContext` | Context |
| `rightPanelMode` | `LayoutContext` | Context |
| `selectedItemId` | `LayoutContext` | Context |
| Status bar message | `AppStatusBar` | Local state (static placeholder text) |
| User box display | `AppHeader` | Local state (static placeholder string) |
