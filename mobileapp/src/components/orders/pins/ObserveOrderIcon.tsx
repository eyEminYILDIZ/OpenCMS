import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

function ObserveOrderIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Path d="M2 12 C5 6 9 4 12 4 C15 4 19 6 22 12 C19 18 15 20 12 20 C9 20 5 18 2 12 Z" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="12" r="3" fill={color} />
    </Svg>
  );
}

export default React.memo(ObserveOrderIcon);
