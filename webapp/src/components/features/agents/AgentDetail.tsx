import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { stores } from "../../../stores";
import { agentTypeLabels, threatTypeLabels } from "../../../types";

export const AgentDetail: React.FC = observer(() => {
    const { agentStore } = stores;
    const { t } = useTranslation();
    const item = agentStore.selectedItem;

    if (item == undefined)
        return (<p>{t('agent.noItemSelected')}</p>);

    const rows: { label: string; value: string }[] = [
        { label: t('agent.fields.id'), value: item.id },
        { label: t('agent.fields.name'), value: item.name },
        { label: t('agent.fields.description'), value: item.description },
        { label: t('agent.fields.agentType'), value: agentTypeLabels[item.agentType] },
        { label: t('agent.fields.active'), value: item.isActive ? t('common.active.yes') : t('common.active.no') },
        { label: t('agent.fields.lastSeen'), value: item.lastSeen ?? "—" },
        { label: t('agent.fields.createdAt'), value: item.createdAt },
        { label: t('agent.fields.updatedAt'), value: item.updatedAt ?? "—" },
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
})