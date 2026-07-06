import { observer } from "mobx-react-lite";
import DataList, { DataListColumn } from "../../ui/DataList";
import { DispatchApi } from "../../../api";
import { useEffect } from "react";
import { stores } from "../../../stores";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import { dispatchCategoryLabels, PanelModes } from "../../../types";

export const DispatchList: React.FC = observer(() => {
    const { applicationStore, dispatchStore } = stores;
    const { t } = useTranslation();

    useEffect(() => {
        dispatchStore.getAllItems();
    }, [applicationStore.currentMenu]);

    const columns: DataListColumn<DispatchApi.ListAll.Response>[] = [
        {
            key: "title",
            header: t("dispatch.fields.title"),
            type: "string",
        },
        {
            key: "category",
            header: t("dispatch.fields.category"),
            render: (value, item) => <p>{dispatchCategoryLabels[item.category]}</p>
        },
        {
            key: "edit",
            type: "button",
            icon: <Pencil size={18} />,
            onButtonClick: (item) => {
                dispatchStore.setSelectedItem(item);
                dispatchStore.setPanelMode(PanelModes.Update);
            }
        },
        {
            key: "delete",
            type: "button",
            icon: <Trash2 size={18} />,
            onButtonClick: (item) => {
                dispatchStore.setSelectedItem(item);
                dispatchStore.setPanelMode(PanelModes.Delete);
            }
        }
    ]

    return (
        <DataList<DispatchApi.ListAll.Response>
            columns={columns}
            items={dispatchStore.allItems}
            emptyText={t('dispatch.noDispatchesFound')}
            onRowClicked={(item) => {
                dispatchStore.setSelectedItem(item);
                dispatchStore.setPanelMode(PanelModes.Detail);
            }}
        />
    );
});
