import React from 'react';
import Svg, { Rect } from 'react-native-svg';

function BuildingMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Rect x="3" y="7" width="13" height="14" fill={color} />
      <Rect x="13" y="11" width="8" height="10" fill={color} />
      <Rect x="5" y="9" width="2" height="2" fill="white" />
      <Rect x="9" y="9" width="2" height="2" fill="white" />
      <Rect x="5" y="13" width="2" height="2" fill="white" />
      <Rect x="9" y="13" width="2" height="2" fill="white" />
      <Rect x="15" y="13" width="2" height="2" fill="white" />
      <Rect x="19" y="13" width="1" height="2" fill="white" />
      <Rect x="7" y="17" width="3" height="4" fill="white" />
    </Svg>
  );
}

export default React.memo(BuildingMarker);
