import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

function UnknownMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill={color} />
      <Path d="M9 9 Q9 6 12 6 Q15 6 15 9 Q15 11.5 12 12.5 L12 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="17" r="1.2" fill="white" />
    </Svg>
  );
}

export default React.memo(UnknownMarker);
