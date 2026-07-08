import React from 'react';
import Svg, { Path, Polygon } from 'react-native-svg';

function ExchangeOrderIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Path d="M4 9 Q4 4 10 4 L16 4" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Polygon points="16,1.5 21,4 16,6.5" fill={color} />
      <Path d="M20 15 Q20 20 14 20 L8 20" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Polygon points="8,17.5 3,20 8,22.5" fill={color} />
    </Svg>
  );
}

export default React.memo(ExchangeOrderIcon);
