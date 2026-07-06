import { Activity, Bot, Box, ClipboardClock } from 'lucide-react';
import { observer } from "mobx-react-lite";
import { useTranslation } from 'react-i18next';
import { stores } from "../../../../stores";
import { MenuConfig } from '../../../../types/Menu';
import { MenuTypes } from '../../../../types/MenuTypes';
import GridMenuItem from './GridMenuItem';

const GridMenu = observer(() => {
  const { applicationStore, agentStore, assetStore, operationStore } = stores;
  const { t } = useTranslation();

  const MENU_ITEMS: MenuConfig[] = [
    { type: MenuTypes.Assets, section: 'assets', label: t('menu.assets'), badgeCount: assetStore.assetItemCounts?.activeCount ?? 0, icon: Box },
    { type: MenuTypes.Agents, section: 'agents', label: t('menu.agents'), badgeCount: agentStore.agentItemCounts?.activeCount ?? 0, icon: Bot },
    { type: MenuTypes.Operations, section: 'operations', label: t('menu.operations'), badgeCount: operationStore.operationItemCounts?.activeCount ?? 0, icon: Activity },
    { type: MenuTypes.Dispatches, section: 'dispatches', label: t('menu.dispatches'), badgeCount: 0, icon: ClipboardClock },
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
