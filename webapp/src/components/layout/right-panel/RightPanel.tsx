import { ChevronLeft, ChevronRight } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useLayout } from '../../../context/LayoutContext';
import { stores } from '../../../stores';
import { MenuTypes } from '../../../types/MenuTypes';
import { AgentDetail, AgentDelete, AgentCreate, AgentUpdate, AssetDelete, AssetDetail, OperationDetail, OperationDelete, OperationCreate, OperationUpdate, AssetCreate, AssetUpdate, OperationOrderCreate, OperationOrderUpdate, OperationAssetDelete, OperationOrderDelete, OperationAssetDetail, OperationOrderDetail, DispatchDetail, DispatchDelete, DispatchCreate, DispatchUpdate } from '../../features';
import { PanelModes } from '../../../types';
import { OperationTabs } from '../../../stores/OperationStore';
import { OperationAssetCreate } from '../../features/operations/panels/OperationAssetCreate';

const RightPanel = observer(() => {
  const { rightPanelOpen, toggleRightPanel } = useLayout();
  const { applicationStore, assetStore, agentStore, operationStore, dispatchStore } = stores;

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
          case PanelModes.Create:
            return <AgentCreate />;
          case PanelModes.Update:
            return <AgentUpdate />;
        }
      case MenuTypes.Operations:
        if (operationStore.selectedTab === OperationTabs.Details) {
          switch (operationStore.panelMode) {
            case PanelModes.Detail:
              return <OperationDetail />;
            case PanelModes.Delete:
              return <OperationDelete />;
            case PanelModes.Create:
              return <OperationCreate />;
            case PanelModes.Update:
              return <OperationUpdate />;
          }
        } else if (operationStore.selectedTab === OperationTabs.Assets) {
          switch (operationStore.panelMode) {
            case PanelModes.Detail:
              return <OperationAssetDetail />;
            case PanelModes.Create:
              return <OperationAssetCreate />;
            case PanelModes.Delete:
              return <OperationAssetDelete />;
          }
        } else if (operationStore.selectedTab === OperationTabs.Orders) {
          switch (operationStore.panelMode) {
            case PanelModes.Detail:
              return <OperationOrderDetail />;
            case PanelModes.Create:
              return <OperationOrderCreate />;
            case PanelModes.Update:
              return <OperationOrderUpdate />;
            case PanelModes.Delete:
              return <OperationOrderDelete />;
          }
        }
      case MenuTypes.Dispatches:
        switch (dispatchStore.panelMode) {
          case PanelModes.Detail:
            return <DispatchDetail />;
          case PanelModes.Delete:
            return <DispatchDelete />;
          case PanelModes.Create:
            return <DispatchCreate />;
          case PanelModes.Update:
            return <DispatchUpdate />;
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
