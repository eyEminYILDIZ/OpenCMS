import React from 'react';
import Svg, { Line, Polygon } from 'react-native-svg';

function MoveOrderIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Line x1="3" y1="12" x2="17" y2="12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Polygon points="14,6 22,12 14,18" fill={color} />
    </Svg>
  );
}

export default React.memo(MoveOrderIcon);
