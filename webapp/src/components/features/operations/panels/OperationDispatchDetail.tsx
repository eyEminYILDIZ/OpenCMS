import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { RightPanelWrapper } from "../../../layout/right-panel/RightPanelWrapper";
import { stores } from "../../../../stores";
import DetailCard from "../../../ui/DetailCard";
import DetailRow from "../../../ui/DetailRow";

export const OperationDispatchDetail: React.FC = observer(() => {
    const { operationStore } = stores;
    const { t } = useTranslation();
    const item = operationStore.selectedDispatch;

    if (item == undefined)
        return (<p className="right-panel-empty">{t('operation.errors.noItemSelected')}</p>);

    const rows: { label: string; value: string }[] = [
        { label: t('operation.dispatchFields.id'), value: item.id },
        { label: t('operation.dispatchFields.title'), value: item.title },
        { label: t('operation.dispatchFields.description'), value: item.description },
        { label: t('operation.dispatchFields.occuredAt'), value: item.occuredAt },
        { label: t('operation.dispatchFields.providerAgent'), value: item.providerAgentName },
        { label: t('operation.dispatchFields.createdAt'), value: item.createdAt },
        { label: t('operation.dispatchFields.updatedAt'), value: item.updatedAt ?? "—" },
    ];

    return (
        <RightPanelWrapper>
            <h4>{t('operation.detailDispatch.title')}</h4>
            <DetailCard>
                {rows.map(({ label, value }) => (
                    <DetailRow key={label} label={label} value={value} />
                ))}
            </DetailCard>
        </RightPanelWrapper>
    );
});
