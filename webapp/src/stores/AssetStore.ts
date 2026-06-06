import { makeAutoObservable, runInAction, toJS } from "mobx";
import { AssetApi } from "../api";

export class AssetStore {
    constructor() {
        makeAutoObservable(this);
    }

    assetItemCounts: AssetApi.GetItemCounts.Response | null = null;

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
}
