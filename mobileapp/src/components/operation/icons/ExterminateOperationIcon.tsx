import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

function ExterminateOperationIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="12" r="5" fill="none" stroke={color} strokeWidth="2" />
      <Line x1="12" y1="1" x2="12" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="12" y1="18" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="1" y1="12" x2="6" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="18" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="12" r="1.3" fill={color} />
    </Svg>
  );
}

export default React.memo(ExterminateOperationIcon);
