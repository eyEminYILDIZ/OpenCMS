import * as React from 'react';

function BuildingMarker({ size = 40, color = '#d00' }: { size?: number; color?: string }) {
    const buildingStyle = {
        cursor: 'pointer',
        fill: color,
        stroke: 'none'
    };
    return (
        <svg height={size} viewBox="0 0 24 24" style={buildingStyle}>
            {/* cornice */}
            <rect x="4" y="3.5" width="16" height="2" rx="0.8" />
            {/* tower */}
            <rect x="5" y="5.5" width="14" height="16.5" rx="1.2" />
            {/* windows */}
            <rect x="7" y="7.5" width="2" height="2" fill="white" />
            <rect x="11" y="7.5" width="2" height="2" fill="white" />
            <rect x="15" y="7.5" width="2" height="2" fill="white" />
            <rect x="7" y="11.5" width="2" height="2" fill="white" />
            <rect x="11" y="11.5" width="2" height="2" fill="white" />
            <rect x="15" y="11.5" width="2" height="2" fill="white" />
            {/* door */}
            <rect x="10" y="18" width="4" height="4" fill="white" rx="0.4" />
        </svg>
    );
}

export default React.memo(BuildingMarker);
