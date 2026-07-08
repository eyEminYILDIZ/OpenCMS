import React from 'react';
import Svg, { Path } from 'react-native-svg';

function DefendOrderIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <Path
        d="M12 2 L20 5.5 V11 C20 16.2 16.6 20.2 12 22 C7.4 20.2 4 16.2 4 11 V5.5 Z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <Path d="M12 6 V18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export default React.memo(DefendOrderIcon);
