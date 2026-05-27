interface RightPanelDeleteConfirmProps {
  itemId: string | null;
}

const RightPanelDeleteConfirm = ({ itemId }: RightPanelDeleteConfirmProps) => (
  <div className="right-panel-section">
    <span className="right-panel-label">Delete Item</span>
    <span className="right-panel-value">{itemId ?? '—'}</span>
    <span className="right-panel-description">
      Delete confirmation and action buttons will be implemented in a future issue.
    </span>
  </div>
);

export default RightPanelDeleteConfirm;
