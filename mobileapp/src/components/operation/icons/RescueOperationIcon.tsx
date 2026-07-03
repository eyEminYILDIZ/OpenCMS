import React from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';

function RescueOperationIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill={color} />
      <Rect x="10" y="2" width="4" height="6" fill="white" />
      <Rect x="10" y="16" width="4" height="6" fill="white" />
      <Rect x="2" y="10" width="6" height="4" fill="white" />
      <Rect x="16" y="10" width="6" height="4" fill="white" />
      <Circle cx="12" cy="12" r="4" fill="white" />
      <Circle cx="12" cy="12" r="4" fill="none" stroke={color} strokeWidth="1" />
    </Svg>
  );
}

export default React.memo(RescueOperationIcon);
