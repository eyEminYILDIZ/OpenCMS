import { observer } from 'mobx-react-lite';
import Button from '../../ui/Button';
import { stores } from '../../../stores';

export const OperationCommandBar = observer(() => {
  const { operationStore } = stores;

  return (<>
    <Button variant={"outline"} size="sm" onClick={() => { operationStore.onCreateItem(); }} aria-label="Add new item">
      + Add
    </Button>
  </>)
});
