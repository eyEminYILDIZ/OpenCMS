import { observer } from 'mobx-react-lite';
import { stores } from '../../../../stores';
import { MenuTypes } from '../../../../types';
import { AssetCommandBar, AgentCommandBar, OperationCommandBar, DispatchCommandBar } from '../../../features';

export const ItemListCommandBar = observer(() => {
  const { applicationStore } = stores;

  const renderContent = () => {
    switch (applicationStore.currentMenu) {
      case MenuTypes.Assets:
        return <AssetCommandBar />;
      case MenuTypes.Agents:
        return <AgentCommandBar />;
      case MenuTypes.Operations:
        return <OperationCommandBar />;
      case MenuTypes.Dispatches:
        return <DispatchCommandBar />;
      default:
        return <p className="right-panel-empty">No matched commandbar found</p>;
    }
  };

  return (<div className="item-list-command-bar">
    {renderContent()}
  </div>)
});
