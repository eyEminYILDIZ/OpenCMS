import React from 'react';

function ObserveOrderIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24">
      <path d="M2 12 C5 6 9 4 12 4 C15 4 19 6 22 12 C19 18 15 20 12 20 C9 20 5 18 2 12 Z" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" fill={color} />
    </svg>
  );
}

export default React.memo(ObserveOrderIcon);
