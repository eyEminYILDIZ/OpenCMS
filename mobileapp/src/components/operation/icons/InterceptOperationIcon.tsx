import React from 'react';
import Svg, { G, Polygon, Rect } from 'react-native-svg';

function InterceptOperationIcon({ size = 32, color = '#d00' }: { size?: number; color?: string }) {
  return (
    <Svg height={size} width={size} viewBox="0 0 24 24">
      <G transform="rotate(45 12 12)">
        <Rect x="11" y="2" width="2" height="20" rx="1" fill={color} />
        <Polygon points="12,1 8,7 16,7" fill={color} />
      </G>
      <G transform="rotate(-45 12 12)">
        <Rect x="11" y="2" width="2" height="20" rx="1" fill={color} />
        <Polygon points="12,1 8,7 16,7" fill={color} />
      </G>
    </Svg>
  );
}

export default React.memo(InterceptOperationIcon);
