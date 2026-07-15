import React from 'react';
import {
  AttackOrderIcon,
  DefendOrderIcon,
  ExchangeOrderIcon,
  GatherIntelligenceOrderIcon,
  GiveOrderIcon,
  MoveOrderIcon,
  ObserveOrderIcon,
  TakeOrderIcon,
} from './pins';
import { OperationApi } from '../../../../api';
import { orderTypeColors } from '../../../../types';

interface OperationIconOptions {
  size?: number;
  color?: string;
}
export function getOrderPin(
  orderType: OperationApi.Enums.OrderTypes,
  options?: OperationIconOptions,
): React.ReactElement {
  switch (orderType) {
    case OperationApi.Enums.OrderTypes.Move: return <MoveOrderIcon {...options} />;
    case OperationApi.Enums.OrderTypes.Attack: return <AttackOrderIcon {...options} />;
    case OperationApi.Enums.OrderTypes.Defend: return <DefendOrderIcon {...options} />;
    case OperationApi.Enums.OrderTypes.GatherIntelligence: return <GatherIntelligenceOrderIcon {...options} />;
    case OperationApi.Enums.OrderTypes.Exchange: return <ExchangeOrderIcon {...options} />;
    case OperationApi.Enums.OrderTypes.Take: return <TakeOrderIcon {...options} />;
    case OperationApi.Enums.OrderTypes.Give: return <GiveOrderIcon {...options} />;
    case OperationApi.Enums.OrderTypes.Observe: return <ObserveOrderIcon {...options} />;
    default: return <MoveOrderIcon {...options} />;
  }
}

interface OrderCodeMarkerProps {
  /** 3 characters to display inside the circle, e.g. 1 letter + 2 digits ("A12"). */
  code: string;
  orderType: OperationApi.Enums.OrderTypes;
  size?: number;
  /** Color of the main circle (border). The badge icon color is derived from the order type automatically. */
  color?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function OrderCodeMarker({
  code,
  orderType,
  size = 40,
  color = '#d00',
  backgroundColor = '#fff',
  textColor = '#111',
}: OrderCodeMarkerProps): React.ReactElement {
  const badgeSize = Math.round(size * 0.55);
  const badgeColor = orderTypeColors[orderType];

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor,
          border: `2px solid ${color}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: size * 0.32,
            fontWeight: 700,
            color: textColor,
            fontFamily: 'sans-serif',
            lineHeight: 1,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {code?.slice(0, 3).toUpperCase()}
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          top: -badgeSize * 0.3,
          right: -badgeSize * 0.3,
          width: badgeSize,
          height: badgeSize,
          borderRadius: '50%',
          backgroundColor,
          border: `1px solid ${badgeColor}`,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {getOrderPin(orderType, { size: Math.round(badgeSize * 0.7), color: badgeColor })}
      </div>
    </div>
  );
}
