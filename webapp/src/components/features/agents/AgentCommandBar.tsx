import { observer } from 'mobx-react-lite';
import Button from '../../ui/Button';
import { stores } from '../../../stores';

export const AgentCommandBar = observer(() => {
  const { agentStore } = stores;

  return (<>
    <Button variant={"outline"} size="sm" onClick={() => { agentStore.onCreateItem(); }} aria-label="Add new item">
      + Add
    </Button>
  </>)
});
