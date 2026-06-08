import { makeAutoObservable, runInAction, toJS } from "mobx";
import { AssetApi } from "../api";

export class AssetStore {
    constructor() {
        makeAutoObservable(this);
    }

    assetItemCounts: AssetApi.GetItemCounts.Response | null = null;
    allItems: AssetApi.ListAll.Response[] = [];

    loadItemCounts = async () => {
        try {
            const response = await AssetApi.GetItemCounts.call();
            runInAction(() => {
                this.assetItemCounts = response.data;
                console.log(toJS(this.assetItemCounts));
            });
        } catch (error) {
            console.error("Error loading asset item counts:", error);
        }
    }

    getAllItems = async () => {
        try {
            const response = await AssetApi.ListAll.call();
            this.allItems = response.data;
            console.log(toJS(this.allItems));
        } catch (error) {
            console.error("Error getAllItems method:", error);
        }
    }
}
