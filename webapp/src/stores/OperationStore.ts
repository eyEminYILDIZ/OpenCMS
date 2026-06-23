import { makeAutoObservable, runInAction } from "mobx";
import i18next from "i18next";
import { OperationApi } from "../api";
import { PanelModes } from "../types";
import { StatusBarStore } from "./StatusBarStore";

export enum OperationTabs {
    Details = 'details',
    Assets = 'assets',
    Orders = 'orders',
}

export class OperationStore {

    statusBarStore: StatusBarStore;

    constructor(statusBarStore: StatusBarStore) {
        this.statusBarStore = statusBarStore;
        makeAutoObservable(this);
    }

    operationItemCounts: OperationApi.GetItemCounts.Response | null = null;
    allItems: OperationApi.ListAll.Response[] = [];
    selectedItem: OperationApi.GetById.Response | undefined = undefined;
    selectedOrder: OperationApi.GetById.OrderResponse | undefined = undefined;
    selectedAsset: OperationApi.GetById.OperationAssetResponse | undefined = undefined;
    panelMode: PanelModes = PanelModes.Detail;
    listSearchValue: string = '';
    selectedTab: OperationTabs = OperationTabs.Details;

    setSelectedTab = (tab: OperationTabs) => {
        this.selectedTab = tab;
    }

    clearSelectedItems = () => {
        this.selectedItem = undefined;
        this.selectedOrder = undefined;
        this.selectedAsset = undefined;
    }

    clearSelectedAsset = () => {
        this.selectedAsset = undefined;
    }

    clearSelectedOrder = () => {
        this.selectedOrder = undefined;
    }

    setSelectedItem = (item: OperationApi.ListAll.Response | undefined) => {
        this.getById(item?.id || '');
    }

    setSelectedOrder = (order: OperationApi.GetById.OrderResponse | undefined) => {
        this.selectedOrder = order;
    }

    setSelectedAsset = (asset: OperationApi.GetById.OperationAssetResponse | undefined) => {
        this.selectedAsset = asset;
    }

    setPanelMode = (mode: PanelModes) => {
        this.panelMode = mode;
    }

    setSearchValue(searchValue: string) {
        this.listSearchValue = searchValue;
        this.getAllItems();
    }

    onBackToList() {
        this.clearSelectedItems();
    }

    loadItemCounts = async () => {
        try {
            const response = await OperationApi.GetItemCounts.call();
            runInAction(() => {
                this.operationItemCounts = response.data;
            });
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.loadCountFailed'));
        }
    }

    getAllItems = async () => {
        try {
            const response = await OperationApi.ListAll.call(this.listSearchValue);
            runInAction(() => {
                this.allItems = response.data;
            });
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.loadItemsFailed'));
        }
    }

    getById = async (id: string) => {
        try {
            const request: OperationApi.GetById.Request = { id };
            const response = await OperationApi.GetById.call(request);
            runInAction(() => {
                this.selectedItem = response.data;
            });
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.loadItemFailed'));
        }
    }

    onCreateItem() {
        this.setPanelMode(PanelModes.Create);
        this.clearSelectedItems();
    }

    createItem = async (values: OperationApi.Create.Request) => {
        try {
            const response = await OperationApi.Create.call(values);
            await this.getAllItems();
            runInAction(() => {
                this.getById(response.data.id);
                this.panelMode = PanelModes.Detail;
            });
            await this.loadItemCounts();
            this.statusBarStore.showSuccess(i18next.t('operation.errors.createSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.createFailed'));
        }
    }

    updateItem = async (values: Omit<OperationApi.Update.Request, 'id'>) => {
        if (!this.selectedItem) {
            this.statusBarStore.showError(i18next.t('operation.errors.noItemSelected'));
            return;
        }

        try {
            const id = this.selectedItem.id;
            const request: OperationApi.Update.Request = { id, ...values };
            await OperationApi.Update.call(request);
            runInAction(() => {
                this.getById(id);
            });
            this.statusBarStore.showSuccess(i18next.t('operation.errors.updateSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.updateFailed'));
        }
    }

    deleteItem = async () => {
        if (!this.selectedItem) {
            this.statusBarStore.showError(i18next.t('operation.errors.noItemSelected'));
            return;
        }

        try {
            const request = { id: this.selectedItem.id };
            await OperationApi.Delete.call(request);

            this.clearSelectedItems();
            this.setPanelMode(PanelModes.Detail);
            await this.getAllItems();
            await this.loadItemCounts();
            this.statusBarStore.showSuccess(i18next.t('operation.errors.deleteSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.deleteFailed'));
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////// Operation Assets //////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    onCreateAsset() {
        this.setPanelMode(PanelModes.Create);
        this.clearSelectedAsset();
    }

    createAsset = async (values: OperationApi.OperationAssets.Create.Request) => {
        try {
            await OperationApi.OperationAssets.Create.call(values);
            runInAction(() => {
                this.getById(this.selectedItem?.id || '');
                this.panelMode = PanelModes.Detail;
            });
            this.statusBarStore.showSuccess(i18next.t('operation.errors.createAssetSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.createAssetFailed'));
        }
    }

    deleteAsset = async () => {
        if (!this.selectedItem) {
            this.statusBarStore.showError(i18next.t('operation.errors.noItemSelected'));
            return;
        }

        try {
            const request = { id: this.selectedAsset?.id || '' };
            await OperationApi.OperationAssets.Delete.call(request);

            this.clearSelectedAsset();
            this.setPanelMode(PanelModes.Detail);
            runInAction(() => {
                this.getById(this.selectedItem?.id || '');
            });
            this.statusBarStore.showSuccess(i18next.t('operation.errors.deleteAssetSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.deleteAssetFailed'));
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////// Operation Orders //////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    onCreateOrder() {
        this.setPanelMode(PanelModes.Create);
        this.clearSelectedOrder();
    }

    createOrder = async (values: OperationApi.Orders.Create.Request) => {
        try {
            await OperationApi.Orders.Create.call(values);
            runInAction(() => {
                this.getById(this.selectedItem?.id || '');
                this.panelMode = PanelModes.Detail;
            });
            this.statusBarStore.showSuccess(i18next.t('operation.errors.createOrderSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.createOrderFailed'));
        }
    }

    updateOrder = async (values: Omit<OperationApi.Orders.Update.Request, 'id'>) => {
        if (!this.selectedOrder) {
            this.statusBarStore.showError(i18next.t('operation.errors.noItemSelected'));
            return;
        }

        try {
            await OperationApi.Orders.Update.call({ id: this.selectedOrder.id, ...values });
            runInAction(() => {
                this.getById(this.selectedItem?.id || '');
                this.panelMode = PanelModes.Detail;
            });
            this.statusBarStore.showSuccess(i18next.t('operation.errors.updateOrderSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.updateOrderFailed'));
        }
    }

    deleteOrder = async () => {
        if (!this.selectedOrder) {
            this.statusBarStore.showError(i18next.t('operation.errors.noItemSelected'));
            return;
        }

        try {
            const request = { id: this.selectedOrder.id };
            await OperationApi.Orders.Delete.call(request);

            this.clearSelectedOrder();
            this.setPanelMode(PanelModes.Detail);
            runInAction(async () => {
                await this.getById(this.selectedItem?.id || '');
            });
            this.statusBarStore.showSuccess(i18next.t('operation.errors.deleteOrderSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.deleteOrderFailed'));
        }
    }
}
