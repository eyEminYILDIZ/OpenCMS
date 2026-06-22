import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { OperationApi } from "../../../../api";
import { stores } from "../../../../stores";
import DataList, { DataListColumn } from "../../../ui/DataList";
import { operationStatusLabels, orderStatusLabels, PanelModes } from "../../../../types";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";

export const OperationOrderTab: React.FC = observer(() => {
    const { applicationStore, operationStore } = stores;
    const { t } = useTranslation();

    useEffect(() => {
        operationStore.getAllItems();
    }, [applicationStore.currentMenu]);

    const columns: DataListColumn<OperationApi.GetById.OrderResponse>[] = [
        {
            key: "description",
            header: t("operation.order.description"),
            type: "string",
        },
        {
            key: "orderStatus",
            header: t("operation.order.orderStatus"),
            render: (value, item) => (orderStatusLabels[item.orderStatus] || item.orderStatus),
        },
        {
            key: "edit",
            type: "button",
            icon: <Pencil size={16} />,
            onButtonClick: (item) => {
                operationStore.setSelectedOrder(item);
                operationStore.setPanelMode(PanelModes.Update);
            }
        },
        {
            key: "delete",
            type: "button",
            icon: <Trash2 size={16} />,
            onButtonClick: (item) => {
                operationStore.setSelectedOrder(item);
                operationStore.setPanelMode(PanelModes.Delete);
            }
        }
    ];

    return (
        <DataList<OperationApi.GetById.OrderResponse>
            columns={columns}
            items={operationStore.selectedItem?.orders || []}
            onRowClicked={(item) => {
                operationStore.setSelectedOrder(item);
                operationStore.setPanelMode(PanelModes.Detail);
            }}
        />
    );
});
