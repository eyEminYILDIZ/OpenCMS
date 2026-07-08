import React from 'react';
import Svg, { G, Line, Polygon, Rect } from 'react-native-svg';

function AttackOrderIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <G rotation={45} origin="12, 12">
        <Line x1="12" y1="4" x2="12" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Polygon points="12,1 9,5 15,5" fill={color} />
        <Line x1="9" y1="6.5" x2="15" y2="6.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Rect x="10.5" y="17" width="3" height="4" rx="1" fill={color} />
      </G>
      <G rotation={-45} origin="12, 12">
        <Line x1="12" y1="4" x2="12" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Polygon points="12,1 9,5 15,5" fill={color} />
        <Line x1="9" y1="6.5" x2="15" y2="6.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Rect x="10.5" y="17" width="3" height="4" rx="1" fill={color} />
      </G>
    </Svg>
  );
}

export default React.memo(AttackOrderIcon);
