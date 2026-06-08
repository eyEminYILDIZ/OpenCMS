import * as React from 'react';

const airGunStyle = {
    cursor: 'pointer',
    fill: '#d00',
    stroke: 'none'
};

function AirGunMarker({ size = 40 }) {
    return (
        <svg height={size} viewBox="0 0 24 24" style={airGunStyle}>
            {/* barrel */}
            <rect x="2" y="9" width="14" height="3" rx="1" />
            {/* muzzle tip */}
            <rect x="16" y="10" width="4" height="1" />
            {/* body / grip block */}
            <rect x="5" y="12" width="7" height="5" rx="1" />
            {/* trigger guard */}
            <path d="M7 17 Q8 21 10 17" fill="#d00" />
            {/* trigger */}
            <rect x="8.5" y="14" width="1" height="3" fill="white" />
            {/* stock */}
            <rect x="2" y="12" width="4" height="7" rx="1" />
        </svg>
    );
}

export default React.memo(AirGunMarker);