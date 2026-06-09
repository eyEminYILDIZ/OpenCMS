import { ChevronLeft, ChevronRight } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useLayout } from '../../../context/LayoutContext';
import { stores } from '../../../stores';
import { MenuTypes } from '../../../types/MenuTypes';
import { AgentDetail, AssetDetail } from '../../features';

const RightPanel = observer(() => {
  const { rightPanelOpen, toggleRightPanel } = useLayout();
  const { applicationStore } = stores;

  const renderContent = () => {
    switch (applicationStore.currentMenu) {
      case MenuTypes.Assets:
        return <AssetDetail />;
      case MenuTypes.Agents:
        return <AgentDetail />;
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
