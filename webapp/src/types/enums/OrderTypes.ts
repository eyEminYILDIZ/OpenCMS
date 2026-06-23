import { OperationApi } from "../../api";
import i18n from "../../i18n";
import type { DropdownOption } from "../../components/ui/Dropdown";

const { t } = i18n;

export const orderStatusLabels: Record<OperationApi.Enums.OrderStatus, string> = {
    [OperationApi.Enums.OrderStatus.Passive]: t('operation.orderStatuses.passive'),
    [OperationApi.Enums.OrderStatus.Active]: t('operation.orderStatuses.active'),
};

export const orderTypeLabels: Record<OperationApi.Enums.OrderTypes, string> = {
    [OperationApi.Enums.OrderTypes.Move]: t('operation.orderTypes.move'),
    [OperationApi.Enums.OrderTypes.Attack]: t('operation.orderTypes.attack'),
    [OperationApi.Enums.OrderTypes.Defend]: t('operation.orderTypes.defend'),
    [OperationApi.Enums.OrderTypes.GatherIntelligence]: t('operation.orderTypes.gatherIntelligence'),
    [OperationApi.Enums.OrderTypes.Exchange]: t('operation.orderTypes.exchange'),
    [OperationApi.Enums.OrderTypes.Take]: t('operation.orderTypes.take'),
    [OperationApi.Enums.OrderTypes.Give]: t('operation.orderTypes.give'),
};

export const orderStatusOptions: DropdownOption[] = Object.values(OperationApi.Enums.OrderStatus)
    .filter((v): v is OperationApi.Enums.OrderStatus => typeof v === 'number')
    .map((status) => ({ value: status, label: orderStatusLabels[status] }));

export const orderTypeOptions: DropdownOption[] = Object.values(OperationApi.Enums.OrderTypes)
    .filter((v): v is OperationApi.Enums.OrderTypes => typeof v === 'number')
    .map((type) => ({ value: type, label: orderTypeLabels[type] }));
