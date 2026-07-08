import React from 'react';

function GatherIntelligenceOrderIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24">
      <path d="M9 11 V6.5 Q9 4 11.2 4 L12.8 4 Q15 4 15 6.5 V11" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="10" y1="7.5" x2="14" y2="7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6.5" cy="15.5" r="4.5" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="17.5" cy="15.5" r="4.5" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export default React.memo(GatherIntelligenceOrderIcon);
