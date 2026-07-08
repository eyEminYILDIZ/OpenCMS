import React from 'react';

function CaptureOperationIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24">
      <circle cx="7.5" cy="12" r="5.5" fill="none" stroke={color} strokeWidth="3" />
      <circle cx="16.5" cy="12" r="5.5" fill="none" stroke={color} strokeWidth="3" />
      <rect x="10.5" y="10.5" width="3" height="3" fill={color} />
    </svg>
  );
}

export default React.memo(CaptureOperationIcon);
