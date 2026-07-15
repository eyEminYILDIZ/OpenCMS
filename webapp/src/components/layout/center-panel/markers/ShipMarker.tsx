import * as React from 'react';

function ShipMarker({ size = 40, color = '#d00' }: { size?: number; color?: string }) {
    const shipStyle = {
        cursor: 'pointer',
        fill: color,
        stroke: 'none'
    };
    return (
        <svg height={size} viewBox="0 0 24 24" style={shipStyle}>
            {/* hull, bow forward (heading) */}
            <path d="M12,2 L19,13 L19,18 L5,18 L5,13 Z" />
            {/* superstructure */}
            <rect x="8" y="13.5" width="8" height="4" rx="1" />
            {/* bridge */}
            <rect x="10" y="10.5" width="4" height="3" rx="1" />
            {/* mast */}
            <rect x="11.5" y="8.5" width="1" height="2" />
            {/* portholes */}
            <rect x="7" y="15" width="1.6" height="1.6" fill="white" rx="0.4" />
            <rect x="15.4" y="15" width="1.6" height="1.6" fill="white" rx="0.4" />
        </svg>
    );
}

export default React.memo(ShipMarker);
