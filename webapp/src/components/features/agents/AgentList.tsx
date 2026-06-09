import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { AgentApi } from "../../../api";
import { stores } from "../../../stores";
import DataList, { DataListColumn } from "../../ui/DataList";
import { useTranslation } from "react-i18next";

export const AgentList: React.FC = observer(() => {
    const { applicationStore, agentStore } = stores;
    const { t } = useTranslation();

    useEffect(() => {
        agentStore.getAllItems();
    }, [applicationStore.currentMenu]);

    const columns: DataListColumn<AgentApi.ListAll.Response>[] = [
        {
            key: "name",
            header: t("agent.fields.name"),
            type: "string",
        },
        {
            key: "isActive",
            header: t("agent.fields.isActive"),
            render: (value, item) => item.isActive ? <p style={{ color: "green" }}>{t("common.yes")}</p> : <p style={{ color: "red" }}>{t("common.no")}</p>
        }
    ]

    return (
        <DataList<AgentApi.ListAll.Response>
            columns={columns}
            items={agentStore.allItems}
            onRowClicked={(item) => agentStore.setSelectedItem(item)}
        />
    );
});