import React from 'react';
import Svg, { Circle, G, Line, Path } from 'react-native-svg';

function RadarMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <G transform="rotate(30, 12, 8)">
        <Path d="M 2,8 Q 12,16 22,8" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M 2,8 Q 12,11 22,8" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Line x1="2" y1="8" x2="12" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <Line x1="22" y1="8" x2="12" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <Circle cx="12" cy="4" r="1.3" fill={color} />
      </G>
      <Line x1="12" y1="8" x2="12" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="6" y1="18" x2="18" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="7.5" cy="20.5" r="1.8" fill="none" stroke={color} strokeWidth="1.5" />
      <Circle cx="16.5" cy="20.5" r="1.8" fill="none" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

export default React.memo(RadarMarker);
