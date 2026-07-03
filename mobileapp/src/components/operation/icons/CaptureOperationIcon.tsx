import React from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';

function CaptureOperationIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Circle cx="7.5" cy="12" r="5.5" fill="none" stroke={color} strokeWidth="3" />
      <Circle cx="16.5" cy="12" r="5.5" fill="none" stroke={color} strokeWidth="3" />
      <Rect x="10.5" y="10.5" width="3" height="3" fill={color} />
    </Svg>
  );
}

export default React.memo(CaptureOperationIcon);
