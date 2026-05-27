import { Box, Bot, Activity, Circle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { MenuSection } from '../../../../types/layout';
import { useLayout } from '../../../../context/LayoutContext';
import GridMenuItem from './GridMenuItem';

interface MenuConfig {
  section: MenuSection;
  label: string;
  badgeCount: number;
  icon: LucideIcon;
}

const MENU_ITEMS: MenuConfig[] = [
  { section: 'assets',       label: 'Assets',       badgeCount: 12, icon: Box },
  { section: 'agents',       label: 'Agents',       badgeCount: 5,  icon: Bot },
  { section: 'operations',   label: 'Operations',   badgeCount: 8,  icon: Activity },
  { section: 'placeholder1', label: 'Placeholder 1', badgeCount: 3,  icon: Circle },
  { section: 'placeholder2', label: 'Placeholder 2', badgeCount: 7,  icon: Circle },
  { section: 'placeholder3', label: 'Placeholder 3', badgeCount: 2,  icon: Circle },
];

const GridMenu = () => {
  const { activeSection, setActiveSection } = useLayout();

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
};

export default GridMenu;
