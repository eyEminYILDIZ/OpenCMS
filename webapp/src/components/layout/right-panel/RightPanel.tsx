import { useLayout } from '../../../context/LayoutContext';
import Sheet from '../../ui/Sheet';
import RightPanelDetails from './RightPanelDetails';
import RightPanelCreateForm from './RightPanelCreateForm';
import RightPanelDeleteConfirm from './RightPanelDeleteConfirm';

const PANEL_TITLES: Record<string, string> = {
  details: 'Item Details',
  create: 'Create Item',
  delete: 'Delete Item',
};

const RightPanel = () => {
  const { rightPanelMode, selectedItemId, closeRightPanel } = useLayout();

  return (
    <Sheet
      open={rightPanelMode !== null}
      onClose={closeRightPanel}
      title={rightPanelMode ? PANEL_TITLES[rightPanelMode] : ''}
    >
      {rightPanelMode === 'details' && <RightPanelDetails itemId={selectedItemId} />}
      {rightPanelMode === 'create' && <RightPanelCreateForm />}
      {rightPanelMode === 'delete' && <RightPanelDeleteConfirm itemId={selectedItemId} />}
    </Sheet>
  );
};

export default RightPanel;
