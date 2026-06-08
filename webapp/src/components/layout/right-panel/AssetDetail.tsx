import { observer } from "mobx-react-lite";
import { AssetApi } from "../../../api";
import { stores } from "../../../stores"

const ASSET_TYPE_LABELS: Record<AssetApi.Enums.AssetTypes, string> = {
    [AssetApi.Enums.AssetTypes.Unknown]: "Unknown",
    [AssetApi.Enums.AssetTypes.Person]: "Person",
    [AssetApi.Enums.AssetTypes.GroupOfPeople]: "Group of People",
    [AssetApi.Enums.AssetTypes.Aircraft]: "Aircraft",
    [AssetApi.Enums.AssetTypes.Ship]: "Ship",
    [AssetApi.Enums.AssetTypes.Submarine]: "Submarine",
    [AssetApi.Enums.AssetTypes.Vehicle]: "Vehicle",
    [AssetApi.Enums.AssetTypes.Building]: "Building",
    [AssetApi.Enums.AssetTypes.Other]: "Other",
};

const THREAT_TYPE_LABELS: Record<AssetApi.Enums.ThreatTypes, string> = {
    [AssetApi.Enums.ThreatTypes.Unknown]: "Unknown",
    [AssetApi.Enums.ThreatTypes.Own]: "Own",
    [AssetApi.Enums.ThreatTypes.Friend]: "Friend",
    [AssetApi.Enums.ThreatTypes.Neutral]: "Neutral",
    [AssetApi.Enums.ThreatTypes.Hostile]: "Hostile",
};

export const AssetDetail: React.FC = observer(() => {
    const { assetStore } = stores;
    const item = assetStore.selectedItem;

    if (item == undefined)
        return (<p>No item selected</p>);

    const rows: { label: string; value: string }[] = [
        { label: "ID", value: item.id },
        { label: "Name", value: item.name },
        { label: "Latitude", value: item.latitude.toString() },
        { label: "Longitude", value: item.longitude.toString() },
        { label: "Altitude", value: item.altitude.toString() },
        { label: "Heading", value: item.heading.toString() },
        { label: "Speed", value: item.speed.toString() },
        { label: "Asset Type", value: ASSET_TYPE_LABELS[item.assetType] },
        { label: "Threat Type", value: THREAT_TYPE_LABELS[item.threatType] },
        { label: "Active", value: item.isActive ? "Yes" : "No" },
        { label: "First Updated", value: item.firstUpdated },
        { label: "Last Updated", value: item.lastUpdated },
        { label: "Related Agent ID", value: item.relatedAgentId ?? "—" },
        { label: "Created At", value: item.createdAt },
        { label: "Updated At", value: item.updatedAt ?? "—" },
    ];

    return (
        <table>
            <tbody>
                {rows.map(({ label, value }) => (
                    <tr key={label}>
                        <td><strong>{label}</strong></td>
                        <td>{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
})