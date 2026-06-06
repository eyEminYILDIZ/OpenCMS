import { makeAutoObservable, runInAction, toJS } from "mobx";
import { AssetApi, OperationApi } from "../api";
import { AgentStore } from "./AgentStore";
import { AssetStore } from "./AssetStore";
import { OperationStore } from "./OperationStore";

export class ApplicationStore {
    constructor(_agentStore: AgentStore, _assetStore: AssetStore, _operationStore: OperationStore) {
        makeAutoObservable(this);
        this.agentStore = _agentStore;
        this.assetStore = _assetStore;
        this.operationStore = _operationStore;
    }
    agentStore: AgentStore;
    assetStore: AssetStore;
    operationStore: OperationStore;

    assetItemCounts: AssetApi.GetItemCounts.Response | null = null;
    operationItemCounts: OperationApi.GetItemCounts.Response | null = null;

    loadItemCounts = async () => {
        // assets
        await this.assetStore.loadItemCounts();

        // agents
        await this.agentStore.loadItemCounts();

        // operaitons
        await this.operationStore.loadItemCounts();
    }
}
