import * as React from 'react';

const buildingStyle = {
    cursor: 'pointer',
    fill: '#d00',
    stroke: 'none'
};

function BuildingMarker({ size = 40 }) {
    return (
        <svg height={size} viewBox="0 0 24 24" style={buildingStyle}>
            {/* building outline */}
            <rect x="3" y="7" width="13" height="14" />
            {/* rooftop extension */}
            <rect x="13" y="11" width="8" height="10" />
            {/* windows / door cutouts rendered as a separate layer in white */}
            <rect x="5" y="9" width="2" height="2" fill="white" />
            <rect x="9" y="9" width="2" height="2" fill="white" />
            <rect x="5" y="13" width="2" height="2" fill="white" />
            <rect x="9" y="13" width="2" height="2" fill="white" />
            <rect x="15" y="13" width="2" height="2" fill="white" />
            <rect x="19" y="13" width="1" height="2" fill="white" />
            {/* door */}
            <rect x="7" y="17" width="3" height="4" fill="white" />
        </svg>
    );
}

export default React.memo(BuildingMarker);