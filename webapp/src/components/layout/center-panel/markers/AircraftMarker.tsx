import * as React from 'react';

const aircraftStyle = {
    cursor: 'pointer',
    fill: '#d00',
    stroke: 'none'
};

function AircraftMarker({ size = 40 }) {
    return (
        <svg height={size} viewBox="0 0 24 24" style={aircraftStyle}>
            {/* fuselage */}
            <ellipse cx="12" cy="12" rx="2" ry="9" />
            {/* main wings */}
            <polygon points="12,10 2,16 22,16" />
            {/* tail wings */}
            <polygon points="12,19 7,22 17,22" />
            {/* nose tip */}
            <polygon points="12,3 10.5,6 13.5,6" />
        </svg>
    );
}

export default React.memo(AircraftMarker);