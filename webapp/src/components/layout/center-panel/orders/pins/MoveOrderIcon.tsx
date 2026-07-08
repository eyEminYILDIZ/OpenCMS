import React from 'react';

function MoveOrderIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24">
      <line x1="3" y1="12" x2="17" y2="12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="14,6 22,12 14,18" fill={color} />
    </svg>
  );
}

export default React.memo(MoveOrderIcon);
