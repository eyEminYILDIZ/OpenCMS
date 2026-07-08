import React from 'react';

function AttackOrderIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24">
      <g transform="rotate(45 12 12)">
        <line x1="12" y1="4" x2="12" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <polygon points="12,1 9,5 15,5" fill={color} />
        <line x1="9" y1="6.5" x2="15" y2="6.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <rect x="10.5" y="17" width="3" height="4" rx="1" fill={color} />
      </g>
      <g transform="rotate(-45 12 12)">
        <line x1="12" y1="4" x2="12" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <polygon points="12,1 9,5 15,5" fill={color} />
        <line x1="9" y1="6.5" x2="15" y2="6.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <rect x="10.5" y="17" width="3" height="4" rx="1" fill={color} />
      </g>
    </svg>
  );
}

export default React.memo(AttackOrderIcon);
