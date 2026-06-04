import { makeAutoObservable, toJS } from "mobx";
import { ApiClient } from "../api/axios_setup";
import { AgentApi, AssetApi, OperationApi } from "../api";

export class ApplicationStore {
    constructor() {
        makeAutoObservable(this);
    }

    assetItemCounts: AssetApi.GetItemCounts.Response | null = null;
    agentItemCounts: AgentApi.GetItemCounts.Response | null = null;
    operationItemCounts: OperationApi.GetItemCounts.Response | null = null;

    loadItemCounts = async () => {
        try {
            const response = await AssetApi.GetItemCounts.call();
            this.assetItemCounts = response.data;

            console.log(toJS(this.assetItemCounts));
        } catch (error) {
            console.error("Error loading asset item counts:", error);
        }

        try {
            const response = await AgentApi.GetItemCounts.call();
            this.agentItemCounts = response.data;

            console.log(toJS(this.agentItemCounts));
        } catch (error) {
            console.error("Error loading agent item counts:", error);
        }

        try {
            const response = await OperationApi.GetItemCounts.call();
            this.operationItemCounts = response.data;

            console.log(toJS(this.operationItemCounts));
        } catch (error) {
            console.error("Error loading operation item counts:", error);
        }
    }
}
