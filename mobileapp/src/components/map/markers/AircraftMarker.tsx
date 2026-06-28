import React from 'react';
import Svg, { Ellipse, Polygon } from 'react-native-svg';

function AircraftMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Ellipse cx="12" cy="12" rx="2" ry="9" fill={color} />
      <Polygon points="12,10 2,16 22,16" fill={color} />
      <Polygon points="12,19 7,22 17,22" fill={color} />
      <Polygon points="12,3 10.5,6 13.5,6" fill={color} />
    </Svg>
  );
}

export default React.memo(AircraftMarker);
