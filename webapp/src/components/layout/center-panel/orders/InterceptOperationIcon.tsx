import React from 'react';

function InterceptOperationIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24">
      <g transform="rotate(45 12 12)">
        <rect x="11" y="2" width="2" height="20" rx="1" fill={color} />
        <polygon points="12,1 8,7 16,7" fill={color} />
      </g>
      <g transform="rotate(-45 12 12)">
        <rect x="11" y="2" width="2" height="20" rx="1" fill={color} />
        <polygon points="12,1 8,7 16,7" fill={color} />
      </g>
    </svg>
  );
}

export default React.memo(InterceptOperationIcon);
