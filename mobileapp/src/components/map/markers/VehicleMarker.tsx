import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

function VehicleMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Rect x="2" y="13" width="20" height="6" rx="1" fill={color} />
      <Path d="M6 13 L8 8 L16 8 L18 13 Z" fill={color} />
      <Path d="M9 8.5 L7.5 12.5 L16.5 12.5 L15 8.5 Z" fill="white" />
      <Circle cx="6" cy="19" r="2.5" fill={color} stroke="white" strokeWidth="1" />
      <Circle cx="6" cy="19" r="1" fill="white" />
      <Circle cx="18" cy="19" r="2.5" fill={color} stroke="white" strokeWidth="1" />
      <Circle cx="18" cy="19" r="1" fill="white" />
    </Svg>
  );
}

export default React.memo(VehicleMarker);
