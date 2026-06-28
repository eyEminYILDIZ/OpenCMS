import { AssetApi } from "../../api";
import i18n from "../../i18n";
// import type { DropdownOption } from "../../components/ui/Dropdown";

const { t } = i18n;

export enum ConnectionStatus {
    Unknown = 0,
    Connected = 1,
    Disconnected = 2,
}

export const connectionStatusLabels: Record<ConnectionStatus, string> = {
    [ConnectionStatus.Unknown]: t('connectionStatus.unknown'),
    [ConnectionStatus.Connected]: t('connectionStatus.connected'),
    [ConnectionStatus.Disconnected]: t('connectionStatus.disconnected'),
};

// export const assetTypeOptions: DropdownOption[] = Object.values(AssetApi.Enums.AssetTypes)
//     .filter((v): v is AssetApi.Enums.AssetTypes => typeof v === 'number')
//     .map((type) => ({ value: type, label: assetTypeLabels[type] }));