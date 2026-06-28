import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

function PersonGroupMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Circle cx="7" cy="6" r="2.5" fill={color} />
      <Path d="M4 10 Q4 8.5 7 8.5 Q10 8.5 10 10 L10.5 16 L8.5 16 L8.5 20 L5.5 20 L5.5 16 L3.5 16 Z" fill={color} />
      <Circle cx="17" cy="6" r="2.5" fill={color} />
      <Path d="M14 10 Q14 8.5 17 8.5 Q20 8.5 20 10 L20.5 16 L18.5 16 L18.5 20 L15.5 20 L15.5 16 L13.5 16 Z" fill={color} />
      <Circle cx="12" cy="4" r="2.5" fill={color} />
      <Path d="M9 8 Q9 6.5 12 6.5 Q15 6.5 15 8 L15.5 14 L13.5 14 L13.5 18 L10.5 18 L10.5 14 L8.5 14 Z" fill={color} />
    </Svg>
  );
}

export default React.memo(PersonGroupMarker);
