import React from 'react';
import { OperationApi } from '../../../api';
import AttackOrderIcon from './AttackOrderIcon';
import DefendOrderIcon from './DefendOrderIcon';
import ExchangeOrderIcon from './ExchangeOrderIcon';
import GatherIntelligenceOrderIcon from './GatherIntelligenceOrderIcon';
import GiveOrderIcon from './GiveOrderIcon';
import MoveOrderIcon from './MoveOrderIcon';
import ObserveOrderIcon from './ObserveOrderIcon';
import TakeOrderIcon from './TakeOrderIcon';

interface OrderPinOptions {
  size?: number;
  color?: string;
}

export function getOrderPin(
  orderType: OperationApi.Enums.OrderTypes,
  options?: OrderPinOptions,
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
