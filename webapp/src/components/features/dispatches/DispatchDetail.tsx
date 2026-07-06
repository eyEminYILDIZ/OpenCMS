import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { RightPanelWrapper } from "../../layout/right-panel/RightPanelWrapper";
import { stores } from "../../../stores";
import { dispatchCategoryLabels } from "../../../types";
import DetailCard from "../../ui/DetailCard";
import DetailRow from "../../ui/DetailRow";

export const DispatchDetail: React.FC = observer(() => {
    const { dispatchStore } = stores;
    const { t } = useTranslation();
    const item = dispatchStore.selectedItem;

    if (item == undefined)
        return (<p className="right-panel-empty">{t('dispatch.noItemSelected')}</p>);

    const rows: { label: string; value: string }[] = [
        { label: t('dispatch.fields.id'), value: item.id },
        { label: t('dispatch.fields.title'), value: item.title },
        { label: t('dispatch.fields.description'), value: item.description },
        { label: t('dispatch.fields.category'), value: dispatchCategoryLabels[item.category] },
        { label: t('dispatch.fields.occuredAt'), value: item.occuredAt },
        { label: t('dispatch.fields.relatedEntityId'), value: item.relatedEntityId },
        { label: t('dispatch.fields.providerAgent'), value: item.providerAgentName },
        { label: t('dispatch.fields.createdAt'), value: item.createdAt },
        { label: t('dispatch.fields.updatedAt'), value: item.updatedAt ?? "—" },
    ];

    return (
        <RightPanelWrapper>
            <h4>{t('dispatch.detail.title')}</h4>
            <DetailCard>
                {rows.map(({ label, value }) => (
                    <DetailRow key={label} label={label} value={value} />
                ))}
            </DetailCard>
        </RightPanelWrapper>
    );
})
