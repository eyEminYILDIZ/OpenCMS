import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

function SubmarineMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Ellipse cx="11" cy="13" rx="9" ry="4.5" fill={color} />
      <Rect x="9" y="7" width="5" height="4" rx="1" fill={color} />
      <Rect x="13" y="4" width="1" height="3" fill={color} />
      <Rect x="13" y="4" width="3" height="1" fill={color} />
      <Ellipse cx="20.5" cy="11.5" rx="1" ry="2" fill={color} />
      <Ellipse cx="20.5" cy="14.5" rx="1" ry="2" fill={color} />
      <Path d="M20 13 L22 11 L22 15 Z" fill={color} />
      <Circle cx="8" cy="13" r="1.2" fill="white" />
      <Circle cx="13" cy="13" r="1.2" fill="white" />
    </Svg>
  );
}

export default React.memo(SubmarineMarker);
