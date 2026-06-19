import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { AgentApi } from "../../../api";
import { stores } from "../../../stores";
import DataList, { DataListColumn } from "../../ui/DataList";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import { PanelModes } from "../../../types";

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
        },
        {
            key: "edit",
            type: "button",
            icon: <Pencil size={16} />,
            onButtonClick: (item) => {
                agentStore.setSelectedItem(item);
                agentStore.setPanelMode(PanelModes.Update);
            }
        },
        {
            key: "delete",
            type: "button",
            icon: <Trash2 size={16} />,
            onButtonClick: (item) => {
                agentStore.setSelectedItem(item);
                agentStore.setPanelMode(PanelModes.Delete);
            }
        }
    ]

    return (
        <DataList<AgentApi.ListAll.Response>
            columns={columns}
            items={agentStore.allItems}
            onRowClicked={(item) => {
                agentStore.setSelectedItem(item);
                agentStore.setPanelMode(PanelModes.Detail);
            }}
        />
    );
});