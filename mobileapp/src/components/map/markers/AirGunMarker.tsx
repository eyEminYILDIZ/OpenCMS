import React from 'react';
import Svg, { Circle, G, Rect } from 'react-native-svg';

function AirGunMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <G transform="rotate(60, 12, 10)">
        <Rect x="9.5" y="1" width="5" height="1.5" rx="0.3" fill={color} />
        <Rect x="11" y="1" width="2" height="11" rx="0.5" fill={color} />
      </G>
      <Rect x="8" y="10" width="8" height="5" rx="1" fill={color} />
      <Rect x="5.5" y="10" width="2.5" height="4" rx="0.5" fill={color} />
      <Rect x="10.5" y="14" width="3" height="4" fill={color} />
      <Rect x="5" y="17.5" width="14" height="1.5" rx="0.5" fill={color} />
      <Circle cx="6" cy="20.5" r="2.2" fill={color} />
      <Circle cx="18" cy="20.5" r="2.2" fill={color} />
    </Svg>
  );
}

export default React.memo(AirGunMarker);
