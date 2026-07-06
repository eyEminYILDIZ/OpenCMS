export type MenuSection =
  | 'assets'
  | 'agents'
  | 'operations'
  | 'dispatches';

export type RightPanelMode = 'details' | 'create' | 'delete' | null;

export interface LayoutState {
  activeSection: MenuSection;
  rightPanelMode: RightPanelMode;
  selectedItemId: string | null;
}

export interface LayoutContextValue extends LayoutState {
  rightPanelOpen: boolean;
  setActiveSection: (section: MenuSection) => void;
  openRightPanel: (mode: Exclude<RightPanelMode, null>, itemId?: string) => void;
  closeRightPanel: () => void;
  toggleRightPanel: () => void;
}

export interface FakeListItem {
  id: string;
  label: string;
}
