import { observer } from 'mobx-react-lite';
import { Plus, ArrowLeft, Pencil, Trash2, PackagePlus, ShoppingCartIcon, Activity } from 'lucide-react';
import Button from '../../ui/Button';
import { stores } from '../../../stores';
import { PanelModes } from '../../../types';
import { OperationTabs } from '../../../stores/OperationStore';

export const OperationCommandBar = observer(() => {
  const { operationStore, statusBarStore } = stores;

  if (operationStore.selectedItem === undefined) {
    return (<>
      <Button
        variant={"command"}
        size="sm"
        onClick={() => { operationStore.onCreateItem(); }}
        aria-label="Add new item">
        <Plus /> Add
      </Button>
    </>)
  }

  return (<>
    <Button
      variant={"command"}
      size="sm"
      onClick={() => { operationStore.onBackToList(); }}
      aria-label="back">
      <ArrowLeft /> Back
    </Button>
    {operationStore.selectedTab === OperationTabs.Details && (<>
      <Button
        variant={"command"}
        size="sm"
        onClick={() => {
          operationStore.setPanelMode(PanelModes.Update);
        }} aria-label="Update item">
        <Pencil /> Edit
      </Button>
      <Button
        variant={"command"}
        size="sm"
        onClick={() => {
          operationStore.setPanelMode(PanelModes.Delete);
        }} aria-label="Delete item">
        <Trash2 /> Delete
      </Button>
    </>
    )}
    {operationStore.selectedTab === OperationTabs.Assets && (<Button
      variant={"command"}
      size="sm"
      onClick={() => { statusBarStore.showError("add asset not implemented") }}
      aria-label="Add new item"
    >
      <Plus /> Add Asset
    </Button>)}
    {operationStore.selectedTab === OperationTabs.Orders && (<Button
      variant={"command"}
      size="sm"
      onClick={() => { statusBarStore.showError("add order not implemented") }}
      aria-label="Add new item"
    >
      <Plus /> Add Order
    </Button>)}
  </>)
});
