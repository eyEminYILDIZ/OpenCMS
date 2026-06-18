import { makeAutoObservable, runInAction, toJS } from "mobx";
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

    assetItemCounts: AssetApi.GetItemCounts.Response | null = null;
    allItems: AssetApi.ListAll.Response[] = [];
    selectedItem: AssetApi.ListAll.Response | undefined = undefined;
    panelMode: PanelModes = PanelModes.Detail;

    setSelectedItem = (item: AssetApi.ListAll.Response | undefined) => {
        this.selectedItem = item;
    }

    setPanelMode = (mode: PanelModes) => {
        this.panelMode = mode;
    }

    loadItemCounts = async () => {
        try {
            const response = await AssetApi.GetItemCounts.call();
            runInAction(() => {
                this.assetItemCounts = response.data;
            });
        } catch (error) {
            console.error("Error assets/loading asset item counts:", error);
        }
    }

    getAllItems = async () => {
        try {
            const response = await AssetApi.ListAll.call();
            this.allItems = response.data;

            // This line is for testing error handling
            throw new Error("Test error for getAllItems");
        } catch (error) {
            console.error("Error assets/getAllItems method:", error);
            this.statusBarStore.showError(i18next.t('statusBar.errors.loadFailed'));
        }
    }
}
