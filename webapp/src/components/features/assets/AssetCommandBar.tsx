import { observer } from 'mobx-react-lite';
import Button from '../../ui/Button';
import { stores } from '../../../stores';
import { Plus } from 'lucide-react';

interface AssetCommandBarProps {
}

export const AssetCommandBar = observer(() => {
  const { assetStore } = stores;

  return (<>
    <Button variant={"command"} size="sm" onClick={() => { assetStore.onCreateItem(); }} aria-label="Add new item">
      <Plus /> Add
    </Button>
  </>)
});