import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { stores } from '../../../../stores';
import { MenuTypes } from '../../../../types';
import { AssetCommandBar, AgentCommandBar, OperationCommandBar } from '../../../features';

export const ItemListCommandBar = observer(() => {
  const { applicationStore } = stores;
  const { t } = useTranslation();

  const renderContent = () => {
    switch (applicationStore.currentMenu) {
      case MenuTypes.Assets:
        return <AssetCommandBar />;
      case MenuTypes.Agents:
        return <AgentCommandBar />;
      case MenuTypes.Operations:
        return <OperationCommandBar />;
      case MenuTypes.Dispatches:
        return <p className="right-panel-empty">{t('menu.comingSoon')}</p>;
      default:
        return <p className="right-panel-empty">No matched commandbar found</p>;
    }
  };

  return (<div className="item-list-command-bar">
    {renderContent()}
  </div>)
});
