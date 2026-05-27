interface RightPanelDetailsProps {
  itemId: string | null;
}

const RightPanelDetails = ({ itemId }: RightPanelDetailsProps) => (
  <div className="right-panel-section">
    <span className="right-panel-label">Item Details</span>
    <span className="right-panel-value">{itemId ?? '—'}</span>
    <span className="right-panel-description">
      Detailed information about the selected item will appear here.
    </span>
  </div>
);

export default RightPanelDetails;
