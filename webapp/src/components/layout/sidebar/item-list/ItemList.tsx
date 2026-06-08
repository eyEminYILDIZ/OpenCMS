import type { MenuSection, FakeListItem } from '../../../../types/layout';
import { useLayout } from '../../../../context/LayoutContext';
import ItemListCommandBar from './ItemListCommandBar';
import ItemListItem from './ItemListItem';
import { stores } from '../../../../stores';
import { AssetList } from './AssetList';
import { MenuTypes } from '../../../../types/MenuTypes';
import { observer } from 'mobx-react-lite';


const ItemList = observer(() => {
  const { activeSection, openRightPanel } = useLayout();
  const { applicationStore } = stores;

  const renderMenuList = () => {
    switch (applicationStore.currentMenu) {
      case MenuTypes.Assets:
        return <AssetList />
      default:
        return <p>No matching menu list found</p>
    }
  }

  return (
    <div className="item-list">
      <ItemListCommandBar onAdd={() => openRightPanel('create')} />
      <div className="item-list-scroll">
        {renderMenuList()}
      </div>
    </div>
  );
});

export default ItemList;
