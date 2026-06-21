import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { OperationApi } from "../../../../api";
import { stores } from "../../../../stores";
import DataList, { DataListColumn } from "../../../ui/DataList";
import { operationStatusLabels, PanelModes } from "../../../../types";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";

export const OperationOrderTab: React.FC = observer(() => {
    const { applicationStore, operationStore } = stores;
    const { t } = useTranslation();

    useEffect(() => {
        operationStore.getAllItems();
    }, [applicationStore.currentMenu]);

    const columns: DataListColumn<OperationApi.ListAll.Response>[] = [
        {
            key: "name",
            header: t("operation.fields.name"),
            type: "string",
        },
        {
            key: "operationStatus",
            header: t("operation.fields.operationStatus"),
            render: (value, item) => (value == OperationApi.Enums.OperationStatus.InProgress || value == OperationApi.Enums.OperationStatus.NotStarted) ? <p style={{ color: "green" }}>{operationStatusLabels[item.operationStatus]}</p> : <p style={{ color: "red" }}>{operationStatusLabels[item.operationStatus]}</p>
        },
        {
            key: "edit",
            type: "button",
            icon: <Pencil size={16} />,
            onButtonClick: (item) => {
                operationStore.setSelectedItem(item);
                operationStore.setPanelMode(PanelModes.Update);
            }
        },
        {
            key: "delete",
            type: "button",
            icon: <Trash2 size={16} />,
            onButtonClick: (item) => {
                operationStore.setSelectedItem(item);
                operationStore.setPanelMode(PanelModes.Delete);
            }
        }
    ];

    return (
        <DataList<OperationApi.ListAll.Response>
            columns={columns}
            items={operationStore.allItems}
            onRowClicked={(item) => {
                operationStore.setSelectedItem(item);
                operationStore.setPanelMode(PanelModes.Detail);
            }}
        />
    );
});
