import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

function RadarMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Path d="M4,9 Q12,16 20,9" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4,9 Q12,12.5 20,9" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="4" y1="9" x2="12" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="20" y1="9" x2="12" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="12" y1="9" x2="12" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="12" cy="5" r="1.2" fill={color} />
      <Rect x="8" y="17.5" width="8" height="1.6" rx="0.6" fill={color} />
    </Svg>
  );
}

export default React.memo(RadarMarker);
