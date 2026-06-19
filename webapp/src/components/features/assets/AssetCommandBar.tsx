import { observer } from 'mobx-react-lite';
import Button from '../../ui/Button';
import { stores } from '../../../stores';

interface AssetCommandBarProps {
}

export const AssetCommandBar = observer(() => {
  const { assetStore } = stores;

  return (<>
    <Button variant={"outline"} size="sm" onClick={() => { assetStore.onCreateItem(); }} aria-label="Add new item">
      + Add
    </Button>
  </>)
});