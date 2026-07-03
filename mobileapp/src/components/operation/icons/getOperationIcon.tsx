import React from 'react';
import { OperationApi } from '../../../api';
import CaptureOperationIcon from './CaptureOperationIcon';
import ExchangeOperationIcon from './ExchangeOperationIcon';
import ExterminateOperationIcon from './ExterminateOperationIcon';
import InterceptOperationIcon from './InterceptOperationIcon';
import RescueOperationIcon from './RescueOperationIcon';

interface OperationIconOptions {
  size?: number;
  color?: string;
}

export function getOperationIcon(
  operationType: OperationApi.Enums.OperationType,
  options?: OperationIconOptions,
): React.ReactElement {
  switch (operationType) {
    case OperationApi.Enums.OperationType.Intercept: return <InterceptOperationIcon {...options} />;
    case OperationApi.Enums.OperationType.Rescue: return <RescueOperationIcon {...options} />;
    case OperationApi.Enums.OperationType.Capture: return <CaptureOperationIcon {...options} />;
    case OperationApi.Enums.OperationType.Exterminate: return <ExterminateOperationIcon {...options} />;
    case OperationApi.Enums.OperationType.Exchange: return <ExchangeOperationIcon {...options} />;
    default: return <InterceptOperationIcon {...options} />;
  }
}
