import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { stores } from "../../../stores";
import { assetTypeLabels, threatTypeLabels } from "../../../types";

export const AssetUpdate: React.FC = observer(() => {
    const { assetStore } = stores;
    const { t } = useTranslation();
    const item = assetStore.selectedItem;

    if (item == undefined)
        return (<p className="right-panel-empty">{t('asset.noItemSelected')}</p>);

    const rows: { label: string; value: string }[] = [
        { label: t('asset.fields.id'), value: item.id },
        { label: t('asset.fields.name'), value: item.name },
        { label: t('asset.fields.latitude'), value: item.latitude.toString() },
        { label: t('asset.fields.longitude'), value: item.longitude.toString() },
        { label: t('asset.fields.altitude'), value: item.altitude.toString() },
        { label: t('asset.fields.heading'), value: item.heading.toString() },
        { label: t('asset.fields.speed'), value: item.speed.toString() },
        { label: t('asset.fields.assetType'), value: assetTypeLabels[item.assetType] },
        { label: t('asset.fields.threatType'), value: threatTypeLabels[item.threatType] },
        { label: t('asset.fields.isActive'), value: item.isActive ? t('common.active.yes') : t('common.active.no') },
        { label: t('asset.fields.firstUpdated'), value: item.firstUpdated },
        { label: t('asset.fields.lastUpdated'), value: item.lastUpdated },
        { label: t('asset.fields.relatedAgentId'), value: item.relatedAgentId ?? "—" },
        { label: t('asset.fields.createdAt'), value: item.createdAt },
        { label: t('asset.fields.updatedAt'), value: item.updatedAt ?? "—" },
    ];

    return (
        <>
            <h4>Asset Update</h4>
            <table style={{ fontSize: '0.8rem', borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                    {rows.map(({ label, value }) => (
                        <tr key={label}>
                            <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}><strong>{label}</strong></td>
                            <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
})