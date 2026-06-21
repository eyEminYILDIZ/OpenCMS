import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { stores } from "../../../stores";
import { OperationList } from "./OperationList";
import { OperationTabs } from "../../../stores/OperationStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/Tabs";
import { OperationDetailTab, OperationAssetTab, OperationOrderTab } from "./tabs";
import { OperationTab } from "./OperationTab";

export const OperationSidebar: React.FC = observer(() => {
    const { applicationStore, operationStore } = stores;
    const { t } = useTranslation();

    useEffect(() => {
        operationStore.getAllItems();
    }, [applicationStore.currentMenu]);

    if (operationStore.selectedItem !== undefined)
        return (
            <OperationTab />
        );

    return (
        <OperationList />
    );
});
