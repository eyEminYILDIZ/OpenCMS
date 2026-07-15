import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

function SubmarineMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Ellipse cx="12" cy="12" rx="4.5" ry="9" fill={color} />
      <Rect x="9.5" y="7" width="5" height="5" rx="1" fill={color} />
      <Rect x="11.5" y="4" width="1" height="3" fill={color} />
      <Rect x="10.5" y="4" width="3" height="1" fill={color} />
      <Ellipse cx="10.5" cy="20" rx="2" ry="1" fill={color} />
      <Ellipse cx="13.5" cy="20" rx="2" ry="1" fill={color} />
      <Path d="M11 19.5 L12 22.5 L13 19.5 Z" fill={color} />
      <Circle cx="12" cy="10.5" r="1.1" fill="white" />
      <Circle cx="12" cy="14" r="1.1" fill="white" />
    </Svg>
  );
}

export default React.memo(SubmarineMarker);
