import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

function PersonMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="5" r="3" fill={color} />
      <Path d="M8 9 Q8 7 12 7 Q16 7 16 9 L17 17 L13 17 L13 22 L11 22 L11 17 L7 17 Z" fill={color} />
      <Path d="M8 10 L5 15 L7 15.5 L9 11.5 Z" fill={color} />
      <Path d="M16 10 L19 15 L17 15.5 L15 11.5 Z" fill={color} />
    </Svg>
  );
}

export default React.memo(PersonMarker);
