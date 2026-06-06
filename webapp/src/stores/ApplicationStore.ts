import { makeAutoObservable, runInAction, toJS } from "mobx";
import { ApiClient } from "../api/axios_setup";
import { AgentApi, AssetApi, OperationApi } from "../api";
import { AgentStore } from "./AgentStore";

export class ApplicationStore {
    constructor(_agentStore: AgentStore) {
        makeAutoObservable(this);
        this.agentStore = _agentStore;
    }
    agentStore: AgentStore;

    assetItemCounts: AssetApi.GetItemCounts.Response | null = null;
    operationItemCounts: OperationApi.GetItemCounts.Response | null = null;

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

        // load agent item counts
        await this.agentStore.loadItemCounts();

        try {
            const response = await OperationApi.GetItemCounts.call();
            runInAction(() => {
                this.operationItemCounts = response.data;
                console.log(toJS(this.operationItemCounts));
            });
        } catch (error) {
            console.error("Error loading operation item counts:", error);
        }
    }
}
