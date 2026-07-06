import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { stores } from "../../../stores";
import { OperationTabs } from "../../../stores/OperationStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/Tabs";
import { OperationAssetTab, OperationDetailTab, OperationOrderTab, OperationDispatchTab } from "./tabs";

export const OperationTab: React.FC = observer(() => {
    const { operationStore } = stores;
    const { t } = useTranslation();

    return (
        <Tabs
            className="sidebar"
            value={operationStore.selectedTab}
            onValueChange={(val) => operationStore.setSelectedTab(val as OperationTabs)}
        >
            <TabsList>
                <TabsTrigger value={OperationTabs.Details}>
                    {t('operation.tabs.details')}
                </TabsTrigger>
                <TabsTrigger value={OperationTabs.Assets}>
                    {t('operation.tabs.assets')}
                </TabsTrigger>
                <TabsTrigger value={OperationTabs.Orders}>
                    {t('operation.tabs.orders')}
                </TabsTrigger>
                <TabsTrigger value={OperationTabs.Dispatches}>
                    {t('operation.tabs.dispatches')}
                </TabsTrigger>
            </TabsList>
            <TabsContent value={OperationTabs.Details}>
                <OperationDetailTab />
            </TabsContent>
            <TabsContent value={OperationTabs.Assets}>
                <OperationAssetTab />
            </TabsContent>
            <TabsContent value={OperationTabs.Orders}>
                <OperationOrderTab />
            </TabsContent>
            <TabsContent value={OperationTabs.Dispatches}>
                <OperationDispatchTab />
            </TabsContent>
        </Tabs>
    );

});
