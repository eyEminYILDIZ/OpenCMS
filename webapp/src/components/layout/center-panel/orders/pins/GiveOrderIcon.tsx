import React from 'react';

function GiveOrderIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24">
      <line x1="12" y1="22" x2="12" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <polyline points="7,15 12,9 17,15" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 5 H20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default React.memo(GiveOrderIcon);
