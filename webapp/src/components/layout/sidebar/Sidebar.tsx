import GridMenu from './grid-menu/GridMenu';
import ItemList from './item-list/ItemList';

const Sidebar = () => (
  <div className="sidebar">
    <GridMenu />
    <hr className="sidebar-divider" />
    <ItemList />
  </div>
);

export default Sidebar;
