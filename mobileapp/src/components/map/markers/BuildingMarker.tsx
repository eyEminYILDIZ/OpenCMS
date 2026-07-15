import React from 'react';
import Svg, { Rect } from 'react-native-svg';

function BuildingMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Rect x="4" y="3.5" width="16" height="2" rx="0.8" fill={color} />
      <Rect x="5" y="5.5" width="14" height="16.5" rx="1.2" fill={color} />
      <Rect x="7" y="7.5" width="2" height="2" fill="white" />
      <Rect x="11" y="7.5" width="2" height="2" fill="white" />
      <Rect x="15" y="7.5" width="2" height="2" fill="white" />
      <Rect x="7" y="11.5" width="2" height="2" fill="white" />
      <Rect x="11" y="11.5" width="2" height="2" fill="white" />
      <Rect x="15" y="11.5" width="2" height="2" fill="white" />
      <Rect x="10" y="18" width="4" height="4" fill="white" rx="0.4" />
    </Svg>
  );
}

export default React.memo(BuildingMarker);
