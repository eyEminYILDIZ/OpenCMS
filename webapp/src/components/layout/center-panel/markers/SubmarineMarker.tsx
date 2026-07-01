import * as React from 'react';

function SubmarineMarker({ size = 40, color = '#d00' }: { size?: number; color?: string }) {
    const submarineStyle = {
        cursor: 'pointer',
        fill: color,
        stroke: 'none'
    };
    return (
        <svg height={size} viewBox="0 0 24 24" style={submarineStyle}>
            {/* main hull */}
            <ellipse cx="11" cy="13" rx="9" ry="4.5" />
            {/* conning tower */}
            <rect x="9" y="7" width="5" height="4" rx="1" />
            {/* periscope */}
            <rect x="13" y="4" width="1" height="3" />
            <rect x="13" y="4" width="3" height="1" />
            {/* propeller blades */}
            <ellipse cx="20.5" cy="11.5" rx="1" ry="2" />
            <ellipse cx="20.5" cy="14.5" rx="1" ry="2" />
            {/* rudder */}
            <path d="M20 13 L22 11 L22 15 Z" />
            {/* portholes */}
            <circle cx="8" cy="13" r="1.2" fill="white" />
            <circle cx="13" cy="13" r="1.2" fill="white" />
        </svg>
    );
}

export default React.memo(SubmarineMarker);