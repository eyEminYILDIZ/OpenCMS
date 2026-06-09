import { OperationApi } from "../../api";
import i18n from "../../i18n";

const { t } = i18n;

export const operationStatusLabels: Record<OperationApi.Enums.OperationStatus, string> = {
    [OperationApi.Enums.OperationStatus.NotStarted]: t('operation.operationStatuses.notStarted'),
    [OperationApi.Enums.OperationStatus.InProgress]: t('operation.operationStatuses.inProgress'),
    [OperationApi.Enums.OperationStatus.Completed]: t('operation.operationStatuses.completed'),
    [OperationApi.Enums.OperationStatus.OnHold]: t('operation.operationStatuses.onHold'),
    [OperationApi.Enums.OperationStatus.Cancelled]: t('operation.operationStatuses.cancelled'),
};

export const operationTypeLabels: Record<OperationApi.Enums.OperationType, string> = {
    [OperationApi.Enums.OperationType.Intercept]: t('operation.operationTypes.intercept'),
    [OperationApi.Enums.OperationType.Rescue]: t('operation.operationTypes.rescue'),
    [OperationApi.Enums.OperationType.Capture]: t('operation.operationTypes.capture'),
    [OperationApi.Enums.OperationType.Exterminate]: t('operation.operationTypes.exterminate'),
    [OperationApi.Enums.OperationType.Exchange]: t('operation.operationTypes.exchange'),
};
