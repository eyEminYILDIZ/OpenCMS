import { observer } from 'mobx-react-lite';
import Button from '../../ui/Button';
import { stores } from '../../../stores';
import { Plus } from 'lucide-react';

export const DispatchCommandBar = observer(() => {
  const { dispatchStore } = stores;

  return (<>
    <Button variant={"command"} size="sm" onClick={() => { dispatchStore.onCreateItem(); }} aria-label="Add new item">
      <Plus /> Add
    </Button>
  </>)
});
