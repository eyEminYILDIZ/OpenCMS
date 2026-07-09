import React from 'react';
import Svg, { Polygon } from 'react-native-svg';

function UserHeadingMarker({ size = 28, color = '#33B5E5' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Polygon points="12,2 20,20 12,15.5 4,20" fill={color} stroke="#ffffff" strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  );
}

export default React.memo(UserHeadingMarker);
