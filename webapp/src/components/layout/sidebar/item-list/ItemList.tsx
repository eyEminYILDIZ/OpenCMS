import { observer } from 'mobx-react-lite';
import { useLayout } from '../../../../context/LayoutContext';
import { stores } from '../../../../stores';
import { MenuTypes } from '../../../../types/MenuTypes';
import { AgentList, AssetList, OperationList } from '../../../features';
import { ItemListCommandBar } from './ItemListCommandBar';
import { ItemListSearchBar } from './ItemListSearchBar';

const ItemList = observer(() => {
  const { activeSection, openRightPanel } = useLayout();
  const { applicationStore } = stores;

  const renderMenuList = () => {
    switch (applicationStore.currentMenu) {
      case MenuTypes.Assets:
        return <AssetList />
      case MenuTypes.Agents:
        return <AgentList />
      case MenuTypes.Operations:
        return <OperationList />
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
