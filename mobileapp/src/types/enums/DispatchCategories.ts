import { DispatchApi } from "../../api";
import i18n from "../../i18n";
// import type { DropdownOption } from "../../components/ui/Dropdown";

const { t } = i18n;

export const dispatchCategoryLabels: Record<DispatchApi.Enums.DispatchCategories, string> = {
    [DispatchApi.Enums.DispatchCategories.General]: t('dispatch.dispatchCategories.general'),
    [DispatchApi.Enums.DispatchCategories.Asset]: t('dispatch.dispatchCategories.asset'),
    [DispatchApi.Enums.DispatchCategories.Agent]: t('dispatch.dispatchCategories.agent'),
    [DispatchApi.Enums.DispatchCategories.Operation]: t('dispatch.dispatchCategories.operation'),
};

export const dispatchCategoryColors: Record<DispatchApi.Enums.DispatchCategories, string> = {
    [DispatchApi.Enums.DispatchCategories.General]: '#0ea5e9',
    [DispatchApi.Enums.DispatchCategories.Asset]: '#16a34a',
    [DispatchApi.Enums.DispatchCategories.Agent]: '#7c3aed',
    [DispatchApi.Enums.DispatchCategories.Operation]: '#ea580c',
};

export const dispatchCategoryIcons: Record<DispatchApi.Enums.DispatchCategories, string> = {
    [DispatchApi.Enums.DispatchCategories.General]: 'information-outline',
    [DispatchApi.Enums.DispatchCategories.Asset]: 'layers-outline',
    [DispatchApi.Enums.DispatchCategories.Agent]: 'account-outline',
    [DispatchApi.Enums.DispatchCategories.Operation]: 'clipboard-list-outline',
};

// export const dispatchCategoryOptions: DropdownOption[] = Object.values(DispatchApi.Enums.DispatchCategories)
//     .filter((v): v is DispatchApi.Enums.DispatchCategories => typeof v === 'number')
//     .map((category) => ({ value: category, label: dispatchCategoryLabels[category] }));
