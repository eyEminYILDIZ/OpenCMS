import { OperationApi } from "../../api";
import i18n from "../../i18n";
// import type { DropdownOption } from "../../components/ui/Dropdown";

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

export const operationTypeColors: Record<OperationApi.Enums.OperationType, string> = {
    [OperationApi.Enums.OperationType.Intercept]: '#3975f8',
    [OperationApi.Enums.OperationType.Rescue]: '#16a34a',
    [OperationApi.Enums.OperationType.Capture]: '#9333ea',
    [OperationApi.Enums.OperationType.Exterminate]: '#f62c2c',
    [OperationApi.Enums.OperationType.Exchange]: '#d97706',
};

// export const operationStatusOptions: DropdownOption[] = Object.values(OperationApi.Enums.OperationStatus)
//     .filter((v): v is OperationApi.Enums.OperationStatus => typeof v === 'number')
//     .map((status) => ({ value: status, label: operationStatusLabels[status] }));

// export const operationTypeOptions: DropdownOption[] = Object.values(OperationApi.Enums.OperationType)
//     .filter((v): v is OperationApi.Enums.OperationType => typeof v === 'number')
//     .map((type) => ({ value: type, label: operationTypeLabels[type] }));
