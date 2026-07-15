import { OperationApi } from "../../api";
import i18n from "../../i18n";
import type { DropdownOption } from "../../components/ui/Dropdown";

const { t } = i18n;

export const orderStatusLabels: Record<OperationApi.Enums.OrderStatus, string> = {
    [OperationApi.Enums.OrderStatus.NotStarted]: t('operation.orderStatuses.notStarted'),
    [OperationApi.Enums.OrderStatus.Started]: t('operation.orderStatuses.started'),
    [OperationApi.Enums.OrderStatus.Completed]: t('operation.orderStatuses.completed'),
    [OperationApi.Enums.OrderStatus.Cancelled]: t('operation.orderStatuses.cancelled'),
    [OperationApi.Enums.OrderStatus.Failed]: t('operation.orderStatuses.failed'),
    [OperationApi.Enums.OrderStatus.Unknown]: t('operation.orderStatuses.unknown'),
};

export const orderTypeLabels: Record<OperationApi.Enums.OrderTypes, string> = {
    [OperationApi.Enums.OrderTypes.Move]: t('operation.orderTypes.move'),
    [OperationApi.Enums.OrderTypes.Attack]: t('operation.orderTypes.attack'),
    [OperationApi.Enums.OrderTypes.Defend]: t('operation.orderTypes.defend'),
    [OperationApi.Enums.OrderTypes.GatherIntelligence]: t('operation.orderTypes.gatherIntelligence'),
    [OperationApi.Enums.OrderTypes.Exchange]: t('operation.orderTypes.exchange'),
    [OperationApi.Enums.OrderTypes.Take]: t('operation.orderTypes.take'),
    [OperationApi.Enums.OrderTypes.Give]: t('operation.orderTypes.give'),
    [OperationApi.Enums.OrderTypes.Observe]: t('operation.orderTypes.observe'),
};

export const orderTypeColors: Record<OperationApi.Enums.OrderTypes, string> = {
    [OperationApi.Enums.OrderTypes.Move]: '#3975f8',
    [OperationApi.Enums.OrderTypes.Attack]: '#f62c2c',
    [OperationApi.Enums.OrderTypes.Defend]: '#16a34a',
    [OperationApi.Enums.OrderTypes.GatherIntelligence]: '#9333ea',
    [OperationApi.Enums.OrderTypes.Exchange]: '#eab308',
    [OperationApi.Enums.OrderTypes.Take]: '#ea580c',
    [OperationApi.Enums.OrderTypes.Give]: '#0891b2',
    [OperationApi.Enums.OrderTypes.Observe]: '#64748b',
};

// Single letter used as the first character of an order's 3-character map code (e.g. "M01").
export const orderTypeCodeLetters: Record<OperationApi.Enums.OrderTypes, string> = {
    [OperationApi.Enums.OrderTypes.Move]: 'M',
    [OperationApi.Enums.OrderTypes.Attack]: 'A',
    [OperationApi.Enums.OrderTypes.Defend]: 'D',
    [OperationApi.Enums.OrderTypes.GatherIntelligence]: 'G',
    [OperationApi.Enums.OrderTypes.Exchange]: 'E',
    [OperationApi.Enums.OrderTypes.Take]: 'T',
    [OperationApi.Enums.OrderTypes.Give]: 'V',
    [OperationApi.Enums.OrderTypes.Observe]: 'O',
};


export const orderStatusOptions: DropdownOption[] = Object.values(OperationApi.Enums.OrderStatus)
    .filter((v): v is OperationApi.Enums.OrderStatus => typeof v === 'number')
    .map((status) => ({ value: status, label: orderStatusLabels[status] }));

export const orderTypeOptions: DropdownOption[] = Object.values(OperationApi.Enums.OrderTypes)
    .filter((v): v is OperationApi.Enums.OrderTypes => typeof v === 'number')
    .map((type) => ({ value: type, label: orderTypeLabels[type] }));
