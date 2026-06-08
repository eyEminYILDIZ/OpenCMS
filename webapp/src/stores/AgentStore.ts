import { makeAutoObservable, runInAction, toJS } from "mobx";
import { AgentApi } from "../api";

export class AgentStore {
    constructor() {
        makeAutoObservable(this);
    }

    agentItemCounts: AgentApi.GetItemCounts.Response | null = null;

    loadItemCounts = async () => {
        try {
            const response = await AgentApi.GetItemCounts.call();
            runInAction(() => {
                this.agentItemCounts = response.data;
            });
        } catch (error) {
            console.error("Error loading agent item counts:", error);
        }
    }
}
