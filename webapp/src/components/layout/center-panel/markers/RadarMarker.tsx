import * as React from 'react';

function RadarMarker({ size = 40, color = '#d00' }: { size?: number; color?: string }) {
    const radarStyle = {
        cursor: 'pointer',
        fill: 'none',
        stroke: color,
        strokeWidth: 1.5,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const
    };
    return (
        <svg height={size} viewBox="0 0 24 24" style={radarStyle}>
            {/* dish, concave face forward (heading) */}
            <path d="M4,9 Q12,16 20,9" />
            <path d="M4,9 Q12,12.5 20,9" />
            {/* struts to feed horn */}
            <line x1="4" y1="9" x2="12" y2="5" />
            <line x1="20" y1="9" x2="12" y2="5" />
            {/* support post */}
            <line x1="12" y1="9" x2="12" y2="17" />
            {/* feed horn */}
            <circle cx="12" cy="5" r="1.2" fill={color} stroke="none" />
            {/* base plate */}
            <rect x="8" y="17.5" width="8" height="1.6" rx="0.6" fill={color} stroke="none" />
        </svg>
    );
}

export default React.memo(RadarMarker);
