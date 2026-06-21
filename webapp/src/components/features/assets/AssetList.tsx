import { observer } from "mobx-react-lite";
import DataList, { DataListColumn } from "../../ui/DataList";
import { AssetApi } from "../../../api";
import { useEffect } from "react";
import { stores } from "../../../stores";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import { PanelModes } from "../../../types";


export const AssetList: React.FC = observer(() => {
    const { applicationStore, assetStore } = stores;
    const { t } = useTranslation();

    useEffect(() => {
        assetStore.getAllItems();
    }, [applicationStore.currentMenu]);

    const columns: DataListColumn<AssetApi.ListAll.Response>[] = [
        {
            key: "name",
            header: "Name",
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
            icon: <Pencil size={18} />,
            onButtonClick: (item) => {
                assetStore.setSelectedItem(item);
                assetStore.setPanelMode(PanelModes.Update);
            }
        },
        {
            key: "delete",
            type: "button",
            icon: <Trash2 size={18} />,
            onButtonClick: (item) => {
                assetStore.setSelectedItem(item);
                assetStore.setPanelMode(PanelModes.Delete);
            }
        }
    ]

    return (
        <DataList<AssetApi.ListAll.Response>
            columns={columns}
            items={assetStore.allItems}
            onRowClicked={(item) => {
                assetStore.setSelectedItem(item);
                assetStore.setPanelMode(PanelModes.Detail);
            }}
        />
    );
});