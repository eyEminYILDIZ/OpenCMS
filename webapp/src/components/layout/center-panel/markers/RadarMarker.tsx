import * as React from 'react';

const radarStyle = {
    cursor: 'pointer',
    fill: 'none',
    stroke: '#d00',
    strokeWidth: 1.5
};

function RadarMarker({ size = 40 }) {
    return (
        <svg height={size} viewBox="0 0 24 24" style={radarStyle}>
            {/* concentric arcs */}
            <path d="M12 12 m-8 0 a8 8 0 0 1 8-8" />
            <path d="M12 12 m-5 0 a5 5 0 0 1 5-5" />
            <path d="M12 12 m-2.5 0 a2.5 2.5 0 0 1 2.5-2.5" />
            {/* sweep line */}
            <line x1="12" y1="12" x2="17.66" y2="5.34" />
            {/* center dot */}
            <circle cx="12" cy="12" r="1" fill="#d00" />
            {/* base pole */}
            <line x1="12" y1="12" x2="12" y2="21" />
            {/* base feet */}
            <line x1="8" y1="21" x2="16" y2="21" />
        </svg>
    );
}

export default React.memo(RadarMarker);