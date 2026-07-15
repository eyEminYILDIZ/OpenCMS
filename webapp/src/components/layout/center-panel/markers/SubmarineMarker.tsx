import * as React from 'react';

function SubmarineMarker({ size = 40, color = '#d00' }: { size?: number; color?: string }) {
    const submarineStyle = {
        cursor: 'pointer',
        fill: color,
        stroke: 'none'
    };
    return (
        <svg height={size} viewBox="0 0 24 24" style={submarineStyle}>
            {/* hull, bow forward (heading) */}
            <ellipse cx="12" cy="12" rx="4.5" ry="9" />
            {/* sail / conning tower */}
            <rect x="9.5" y="7" width="5" height="5" rx="1" />
            {/* periscope */}
            <rect x="11.5" y="4" width="1" height="3" />
            <rect x="10.5" y="4" width="3" height="1" />
            {/* propeller blades */}
            <ellipse cx="10.5" cy="20" rx="2" ry="1" />
            <ellipse cx="13.5" cy="20" rx="2" ry="1" />
            {/* rudder */}
            <path d="M11 19.5 L12 22.5 L13 19.5 Z" />
            {/* portholes */}
            <circle cx="12" cy="10.5" r="1.1" fill="white" />
            <circle cx="12" cy="14" r="1.1" fill="white" />
        </svg>
    );
}

export default React.memo(SubmarineMarker);
