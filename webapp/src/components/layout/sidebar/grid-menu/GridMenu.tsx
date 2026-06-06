import { Box, Bot, Activity, Circle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { MenuSection } from '../../../../types/layout';
import { useLayout } from '../../../../context/LayoutContext';
import GridMenuItem from './GridMenuItem';
import { stores } from "../../../../stores";
import { observer } from "mobx-react-lite"

interface MenuConfig {
  section: MenuSection;
  label: string;
  badgeCount: number;
  icon: LucideIcon;
}

const GridMenu = observer(() => {
  const { activeSection, setActiveSection } = useLayout();
  const { applicationStore, agentStore, assetStore } = stores;

  const MENU_ITEMS: MenuConfig[] = [
    { section: 'assets', label: 'Assets', badgeCount: assetStore.assetItemCounts?.activeCount ?? 0, icon: Box },
    { section: 'agents', label: 'Agents', badgeCount: agentStore.agentItemCounts?.activeCount ?? 0, icon: Bot },
    { section: 'operations', label: 'Operations', badgeCount: applicationStore.operationItemCounts?.activeCount ?? 0, icon: Activity },
    { section: 'placeholder1', label: 'Placeholder 1', badgeCount: 0, icon: Circle },
    { section: 'placeholder2', label: 'Placeholder 2', badgeCount: 0, icon: Circle },
    { section: 'placeholder3', label: 'Placeholder 3', badgeCount: 0, icon: Circle },
  ];

  return (
    <nav className="grid-menu" aria-label="Main navigation">
      {MENU_ITEMS.map((item) => (
        <GridMenuItem
          key={item.section}
          section={item.section}
          label={item.label}
          badgeCount={item.badgeCount}
          icon={item.icon}
          isActive={activeSection === item.section}
          onClick={() => setActiveSection(item.section)}
        />
      ))}
    </nav>
  );
});

export default GridMenu;
