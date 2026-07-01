import * as React from 'react';

function VehicleMarker({ size = 40, color = '#d00' }: { size?: number; color?: string }) {
    const vehicleStyle = {
        cursor: 'pointer',
        fill: color,
        stroke: 'none'
    };
    return (
        <svg height={size} viewBox="0 0 24 24" style={vehicleStyle}>
            {/* car body */}
            <rect x="2" y="13" width="20" height="6" rx="1" />
            {/* cabin */}
            <path d="M6 13 L8 8 L16 8 L18 13 Z" />
            {/* windshield cutout */}
            <path d="M9 8.5 L7.5 12.5 L16.5 12.5 L15 8.5 Z" fill="white" />
            {/* front wheel */}
            <circle cx="6" cy="19" r="2.5" fill={color} stroke="white" strokeWidth="1" />
            <circle cx="6" cy="19" r="1" fill="white" />
            {/* rear wheel */}
            <circle cx="18" cy="19" r="2.5" fill={color} stroke="white" strokeWidth="1" />
            <circle cx="18" cy="19" r="1" fill="white" />
        </svg>
    );
}

export default React.memo(VehicleMarker);