import { observer } from "mobx-react-lite";
import DataList, { DataListColumn } from "../../../ui/DataList";
import { AssetApi } from "../../../../api";
import { useEffect, useMemo } from "react";
import { stores } from "../../../../stores";


export const AssetList: React.FC = observer(() => {
    const { applicationStore, assetStore } = stores;

    useEffect(() => {
        assetStore.getAllItems();
    }, [applicationStore.currentMenu]);

    const columns: DataListColumn<AssetApi.ListAll.Response>[] = [
        {
            key: "name",
            header: "Name",
            type: "string",
        }
    ]

    return (
        <DataList<AssetApi.ListAll.Response>
            columns={columns}
            items={assetStore.allItems}
            onRowClicked={(item) => assetStore.setSelectedItem(item)}
        />
    );
});