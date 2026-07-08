import React from 'react';

function RescueOperationIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={color} />
      <rect x="10" y="2" width="4" height="6" fill="white" />
      <rect x="10" y="16" width="4" height="6" fill="white" />
      <rect x="2" y="10" width="6" height="4" fill="white" />
      <rect x="16" y="10" width="6" height="4" fill="white" />
      <circle cx="12" cy="12" r="4" fill="white" />
      <circle cx="12" cy="12" r="4" fill="none" stroke={color} strokeWidth="1" />
    </svg>
  );
}

export default React.memo(RescueOperationIcon);
