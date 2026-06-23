import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { stores } from "../../../../stores";

export const OperationAssetDetail: React.FC = observer(() => {
    const { operationStore } = stores;
    const { t } = useTranslation();
    const item = operationStore.selectedAsset;

    if (item == undefined)
        return (<p className="right-panel-empty">{t('operation.errors.noItemSelected')}</p>);

    const rows: { label: string; value: string }[] = [
        { label: t('operation.assetFields.id'), value: item.id },
        { label: t('operation.assetFields.assetId'), value: item.assetId },
        { label: t('operation.assetFields.name'), value: item.asset.name },
    ];

    return (
        <>
            <h4>{t('operation.assetFields.asset')}</h4>
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
});
