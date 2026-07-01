import { AssetApi } from "../../api";
import i18n from "../../i18n";
import type { DropdownOption } from "../../components/ui/Dropdown";

const { t } = i18n;

export const threatTypeLabels: Record<AssetApi.Enums.ThreatTypes, string> = {
    [AssetApi.Enums.ThreatTypes.Unknown]: t('asset.threatTypes.unknown'),
    [AssetApi.Enums.ThreatTypes.Own]: t('asset.threatTypes.own'),
    [AssetApi.Enums.ThreatTypes.Friend]: t('asset.threatTypes.friend'),
    [AssetApi.Enums.ThreatTypes.Neutral]: t('asset.threatTypes.neutral'),
    [AssetApi.Enums.ThreatTypes.Hostile]: t('asset.threatTypes.hostile'),
};

export const threatTypeColors: Record<AssetApi.Enums.ThreatTypes, string> = {
    [AssetApi.Enums.ThreatTypes.Unknown]: '#71717a',
    [AssetApi.Enums.ThreatTypes.Own]: '#3975f8',
    [AssetApi.Enums.ThreatTypes.Friend]: '#9333ea',
    [AssetApi.Enums.ThreatTypes.Neutral]: '#16a34a',
    [AssetApi.Enums.ThreatTypes.Hostile]: '#f62c2c',
};

export const threatTypeOptions: DropdownOption[] = Object.values(AssetApi.Enums.ThreatTypes)
    .filter((v): v is AssetApi.Enums.ThreatTypes => typeof v === 'number')
    .map((type) => ({ value: type, label: threatTypeLabels[type] }));