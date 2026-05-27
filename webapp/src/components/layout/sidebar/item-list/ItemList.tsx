import type { MenuSection, FakeListItem } from '../../../../types/layout';
import { useLayout } from '../../../../context/LayoutContext';
import ItemListCommandBar from './ItemListCommandBar';
import ItemListItem from './ItemListItem';

const FAKE_ITEMS: Record<MenuSection, FakeListItem[]> = {
  assets: [
    { id: 'asset-1', label: 'Asset 001 — Excavator' },
    { id: 'asset-2', label: 'Asset 002 — Generator' },
    { id: 'asset-3', label: 'Asset 003 — Crane' },
    { id: 'asset-4', label: 'Asset 004 — Forklift' },
    { id: 'asset-5', label: 'Asset 005 — Compressor' },
  ],
  agents: [
    { id: 'agent-1', label: 'Agent Alpha' },
    { id: 'agent-2', label: 'Agent Beta' },
    { id: 'agent-3', label: 'Agent Gamma' },
    { id: 'agent-4', label: 'Agent Delta' },
  ],
  operations: [
    { id: 'op-1', label: 'Operation Sunrise' },
    { id: 'op-2', label: 'Operation Dusk' },
    { id: 'op-3', label: 'Operation Echo' },
  ],
  placeholder1: [
    { id: 'p1-1', label: 'Item A' },
    { id: 'p1-2', label: 'Item B' },
    { id: 'p1-3', label: 'Item C' },
  ],
  placeholder2: [
    { id: 'p2-1', label: 'Item X' },
    { id: 'p2-2', label: 'Item Y' },
  ],
  placeholder3: [
    { id: 'p3-1', label: 'Sample 1' },
    { id: 'p3-2', label: 'Sample 2' },
    { id: 'p3-3', label: 'Sample 3' },
  ],
};

const ItemList = () => {
  const { activeSection, openRightPanel } = useLayout();
  const items = FAKE_ITEMS[activeSection];

  return (
    <div className="item-list">
      <ItemListCommandBar onAdd={() => openRightPanel('create')} />
      <div className="item-list-scroll">
        {items.map((item) => (
          <ItemListItem
            key={item.id}
            item={item}
            onSelect={(id) => openRightPanel('details', id)}
            onEdit={(id) => openRightPanel('details', id)}
            onDelete={(id) => openRightPanel('delete', id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemList;
