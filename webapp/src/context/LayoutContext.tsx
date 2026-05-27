import { createContext, useContext, useState } from 'react';
import type { LayoutContextValue, MenuSection, RightPanelMode } from '../types/layout';

const LayoutContext = createContext<LayoutContextValue | null>(null);

export const useLayout = (): LayoutContextValue => {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used inside LayoutProvider');
  return ctx;
};

interface LayoutProviderProps {
  children: React.ReactNode;
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [activeSection, setActiveSectionState] = useState<MenuSection>('assets');
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const setActiveSection = (section: MenuSection) => {
    setActiveSectionState(section);
    setRightPanelMode(null);
    setSelectedItemId(null);
  };

  const openRightPanel = (mode: Exclude<RightPanelMode, null>, itemId?: string) => {
    setRightPanelMode(mode);
    setSelectedItemId(itemId ?? null);
  };

  const closeRightPanel = () => {
    setRightPanelMode(null);
    setSelectedItemId(null);
  };

  return (
    <LayoutContext.Provider
      value={{ activeSection, rightPanelMode, selectedItemId, setActiveSection, openRightPanel, closeRightPanel }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
