import Button from '../../../ui/Button';

interface ItemListCommandBarProps {
  onAdd: () => void;
}

const ItemListCommandBar = ({ onAdd }: ItemListCommandBarProps) => (
  <div className="item-list-command-bar">
    <Button size="sm" onClick={onAdd} aria-label="Add new item">
      + Add
    </Button>
  </div>
);

export default ItemListCommandBar;
