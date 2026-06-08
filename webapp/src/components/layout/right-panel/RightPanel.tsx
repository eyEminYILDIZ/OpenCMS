import { useLayout } from '../../../context/LayoutContext';
import Sheet from '../../ui/Sheet';
import RightPanelDetails from './RightPanelDetails';
import RightPanelCreateForm from './RightPanelCreateForm';
import RightPanelDeleteConfirm from './RightPanelDeleteConfirm';
import { observer } from 'mobx-react-lite';
import { stores } from '../../../stores';
import { MenuTypes } from '../../../types/MenuTypes';
import { AssetDetail } from './AssetDetail';

const PANEL_TITLES: Record<string, string> = {
  details: 'Item Details',
  create: 'Create Item',
  delete: 'Delete Item',
};

const RightPanel = observer(() => {
  const { rightPanelMode, selectedItemId, closeRightPanel } = useLayout();
  const { applicationStore, assetStore } = stores;

  const renderPanel = () => {
    switch (applicationStore.currentMenu) {
      case MenuTypes.Assets:
        return <AssetDetail />
      default:
        return <p>No matched panel found.</p>
    }
  }

  return (
    <Sheet
      open={rightPanelMode !== null}
      onClose={closeRightPanel}
      title={rightPanelMode ? PANEL_TITLES[rightPanelMode] : ''}
    >
      {renderPanel()}
    </Sheet>
  );
});

export default RightPanel;
