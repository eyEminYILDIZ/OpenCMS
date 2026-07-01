import * as React from 'react';

function AirGunMarker({ size = 40, color = '#d00' }: { size?: number; color?: string }) {
    const airGunStyle = {
        cursor: 'pointer',
        fill: color,
        stroke: 'none'
    };
    return (
        <svg height={size} viewBox="0 0 24 24" style={airGunStyle}>
            {/* barrel + muzzle brake rotated 60° right from vertical */}
            <g transform="rotate(60, 12, 10)">
                <rect x="9.5" y="1" width="5" height="1.5" rx="0.3" />
                <rect x="11" y="1" width="2" height="11" rx="0.5" />
            </g>
            {/* breech block */}
            <rect x="8" y="10" width="8" height="5" rx="1" />
            {/* gun shield */}
            <rect x="5.5" y="10" width="2.5" height="4" rx="0.5" />
            {/* pivot mount */}
            <rect x="10.5" y="14" width="3" height="4" />
            {/* axle */}
            <rect x="5" y="17.5" width="14" height="1.5" rx="0.5" />
            {/* left wheel */}
            <circle cx="6" cy="20.5" r="2.2" />
            {/* right wheel */}
            <circle cx="18" cy="20.5" r="2.2" />
        </svg>
    );
}

export default React.memo(AirGunMarker);
