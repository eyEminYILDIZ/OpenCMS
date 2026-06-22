import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { stores } from "../../../../stores";
import { operationStatusLabels, operationTypeLabels } from "../../../../types";

export const OperationDetailTab: React.FC = observer(() => {
    const { operationStore } = stores;
    const { t } = useTranslation();
    const item = operationStore.selectedItem;

    if (item == undefined)
        return (<p className="right-panel-empty">{t('operation.noItemSelected')}</p>);

    const rows: { label: string; value: string }[] = [
        { label: t('operation.fields.id'), value: item.id },
        { label: t('operation.fields.name'), value: item.name },
        { label: t('operation.fields.description'), value: item.description },
        { label: t('operation.fields.startDate'), value: item.startDate },
        { label: t('operation.fields.estimatedEndDate'), value: item.estimatedEndDate },
        { label: t('operation.fields.endDate'), value: item.endDate ?? "—" },
        { label: t('operation.fields.operationStatus'), value: operationStatusLabels[item.operationStatus] },
        { label: t('operation.fields.operationType'), value: operationTypeLabels[item.operationType] },
    ];

    return (
        <>
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
