import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

function DroneMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Path d="M12 12 L6 6" stroke={color} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <Path d="M12 12 L18 6" stroke={color} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <Path d="M12 12 L6 18" stroke={color} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <Path d="M12 12 L18 18" stroke={color} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <Circle cx="6" cy="6" r="2.8" fill="none" stroke={color} strokeWidth={1.8} />
      <Circle cx="18" cy="6" r="2.8" fill="none" stroke={color} strokeWidth={1.8} />
      <Circle cx="6" cy="18" r="2.8" fill="none" stroke={color} strokeWidth={1.8} />
      <Circle cx="18" cy="18" r="2.8" fill="none" stroke={color} strokeWidth={1.8} />
      <Circle cx="6" cy="6" r="1" fill={color} />
      <Circle cx="18" cy="6" r="1" fill={color} />
      <Circle cx="6" cy="18" r="1" fill={color} />
      <Circle cx="18" cy="18" r="1" fill={color} />
      <Rect x="9" y="9" width="6" height="6" rx="1.6" fill={color} />
    </Svg>
  );
}

export default React.memo(DroneMarker);
