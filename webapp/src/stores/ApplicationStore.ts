import { makeAutoObservable } from "mobx";
import { ApiClient } from "../api/axios_setup";
import { AssetApi } from "../api/AssetApiDocumentation";

export class ApplicationStore {
    constructor() {
        makeAutoObservable(this);
    }

    assetItemCounts: AssetApi.GetItemCounts.Response | null = null;

    loadItemCounts = async () => {
        try {
            const response = await ApiClient.get(AssetApi.GetItemCounts.path);
            console.log(response);

            this.assetItemCounts = response.data;
            console.log(this.assetItemCounts);

        } catch (error) {
            console.error("Error loading item counts:", error);
        }
    }
}
