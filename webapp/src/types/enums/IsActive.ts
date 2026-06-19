import i18n from "../../i18n";
import type { DropdownOption } from "../../components/ui/Dropdown";

const { t } = i18n;

export const isActiveOptions: DropdownOption[] = [
    { value: true, label: t('common.active.yes') },
    { value: false, label: t('common.active.no') },
];
