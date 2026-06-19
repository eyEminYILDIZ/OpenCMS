import { observer } from 'mobx-react-lite';
import Button from '../../../ui/Button';
import { stores } from '../../../../stores';
import { MenuTypes, PanelModes } from '../../../../types';
import { AssetCommandBar } from '../../../features';

interface ItemListCommandBarProps {
}

export const ItemListCommandBar = observer(() => {
  const { assetStore, agentStore, applicationStore } = stores;


  const renderContent = () => {
    switch (applicationStore.currentMenu) {
      case MenuTypes.Assets:
        return <AssetCommandBar />;
      case MenuTypes.Agents:
      // return <AgentCommandBar />;
      case MenuTypes.Operations:
      // return <OperationCommandBar />;
      default:
        return <p className="right-panel-empty">No matched commandbar found</p>;
    }
  };

  return (<div className="item-list-command-bar">
    {renderContent()}
  </div>)
});

