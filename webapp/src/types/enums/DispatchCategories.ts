import { DispatchApi } from "../../api";
import i18n from "../../i18n";
import type { DropdownOption } from "../../components/ui/Dropdown";

const { t } = i18n;

export const dispatchCategoryLabels: Record<DispatchApi.Enums.DispatchCategories, string> = {
    [DispatchApi.Enums.DispatchCategories.General]: t('dispatch.dispatchCategories.general'),
    [DispatchApi.Enums.DispatchCategories.Asset]: t('dispatch.dispatchCategories.asset'),
    [DispatchApi.Enums.DispatchCategories.Agent]: t('dispatch.dispatchCategories.agent'),
    [DispatchApi.Enums.DispatchCategories.Operation]: t('dispatch.dispatchCategories.operation'),
};

export const dispatchCategoryOptions: DropdownOption[] = Object.values(DispatchApi.Enums.DispatchCategories)
    .filter((v): v is DispatchApi.Enums.DispatchCategories => typeof v === 'number')
    .map((category) => ({ value: category, label: dispatchCategoryLabels[category] }));
