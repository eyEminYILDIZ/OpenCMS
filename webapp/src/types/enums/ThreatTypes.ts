import { AssetApi } from "../../api";
import i18n from "../../i18n";

const { t } = i18n;

export const threatTypeLabels: Record<AssetApi.Enums.ThreatTypes, string> = {
    [AssetApi.Enums.ThreatTypes.Unknown]: t('asset.threatTypes.unknown'),
    [AssetApi.Enums.ThreatTypes.Own]: t('asset.threatTypes.own'),
    [AssetApi.Enums.ThreatTypes.Friend]: t('asset.threatTypes.friend'),
    [AssetApi.Enums.ThreatTypes.Neutral]: t('asset.threatTypes.neutral'),
    [AssetApi.Enums.ThreatTypes.Hostile]: t('asset.threatTypes.hostile'),
};