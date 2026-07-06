import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { OperationApi } from "../../../../api";
import { stores } from "../../../../stores";
import DataList, { DataListColumn } from "../../../ui/DataList";
import { PanelModes } from "../../../../types";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";

export const OperationDispatchTab: React.FC = observer(() => {
    const { applicationStore, operationStore } = stores;
    const { t } = useTranslation();

    useEffect(() => {
        operationStore.getAllItems();
    }, [applicationStore.currentMenu]);

    const columns: DataListColumn<OperationApi.GetById.DispatchResponse>[] = [
        {
            key: "title",
            header: t("operation.dispatchFields.title"),
            type: "string",
        },
        {
            key: "occuredAt",
            header: t("operation.dispatchFields.occuredAt"),
            type: "string",
        },
        {
            key: "edit",
            type: "button",
            icon: <Pencil size={16} />,
            onButtonClick: (item) => {
                operationStore.setSelectedDispatch(item);
                operationStore.setPanelMode(PanelModes.Update);
            }
        },
        {
            key: "delete",
            type: "button",
            icon: <Trash2 size={16} />,
            onButtonClick: (item) => {
                operationStore.setSelectedDispatch(item);
                operationStore.setPanelMode(PanelModes.Delete);
            }
        }
    ];

    return (
        <DataList<OperationApi.GetById.DispatchResponse>
            columns={columns}
            items={operationStore.selectedItem?.dispatches || []}
            onRowClicked={(item) => {
                operationStore.setSelectedDispatch(item);
                operationStore.setPanelMode(PanelModes.Detail);
            }}
        />
    );
});
