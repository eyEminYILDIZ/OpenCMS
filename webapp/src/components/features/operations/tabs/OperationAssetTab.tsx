import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { OperationApi } from "../../../../api";
import { stores } from "../../../../stores";
import DataList, { DataListColumn } from "../../../ui/DataList";
import { operationStatusLabels, PanelModes } from "../../../../types";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";

export const OperationAssetTab: React.FC = observer(() => {
    const { applicationStore, operationStore } = stores;
    const { t } = useTranslation();

    useEffect(() => {
        operationStore.getAllItems();
    }, [applicationStore.currentMenu]);

    const columns: DataListColumn<OperationApi.GetById.OperationAssetResponse>[] = [
        {
            key: "asset",
            header: t("operation.fields.name"),
            type: "string",
            render: (value, item) => (item.asset.name),
        },
        {
            key: "asset",
            header: t("common.isActive"),
            render: (value, item) => (item.asset.isActive ? t('common.active.yes') : t('common.active.no'))
        },
        {
            key: "delete",
            type: "button",
            icon: <Trash2 size={16} />,
            onButtonClick: (item) => {
                operationStore.setSelectedAsset(item);
                operationStore.setPanelMode(PanelModes.Delete);
            }
        }
    ];

    return (
        <DataList<OperationApi.GetById.OperationAssetResponse>
            columns={columns}
            items={operationStore.selectedItem?.operationAssets || []}
            onRowClicked={(item) => {
                operationStore.setSelectedAsset(item);
                operationStore.setPanelMode(PanelModes.Detail);
            }}
        />
    );
});
