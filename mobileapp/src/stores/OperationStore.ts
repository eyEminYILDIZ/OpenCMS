import { makeAutoObservable, runInAction } from "mobx";
import i18next from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AssetApi, DispatchApi, OperationApi } from "../api";
import { PanelModes } from "../types";
import { StatusBarStore } from "./StatusBarStore";
import { agentId, assetId } from "../../app.json"

const SELECTED_OPERATION_STORAGE_KEY = "cms_selected_operation_id";

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



    allItems: OperationApi.GetActivesByAgent.Response[] = [];
    selectedItem: OperationApi.GetById.Response | undefined = undefined;
    selectedOrder: OperationApi.GetById.OrderResponse | undefined = undefined;
    selectedAsset: OperationApi.GetById.OperationAssetResponse | undefined = undefined;
    panelMode: PanelModes = PanelModes.Detail;
    listSearchValue: string = '';
    selectedTab: OperationTabs = OperationTabs.Details;


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


    setSelectedTab = (tab: OperationTabs) => {
        this.selectedTab = tab;
    }

    clearSelectedItems = () => {
        this.selectedItem = undefined;
        this.selectedOrder = undefined;
        this.selectedAsset = undefined;
        this.persistSelectedOperationId(undefined);
    }

    clearSelectedAsset = () => {
        this.selectedAsset = undefined;
    }

    clearSelectedOrder = () => {
        this.selectedOrder = undefined;
    }

    setSelectedItem = (item: OperationApi.GetById.Response | undefined) => {
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
        this.getActiveItems();
    }

    onBackToList() {
        this.clearSelectedItems();
    }

    initialize = async () => {
        await this.getActiveItems();
        await this.restoreSelectedOperation();
    }

    persistSelectedOperationId = (id: string | undefined) => {
        if (id) {
            AsyncStorage.setItem(SELECTED_OPERATION_STORAGE_KEY, id).catch(() => { });
        } else {
            AsyncStorage.removeItem(SELECTED_OPERATION_STORAGE_KEY).catch(() => { });
        }
    }

    restoreSelectedOperation = async () => {
        try {
            const persistedId = await AsyncStorage.getItem(SELECTED_OPERATION_STORAGE_KEY);
            if (!persistedId) return;

            const stillAvailable = this.allItems.some(item => item.id === persistedId);
            if (stillAvailable) {
                await this.getById(persistedId);
            } else {
                this.persistSelectedOperationId(undefined);
                this.statusBarStore.showWarning(i18next.t('operation.errors.previousSelectionUnavailable'));
            }
        } catch {
            // ignore corrupt storage
        }
    }

    getActiveItems = async () => {
        try {
            const request: OperationApi.GetActivesByAgent.Request = {
                agentId: agentId,
            };
            const response = await OperationApi.GetActivesByAgent.call(request);
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
            this.persistSelectedOperationId(response.data.id);
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.loadItemFailed'));
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////// Operation Orders //////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    // onCompleteOrder() {
    //     this.setPanelMode(PanelModes.Create);
    //     this.clearSelectedOrder();
    // }

    // completeOrder = async (values: OperationApi.Orders.Create.Request) => {
    //     try {
    //         await OperationApi.Orders.Create.call(values);
    //         runInAction(() => {
    //             this.getById(this.selectedItem?.id || '');
    //             this.panelMode = PanelModes.Detail;
    //         });
    //         this.statusBarStore.showSuccess(i18next.t('operation.errors.completeOrderSucceeded'));
    //     } catch (error) {
    //         this.statusBarStore.showError(i18next.t('operation.errors.completeOrderFailed'));
    //     }
    // }
}
