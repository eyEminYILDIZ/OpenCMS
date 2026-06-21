import { observer } from 'mobx-react-lite';
import Button from '../../ui/Button';
import { stores } from '../../../stores';
import { Plus } from 'lucide-react';

export const AgentCommandBar = observer(() => {
  const { agentStore } = stores;

  return (<>
    <Button variant={"command"} size="sm" onClick={() => { agentStore.onCreateItem(); }} aria-label="Add new item">
      <Plus /> Add
    </Button>
  </>)
});
