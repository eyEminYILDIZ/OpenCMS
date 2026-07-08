import React from 'react';

function TakeOrderIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24">
      <line x1="12" y1="2" x2="12" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <polyline points="7,9 12,15 17,9" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19 H20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default React.memo(TakeOrderIcon);
