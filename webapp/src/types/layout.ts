export type MenuSection =
  | 'assets'
  | 'agents'
  | 'operations'
  | 'placeholder1'
  | 'placeholder2'
  | 'placeholder3';

export type RightPanelMode = 'details' | 'create' | 'delete' | null;

export interface LayoutState {
  activeSection: MenuSection;
  rightPanelMode: RightPanelMode;
  selectedItemId: string | null;
}

export interface LayoutContextValue extends LayoutState {
  setActiveSection: (section: MenuSection) => void;
  openRightPanel: (mode: Exclude<RightPanelMode, null>, itemId?: string) => void;
  closeRightPanel: () => void;
}

export interface FakeListItem {
  id: string;
  label: string;
}
