import { makeAutoObservable, runInAction } from "mobx";
import i18next from "i18next";
import { AssetApi, DispatchApi, OperationApi } from "../api";
import { PanelModes } from "../types";
import { StatusBarStore } from "./StatusBarStore";

export enum OperationTabs {
    Details = 'details',
    Assets = 'assets',
    Orders = 'orders',
    Dispatches = 'dispatches',
}

export class OperationStore {

    statusBarStore: StatusBarStore;

    constructor(statusBarStore: StatusBarStore) {
        this.statusBarStore = statusBarStore;
        makeAutoObservable(this);
    }

    onAssetReceived = (asset: AssetApi.ListAll.Response) => {
        runInAction(() => {
            if (!this.selectedItem) return;
            const index = this.selectedItem.operationAssets.findIndex(a => a.assetId === asset.id);
            if (index !== -1) {
                this.selectedItem.operationAssets[index].asset = {
                    id: asset.id,
                    name: asset.name,
                    latitude: asset.latitude,
                    longitude: asset.longitude,
                    altitude: asset.altitude,
                    heading: asset.heading,
                    speed: asset.speed,
                    assetType: asset.assetType,
                    threatType: asset.threatType,
                    firstUpdated: asset.firstUpdated,
                    lastUpdated: asset.lastUpdated,
                    isActive: asset.isActive,
                    relatedAgentId: asset.relatedAgentId,
                };
            }
        });
    }

    onDispatchReceived = (dispatch: DispatchApi.ListAll.Response) => {
        runInAction(() => {
            if (!this.selectedItem) return;
            const index = this.selectedItem.dispatches.findIndex(a => a.id === dispatch.id);
            if (index !== -1) {
                this.selectedItem.dispatches[index] = {
                    id: dispatch.id,
                    title: dispatch.title,
                    description: dispatch.description,
                    category: dispatch.category,
                    occuredAt: dispatch.occuredAt,
                    relatedEntityId: dispatch.relatedEntityId,
                    relatedChildEntityId: dispatch.relatedChildEntityId,
                    providerAgentId: dispatch.providerAgentId,
                    providerAgentName: dispatch.providerAgentName,
                    createdAt: dispatch.createdAt,
                    updatedAt: dispatch.updatedAt,
                };
            }
        });
    }

    operationItemCounts: OperationApi.GetItemCounts.Response | null = null;
    allItems: OperationApi.ListAll.Response[] = [];
    selectedItem: OperationApi.GetById.Response | undefined = undefined;
    selectedOrder: OperationApi.GetById.OrderResponse | undefined = undefined;
    selectedAsset: OperationApi.GetById.OperationAssetResponse | undefined = undefined;
    selectedDispatch: OperationApi.GetById.DispatchResponse | undefined = undefined;
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
        this.selectedDispatch = undefined;
    }

    clearSelectedAsset = () => {
        this.selectedAsset = undefined;
    }

    clearSelectedOrder = () => {
        this.selectedOrder = undefined;
    }

    clearSelectedDispatch = () => {
        this.selectedDispatch = undefined;
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

    setSelectedDispatch = (dispatch: OperationApi.GetById.DispatchResponse | undefined) => {
        this.selectedDispatch = dispatch;
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


    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////// Operation Dispatches //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    onCreateDispatch() {
        this.setPanelMode(PanelModes.Create);
        this.clearSelectedDispatch();
    }

    createDispatch = async (values: Omit<DispatchApi.Create.Request, 'category' | 'relatedEntityId'>) => {
        try {
            const request: DispatchApi.Create.Request = {
                ...values,
                category: DispatchApi.Enums.DispatchCategories.Operation,
                relatedEntityId: this.selectedItem?.id || '',
            };
            await DispatchApi.Create.call(request);
            runInAction(() => {
                this.getById(this.selectedItem?.id || '');
                this.panelMode = PanelModes.Detail;
            });
            this.statusBarStore.showSuccess(i18next.t('operation.errors.createDispatchSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.createDispatchFailed'));
        }
    }

    updateDispatch = async (values: Omit<DispatchApi.Update.Request, 'id' | 'category' | 'relatedEntityId'>) => {
        if (!this.selectedDispatch) {
            this.statusBarStore.showError(i18next.t('operation.errors.noItemSelected'));
            return;
        }

        try {
            const request: DispatchApi.Update.Request = {
                id: this.selectedDispatch.id,
                ...values,
                category: DispatchApi.Enums.DispatchCategories.Operation,
                relatedEntityId: this.selectedItem?.id || '',
            };
            await DispatchApi.Update.call(request);
            runInAction(() => {
                this.getById(this.selectedItem?.id || '');
                this.panelMode = PanelModes.Detail;
            });
            this.statusBarStore.showSuccess(i18next.t('operation.errors.updateDispatchSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.updateDispatchFailed'));
        }
    }

    deleteDispatch = async () => {
        if (!this.selectedDispatch) {
            this.statusBarStore.showError(i18next.t('operation.errors.noItemSelected'));
            return;
        }

        try {
            const request = { id: this.selectedDispatch.id };
            await DispatchApi.Delete.call(request);

            this.clearSelectedDispatch();
            this.setPanelMode(PanelModes.Detail);
            runInAction(async () => {
                await this.getById(this.selectedItem?.id || '');
            });
            this.statusBarStore.showSuccess(i18next.t('operation.errors.deleteDispatchSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.deleteDispatchFailed'));
        }
    }
}
