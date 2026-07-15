import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

function ShipMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Path d="M12,2 L19,13 L19,18 L5,18 L5,13 Z" fill={color} />
      <Rect x="8" y="13.5" width="8" height="4" rx="1" fill={color} />
      <Rect x="10" y="10.5" width="4" height="3" rx="1" fill={color} />
      <Rect x="11.5" y="8.5" width="1" height="2" fill={color} />
      <Rect x="7" y="15" width="1.6" height="1.6" fill="white" rx="0.4" />
      <Rect x="15.4" y="15" width="1.6" height="1.6" fill="white" rx="0.4" />
    </Svg>
  );
}

export default React.memo(ShipMarker);
