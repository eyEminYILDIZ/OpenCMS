import { makeAutoObservable, runInAction, toJS } from "mobx";
import { AssetApi } from "../api";

export class AssetStore {
    constructor() {
        makeAutoObservable(this);
    }

    assetItemCounts: AssetApi.GetItemCounts.Response | null = null;
    allItems: AssetApi.ListAll.Response[] = [];
    selectedItem: AssetApi.ListAll.Response | undefined = undefined;

    loadItemCounts = async () => {
        try {
            const response = await AssetApi.GetItemCounts.call();
            runInAction(() => {
                this.assetItemCounts = response.data;
            });
        } catch (error) {
            console.error("Error loading asset item counts:", error);
        }
    }

    setSelectedItem = (item: AssetApi.ListAll.Response | undefined) => {
        this.selectedItem = item;
    }

    getAllItems = async () => {
        try {
            const response = await AssetApi.ListAll.call();
            this.allItems = response.data;
        } catch (error) {
            console.error("Error getAllItems method:", error);
        }
    }
}
