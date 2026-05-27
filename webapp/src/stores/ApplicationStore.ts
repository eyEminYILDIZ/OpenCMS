import { makeAutoObservable, toJS } from "mobx";
import { ApiClient } from "../api/axios_setup";
import { AssetApi } from "../api/AssetApiDocumentation";

export class ApplicationStore {
    constructor() {
        makeAutoObservable(this);
    }

    assetItemCounts: AssetApi.GetItemCounts.Response | null = null;

    loadItemCounts = async () => {
        try {
            const response = await AssetApi.GetItemCounts.call();
            this.assetItemCounts = response.data;

            console.log(toJS(this.assetItemCounts));
        } catch (error) {
            console.error("Error loading item counts:", error);
        }
    }
}
