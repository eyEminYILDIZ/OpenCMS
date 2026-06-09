import { makeAutoObservable, runInAction, toJS } from "mobx";
import { AssetApi } from "../api";
import { PanelModes } from "../types";

export class AssetStore {
    constructor() {
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
        } catch (error) {
            console.error("Error assets/getAllItems method:", error);
        }
    }
}
