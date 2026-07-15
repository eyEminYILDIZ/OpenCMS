import * as React from 'react';

function DroneMarker({ size = 40, color = '#d00' }: { size?: number; color?: string }) {
    const droneStyle = {
        cursor: 'pointer',
        fill: color,
        stroke: 'none'
    };
    return (
        <svg height={size} viewBox="0 0 24 24" style={droneStyle}>
            {/* arms */}
            <path d="M12 12 L6 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M12 12 L18 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M12 12 L6 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M12 12 L18 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* rotors */}
            <circle cx="6" cy="6" r="2.8" fill="none" stroke={color} strokeWidth="1.8" />
            <circle cx="18" cy="6" r="2.8" fill="none" stroke={color} strokeWidth="1.8" />
            <circle cx="6" cy="18" r="2.8" fill="none" stroke={color} strokeWidth="1.8" />
            <circle cx="18" cy="18" r="2.8" fill="none" stroke={color} strokeWidth="1.8" />
            {/* rotor hubs */}
            <circle cx="6" cy="6" r="1" />
            <circle cx="18" cy="6" r="1" />
            <circle cx="6" cy="18" r="1" />
            <circle cx="18" cy="18" r="1" />
            {/* body */}
            <rect x="9" y="9" width="6" height="6" rx="1.6" />
        </svg>
    );
}

export default React.memo(DroneMarker);
