import * as React from 'react';

function AirGunMarker({ size = 40, color = '#d00' }: { size?: number; color?: string }) {
    const airGunStyle = {
        cursor: 'pointer',
        fill: color,
        stroke: 'none'
    };
    return (
        <svg height={size} viewBox="0 0 24 24" style={airGunStyle}>
            {/* muzzle brake */}
            <rect x="10.5" y="1" width="3" height="1.4" rx="0.3" />
            {/* barrel, points forward (heading) */}
            <rect x="11" y="1" width="2" height="9" rx="0.5" />
            {/* shield */}
            <rect x="8" y="10" width="8" height="3" rx="0.6" />
            {/* breech / carriage */}
            <rect x="9" y="13" width="6" height="4" rx="1" />
            {/* trail legs, splayed backward */}
            <path d="M10 17 L5.5 22 L7.3 22 L11.3 17.5 Z" />
            <path d="M14 17 L18.5 22 L16.7 22 L12.7 17.5 Z" />
            {/* wheels */}
            <circle cx="7" cy="17.5" r="1.9" />
            <circle cx="17" cy="17.5" r="1.9" />
        </svg>
    );
}

export default React.memo(AirGunMarker);
