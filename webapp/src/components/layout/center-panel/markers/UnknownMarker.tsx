import * as React from 'react';

function UnknownMarker({ size = 40, color = '#d00' }: { size?: number; color?: string }) {
    const unknownStyle = {
        cursor: 'pointer',
        fill: color,
        stroke: 'none'
    };
    return (
        <svg height={size} viewBox="0 0 24 24" style={unknownStyle}>
            {/* circle background */}
            <circle cx="12" cy="12" r="10" />
            {/* question mark — top arc */}
            <path d="M9 9 Q9 6 12 6 Q15 6 15 9 Q15 11.5 12 12.5 L12 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
            {/* question mark — dot */}
            <circle cx="12" cy="17" r="1.2" fill="white" />
        </svg>
    );
}

export default React.memo(UnknownMarker);