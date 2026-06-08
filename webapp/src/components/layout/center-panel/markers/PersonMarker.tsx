import * as React from 'react';

const personStyle = {
    cursor: 'pointer',
    fill: '#d00',
    stroke: 'none'
};

function PersonMarker({ size = 40 }) {
    return (
        <svg height={size} viewBox="0 0 24 24" style={personStyle}>
            {/* head */}
            <circle cx="12" cy="5" r="3" />
            {/* body */}
            <path d="M8 9 Q8 7 12 7 Q16 7 16 9 L17 17 L13 17 L13 22 L11 22 L11 17 L7 17 Z" />
            {/* arms */}
            <path d="M8 10 L5 15 L7 15.5 L9 11.5 Z" />
            <path d="M16 10 L19 15 L17 15.5 L15 11.5 Z" />
        </svg>
    );
}

export default React.memo(PersonMarker);