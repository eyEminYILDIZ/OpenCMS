import { AssetApi } from "../../api";
import i18n from "../../i18n";

const { t } = i18n;

export const assetTypeLabels: Record<AssetApi.Enums.AssetTypes, string> = {
    [AssetApi.Enums.AssetTypes.Unknown]: t('asset.assetTypes.unknown'),
    [AssetApi.Enums.AssetTypes.Person]: t('asset.assetTypes.person'),
    [AssetApi.Enums.AssetTypes.GroupOfPeople]: t('asset.assetTypes.groupOfPeople'),
    [AssetApi.Enums.AssetTypes.Aircraft]: t('asset.assetTypes.aircraft'),
    [AssetApi.Enums.AssetTypes.Ship]: t('asset.assetTypes.ship'),
    [AssetApi.Enums.AssetTypes.Submarine]: t('asset.assetTypes.submarine'),
    [AssetApi.Enums.AssetTypes.Vehicle]: t('asset.assetTypes.vehicle'),
    [AssetApi.Enums.AssetTypes.Building]: t('asset.assetTypes.building'),
    [AssetApi.Enums.AssetTypes.Radar]: t('asset.assetTypes.radar'),
    [AssetApi.Enums.AssetTypes.AirGun]: t('asset.assetTypes.airGun'),
    [AssetApi.Enums.AssetTypes.Other]: t('asset.assetTypes.other'),
};