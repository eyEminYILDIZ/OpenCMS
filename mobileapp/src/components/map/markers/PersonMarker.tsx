import React from 'react';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';

function PersonMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Polygon points="12,1.8 10.9,3.3 13.1,3.3" fill={color} />
      <Circle cx="12" cy="5" r="2.6" fill={color} />
      <Path d="M8.2,9.2 C8.2,7.7 9.9,7 12,7 C14.1,7 15.8,7.7 15.8,9.2 L16.4,15.2 L7.6,15.2 Z" fill={color} />
      <Rect x="6.2" y="9.3" width="1.7" height="6.3" rx="0.85" fill={color} />
      <Rect x="16.1" y="9.3" width="1.7" height="6.3" rx="0.85" fill={color} />
      <Rect x="9.3" y="15.2" width="2.1" height="6.8" rx="1" fill={color} />
      <Rect x="12.6" y="15.2" width="2.1" height="6.8" rx="1" fill={color} />
    </Svg>
  );
}

export default React.memo(PersonMarker);
