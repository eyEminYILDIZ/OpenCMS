import { ChevronLeft, ChevronRight } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useLayout } from '../../../context/LayoutContext';
import { stores } from '../../../stores';
import { MenuTypes } from '../../../types/MenuTypes';
import { AgentDetail, AgentDelete, AssetDelete, AssetDetail, OperationDetail, OperationDelete, AssetCreate, AssetUpdate } from '../../features';
import { PanelModes } from '../../../types';

const RightPanel = observer(() => {
  const { rightPanelOpen, toggleRightPanel } = useLayout();
  const { applicationStore, assetStore, agentStore, operationStore } = stores;

  const renderContent = () => {
    switch (applicationStore.currentMenu) {
      case MenuTypes.Assets:
        switch (assetStore.panelMode) {
          case PanelModes.Detail:
            return <AssetDetail />;
          case PanelModes.Delete:
            return <AssetDelete />;
          case PanelModes.Create:
            return <AssetCreate />;
          case PanelModes.Update:
            return <AssetUpdate />;
        }
      case MenuTypes.Agents:
        switch (agentStore.panelMode) {
          case PanelModes.Detail:
            return <AgentDetail />;
          case PanelModes.Delete:
            return <AgentDelete />;
        }
      case MenuTypes.Operations:
        switch (operationStore.panelMode) {
          case PanelModes.Detail:
            return <OperationDetail />;
          case PanelModes.Delete:
            return <OperationDelete />;
        }
      default:
        return <p className="right-panel-empty">No panel for this section.</p>;
    }
  };

  return (
    <aside className={`right-panel${rightPanelOpen ? ' right-panel--open' : ''}`}>
      <button
        className="right-panel-toggle"
        onClick={toggleRightPanel}
        aria-label={rightPanelOpen ? 'Collapse panel' : 'Expand panel'}
      >
        {rightPanelOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      {rightPanelOpen && (
        <div className="right-panel-body">
          {renderContent()}
        </div>
      )}
    </aside>
  );
});

export default RightPanel;
