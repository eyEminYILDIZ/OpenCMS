import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

function AirGunMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Rect x="10.5" y="1" width="3" height="1.4" rx="0.3" fill={color} />
      <Rect x="11" y="1" width="2" height="9" rx="0.5" fill={color} />
      <Rect x="8" y="10" width="8" height="3" rx="0.6" fill={color} />
      <Rect x="9" y="13" width="6" height="4" rx="1" fill={color} />
      <Path d="M10 17 L5.5 22 L7.3 22 L11.3 17.5 Z" fill={color} />
      <Path d="M14 17 L18.5 22 L16.7 22 L12.7 17.5 Z" fill={color} />
      <Circle cx="7" cy="17.5" r="1.9" fill={color} />
      <Circle cx="17" cy="17.5" r="1.9" fill={color} />
    </Svg>
  );
}

export default React.memo(AirGunMarker);
