import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { OperationApi } from "../../../api";
import { stores } from "../../../stores";
import DataList, { DataListColumn } from "../../ui/DataList";

export const OperationList: React.FC = observer(() => {
    const { applicationStore, operationStore } = stores;

    useEffect(() => {
        operationStore.getAllItems();
    }, [applicationStore.currentMenu]);

    const columns: DataListColumn<OperationApi.ListAll.Response>[] = [
        {
            key: "name",
            header: "Name",
            type: "string",
        }
    ];

    return (
        <DataList<OperationApi.ListAll.Response>
            columns={columns}
            items={operationStore.allItems}
            onRowClicked={(item) => operationStore.setSelectedItem(item)}
        />
    );
});
