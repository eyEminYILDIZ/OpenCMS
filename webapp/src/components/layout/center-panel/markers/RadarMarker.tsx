import * as React from 'react';

const radarStyle = {
    cursor: 'pointer',
    fill: 'none',
    stroke: '#d00',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
};

function RadarMarker({ size = 40 }) {
    return (
        <svg height={size} viewBox="0 0 24 24" style={radarStyle}>
            {/* dish assembly: rotate 30° CW from vertical → 60° elevation pointing upper-right */}
            <g transform="rotate(30, 12, 8)">
                {/* outer arc – back of dish, control point bows DOWN so concave face is UP */}
                <path d="M 2,8 Q 12,16 22,8" />
                {/* inner arc – reflector face, shallower bow */}
                <path d="M 2,8 Q 12,11 22,8" />
                {/* left rim strut to feed horn */}
                <line x1="2" y1="8" x2="12" y2="4" />
                {/* right rim strut to feed horn */}
                <line x1="22" y1="8" x2="12" y2="4" />
                {/* feed horn */}
                <circle cx="12" cy="4" r="1.3" />
            </g>
            {/* elevation pivot / azimuth pillar */}
            <line x1="12" y1="8" x2="12" y2="18" />
            {/* trailer axle */}
            <line x1="6" y1="18" x2="18" y2="18" />
            {/* left wheel */}
            <circle cx="7.5" cy="20.5" r="1.8" />
            {/* right wheel */}
            <circle cx="16.5" cy="20.5" r="1.8" />
        </svg>
    );
}

export default React.memo(RadarMarker);
