import * as React from 'react';

function ShipMarker({ size = 40, color = '#d00' }: { size?: number; color?: string }) {
    const shipStyle = {
        cursor: 'pointer',
        fill: color,
        stroke: 'none'
    };
    return (
        <svg height={size} viewBox="0 0 24 24" style={shipStyle}>
            {/* hull */}
            <path d="M4 14 L12 22 L20 14 L20 10 L4 10 Z" />
            {/* superstructure */}
            <rect x="8" y="6" width="8" height="4" rx="1" />
            {/* bridge */}
            <rect x="10" y="3" width="4" height="3" rx="1" />
            {/* mast */}
            <rect x="11.5" y="1" width="1" height="2" />
            {/* portholes */}
            <rect x="6" y="11" width="2" height="2" fill="white" rx="1" />
            <rect x="11" y="11" width="2" height="2" fill="white" rx="1" />
            <rect x="16" y="11" width="2" height="2" fill="white" rx="1" />
        </svg>
    );
}

export default React.memo(ShipMarker);