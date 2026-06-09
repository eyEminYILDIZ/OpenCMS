import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { stores } from "../../../stores";
import { operationStatusLabels, operationTypeLabels } from "../../../types";

export const OperationDetail: React.FC = observer(() => {
    const { operationStore } = stores;
    const { t } = useTranslation();
    const item = operationStore.selectedItem;

    if (item == undefined)
        return (<p>{t('operation.noItemSelected')}</p>);

    const rows: { label: string; value: string }[] = [
        { label: t('operation.fields.id'), value: item.id },
        { label: t('operation.fields.name'), value: item.name },
        { label: t('operation.fields.description'), value: item.description },
        { label: t('operation.fields.startDate'), value: item.startDate },
        { label: t('operation.fields.estimatedEndDate'), value: item.estimatedEndDate },
        { label: t('operation.fields.endDate'), value: item.endDate ?? "—" },
        { label: t('operation.fields.operationStatus'), value: operationStatusLabels[item.operationStatus] },
        { label: t('operation.fields.operationType'), value: operationTypeLabels[item.operationType] },
        { label: t('operation.fields.createdAt'), value: item.createdAt },
        { label: t('operation.fields.updatedAt'), value: item.updatedAt ?? "—" },
    ];

    return (
        <>
            <h6></h6>
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
        </>
    );
});
