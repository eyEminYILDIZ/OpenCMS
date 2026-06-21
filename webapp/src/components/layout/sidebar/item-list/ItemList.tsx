import { observer } from 'mobx-react-lite';
import { useLayout } from '../../../../context/LayoutContext';
import { stores } from '../../../../stores';
import { MenuTypes } from '../../../../types/MenuTypes';
import { AgentSidebar, AssetSidebar, OperationSidebar, } from '../../../features';
import { ItemListCommandBar } from './ItemListCommandBar';
import { ItemListSearchBar } from './ItemListSearchBar';

const ItemList = observer(() => {
  const { activeSection, openRightPanel } = useLayout();
  const { applicationStore } = stores;

  const renderMenuList = () => {
    switch (applicationStore.currentMenu) {
      case MenuTypes.Assets:
        return <AssetSidebar />
      case MenuTypes.Agents:
        return <AgentSidebar />
      case MenuTypes.Operations:
        return <OperationSidebar />
      default:
        return <p>No matching menu list found</p>
    }
  }

  return (
    <div className="item-list">
      <ItemListCommandBar />
      <ItemListSearchBar />
      <div className="item-list-scroll">
        {renderMenuList()}
      </div>
    </div>
  );
});

export default ItemList;
