import { Pencil, Trash2 } from 'lucide-react';
import type { FakeListItem } from '../../../../types/layout';

interface ItemListItemProps {
  item: FakeListItem;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ItemListItem = ({ item, onSelect, onEdit, onDelete }: ItemListItemProps) => (
  <div
    className="item-list-item"
    role="button"
    tabIndex={0}
    onClick={() => onSelect(item.id)}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(item.id); }}
  >
    <span className="item-list-item-label">{item.label}</span>
    <button
      type="button"
      className="item-list-item-edit"
      aria-label={`Edit ${item.label}`}
      onClick={(e) => { e.stopPropagation(); onEdit(item.id); }}
    >
      <Pencil size={14} aria-hidden="true" />
    </button>
    <button
      type="button"
      className="item-list-item-delete"
      aria-label={`Delete ${item.label}`}
      onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
    >
      <Trash2 size={14} aria-hidden="true" />
    </button>
  </div>
);

export default ItemListItem;
