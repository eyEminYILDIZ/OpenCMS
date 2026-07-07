import { makeAutoObservable, runInAction } from "mobx";
import i18next from "i18next";
import { AssetApi } from "../api";
import { PanelModes } from "../types";
import { StatusBarStore } from "./StatusBarStore";

export class AssetStore {


    statusBarStore: StatusBarStore;

    constructor(statusBarStore: StatusBarStore) {
        this.statusBarStore = statusBarStore;
        makeAutoObservable(this);
    }

    onAssetReceived = (asset: AssetApi.ListAll.Response) => {
        runInAction(() => {
            const index = this.allItems.findIndex(a => a.id === asset.id);
            if (index !== -1) {
                this.allItems[index] = asset;
            } else {
                this.allItems.push(asset);
            }

            if (this.selectedItem?.id === asset.id) {
                this.selectedItem = asset;
            }
        });
    }

    assetItemCounts: AssetApi.GetItemCounts.Response | null = null;
    allItems: AssetApi.ListAll.Response[] = [];
    selectedItem: AssetApi.GetById.Response | undefined = undefined;
    panelMode: PanelModes = PanelModes.Detail;
    listSearchValue: string = '';

    clearSelectedItems = () => {
        this.selectedItem = undefined;
    }

    setSelectedItem = (item: AssetApi.ListAll.Response | undefined) => {
        this.getById(item?.id || '');
    }

    setPanelMode = (mode: PanelModes) => {
        this.panelMode = mode;
    }

    setSearchValue(searchValue: string) {
        this.listSearchValue = searchValue;
        this.getAllItems();
    }

    loadItemCounts = async () => {
        try {
            const response = await AssetApi.GetItemCounts.call();
            runInAction(() => {
                this.assetItemCounts = response.data;
            });
        } catch (error) {
            this.statusBarStore.showError(i18next.t('asset.errors.loadCountFailed'));
        }
    }

    getAllItems = async () => {
        try {
            const response = await AssetApi.ListAll.call(this.listSearchValue);
            runInAction(() => {
                this.allItems = response.data;
            });
        } catch (error) {
            this.statusBarStore.showError(i18next.t('asset.errors.loadItemsFailed'));
        }
    }

    getById = async (id: string) => {
        try {
            const request: AssetApi.GetById.Request = { id };
            const response = await AssetApi.GetById.call(request);
            runInAction(() => {
                this.selectedItem = response.data;
            });
        } catch (error) {
            this.statusBarStore.showError(i18next.t('asset.errors.loadItemsFailed'));
        }
    }

    onCreateItem() {
        this.setPanelMode(PanelModes.Create);
        this.clearSelectedItems();
    }

    createItem = async (values: AssetApi.Create.Request) => {
        try {
            const response = await AssetApi.Create.call(values);
            await this.getAllItems();
            runInAction(() => {
                this.getById(response.data.id);
                this.panelMode = PanelModes.Detail;
            });
            await this.loadItemCounts();
            this.statusBarStore.showSuccess(i18next.t('asset.errors.createSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('asset.errors.createFailed'));
        }
    }

    updateItem = async (values: Omit<AssetApi.Update.Request, 'id'>) => {
        if (!this.selectedItem) {
            this.statusBarStore.showError(i18next.t('asset.errors.noItemSelected'));
            return;
        }

        try {
            const id = this.selectedItem.id;
            const request: AssetApi.Update.Request = { id, ...values };
            await AssetApi.Update.call(request);
            await this.getAllItems();
            runInAction(() => {
                this.getById(id);
            });
            this.statusBarStore.showSuccess(i18next.t('asset.errors.updateSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('asset.errors.updateFailed'));
        }
    }

    deleteItem = async () => {
        if (!this.selectedItem) {
            this.statusBarStore.showError(i18next.t('asset.errors.noItemSelected'));
            return;
        }

        try {
            const request = { id: this.selectedItem.id };
            await AssetApi.Delete.call(request);

            // after success
            this.clearSelectedItems();
            this.setPanelMode(PanelModes.Detail);
            await this.getAllItems();
            await this.loadItemCounts();
            this.statusBarStore.showSuccess(i18next.t('asset.errors.deleteSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('asset.errors.deleteFailed'));
        }
    }
}
