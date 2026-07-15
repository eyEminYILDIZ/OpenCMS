import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

function VehicleMarker({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Path d="M12,1.5 L17.5,9 L17.5,19 Q17.5,20.5 16,20.5 L8,20.5 Q6.5,20.5 6.5,19 L6.5,9 Z" fill={color} />
      <Rect x="7.5" y="10.5" width="9" height="5" fill="white" rx="1" />
      <Circle cx="5" cy="9" r="2.1" fill={color} stroke="white" strokeWidth="1" />
      <Circle cx="19" cy="9" r="2.1" fill={color} stroke="white" strokeWidth="1" />
      <Circle cx="5" cy="18.5" r="2.1" fill={color} stroke="white" strokeWidth="1" />
      <Circle cx="19" cy="18.5" r="2.1" fill={color} stroke="white" strokeWidth="1" />
    </Svg>
  );
}

export default React.memo(VehicleMarker);
