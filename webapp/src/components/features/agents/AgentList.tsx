import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { AgentApi } from "../../../api";
import { stores } from "../../../stores";
import DataList, { DataListColumn } from "../../ui/DataList";

export const AgentList: React.FC = observer(() => {
    const { applicationStore, agentStore } = stores;

    useEffect(() => {
        agentStore.getAllItems();
    }, [applicationStore.currentMenu]);

    const columns: DataListColumn<AgentApi.ListAll.Response>[] = [
        {
            key: "name",
            header: "Name",
            type: "string",
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