import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

function ShipMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Path d="M4 14 L12 22 L20 14 L20 10 L4 10 Z" fill={color} />
      <Rect x="8" y="6" width="8" height="4" rx="1" fill={color} />
      <Rect x="10" y="3" width="4" height="3" rx="1" fill={color} />
      <Rect x="11.5" y="1" width="1" height="2" fill={color} />
      <Rect x="6" y="11" width="2" height="2" fill="white" rx="1" />
      <Rect x="11" y="11" width="2" height="2" fill="white" rx="1" />
      <Rect x="16" y="11" width="2" height="2" fill="white" rx="1" />
    </Svg>
  );
}

export default React.memo(ShipMarker);
