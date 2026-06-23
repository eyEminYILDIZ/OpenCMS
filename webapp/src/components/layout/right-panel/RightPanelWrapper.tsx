import React from 'react';

interface RightPanelWrapperProps {
    children: React.ReactNode;
}

export const RightPanelWrapper: React.FC<RightPanelWrapperProps> = ({ children }) => (
    <div className="right-panel-wrapper">{children}</div>
);
