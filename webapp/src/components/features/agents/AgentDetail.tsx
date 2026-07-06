import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { RightPanelWrapper } from "../../layout/right-panel/RightPanelWrapper";
import { stores } from "../../../stores";
import { agentTypeLabels } from "../../../types";
import DetailCard from "../../ui/DetailCard";
import DetailRow from "../../ui/DetailRow";

export const AgentDetail: React.FC = observer(() => {
    const { agentStore } = stores;
    const { t } = useTranslation();
    const item = agentStore.selectedItem;

    if (item == undefined)
        return (<p className="right-panel-empty">{t('agent.noItemSelected')}</p>);

    const rows: { label: string; value: string }[] = [
        { label: t('agent.fields.id'), value: item.id },
        { label: t('agent.fields.name'), value: item.name },
        { label: t('agent.fields.description'), value: item.description },
        { label: t('agent.fields.agentType'), value: agentTypeLabels[item.agentType] },
        { label: t('agent.fields.isActive'), value: item.isActive ? t('common.active.yes') : t('common.active.no') },
        { label: t('agent.fields.lastSeen'), value: item.lastSeen ?? "—" },
        { label: t('agent.fields.createdAt'), value: item.createdAt },
        { label: t('agent.fields.updatedAt'), value: item.updatedAt ?? "—" },
    ];

    return (
        <RightPanelWrapper>
            <h4>Agent Detail</h4>
            <DetailCard>
                {rows.map(({ label, value }) => (
                    <DetailRow key={label} label={label} value={value} />
                ))}
            </DetailCard>
        </RightPanelWrapper>
    );
})