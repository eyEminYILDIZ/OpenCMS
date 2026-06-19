import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { stores } from "../../../stores";
import { agentTypeLabels } from "../../../types";

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
        <>
            <h4>Agent Detail</h4>
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