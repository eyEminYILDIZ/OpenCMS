import { Activity, Bot, Box, Circle } from 'lucide-react';
import { observer } from "mobx-react-lite";
import { stores } from "../../../../stores";
import { MenuConfig } from '../../../../types/Menu';
import { MenuTypes } from '../../../../types/MenuTypes';
import GridMenuItem from './GridMenuItem';

const GridMenu = observer(() => {
  const { applicationStore, agentStore, assetStore, operationStore } = stores;

  const MENU_ITEMS: MenuConfig[] = [
    { type: MenuTypes.Assets, section: 'assets', label: 'Assets', badgeCount: assetStore.assetItemCounts?.activeCount ?? 0, icon: Box },
    { type: MenuTypes.Agents, section: 'agents', label: 'Agents', badgeCount: agentStore.agentItemCounts?.activeCount ?? 0, icon: Bot },
    { type: MenuTypes.Operations, section: 'operations', label: 'Operations', badgeCount: operationStore.operationItemCounts?.activeCount ?? 0, icon: Activity },
    { type: MenuTypes.PlaceHolder1, section: 'placeholder1', label: 'Placeholder 1', badgeCount: 0, icon: Circle },
    { type: MenuTypes.PlaceHolder2, section: 'placeholder2', label: 'Placeholder 2', badgeCount: 0, icon: Circle },
    { type: MenuTypes.PlaceHolder3, section: 'placeholder3', label: 'Placeholder 3', badgeCount: 0, icon: Circle },
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
          isActive={applicationStore.currentMenu === item.type}
          onClick={() => applicationStore.changeMenu(item.type)}
        />
      ))}
    </nav>
  );
});

export default GridMenu;
