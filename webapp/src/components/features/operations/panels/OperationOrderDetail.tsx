import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { RightPanelWrapper } from "../../../layout/right-panel/RightPanelWrapper";
import { stores } from "../../../../stores";
import { orderStatusLabels, orderTypeLabels } from "../../../../types";
import DetailCard from "../../../ui/DetailCard";
import DetailRow from "../../../ui/DetailRow";

export const OperationOrderDetail: React.FC = observer(() => {
    const { operationStore } = stores;
    const { t } = useTranslation();
    const item = operationStore.selectedOrder;

    if (item == undefined)
        return (<p className="right-panel-empty">{t('operation.errors.noItemSelected')}</p>);

    const rows: { label: string; value: string }[] = [
        { label: t('operation.orderFields.id'), value: item.id },
        { label: t('operation.orderFields.code'), value: item.code },
        { label: t('operation.orderFields.description'), value: item.description },
        { label: t('operation.orderFields.issuedDate'), value: item.issuedDate },
        { label: t('operation.orderFields.completedDate'), value: item.completedDate },
        { label: t('operation.orderFields.orderStatus'), value: orderStatusLabels[item.orderStatus] },
        { label: t('operation.orderFields.orderType'), value: orderTypeLabels[item.orderType] },
        { label: t('operation.orderFields.targetDatePeriodStart'), value: item.targetDatePeriodStart },
        { label: t('operation.orderFields.targetDatePeriodEnd'), value: item.targetDatePeriodEnd },
        { label: t('operation.orderFields.targetPointLatitude'), value: String(item.targetPointLatitude) },
        { label: t('operation.orderFields.targetPointLongitude'), value: String(item.targetPointLongitude) },
        { label: t('operation.orderFields.targetPointAltitude'), value: String(item.targetPointAltitude) },
        { label: t('operation.orderFields.targetPointHeading'), value: String(item.targetPointHeading) },
        { label: t('operation.orderFields.targetPointSpeed'), value: String(item.targetPointSpeed) },
        { label: t('operation.orderFields.responsibleOperationAssetId'), value: item.responsibleOperationAssetName },
        { label: t('operation.orderFields.previousOrderId'), value: item.previousOrderDescription ?? '' },
    ];

    return (
        <RightPanelWrapper>
            <h4>{t('operation.detailOrder.title')}</h4>
            <DetailCard>
                {rows.map(({ label, value }) => (
                    <DetailRow key={label} label={label} value={value} />
                ))}
            </DetailCard>
        </RightPanelWrapper>
    );
});
