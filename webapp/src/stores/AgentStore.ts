import { makeAutoObservable, runInAction, toJS } from "mobx";
import { AgentApi } from "../api";

export class AgentStore {
    constructor() {
        makeAutoObservable(this);
    }

    agentItemCounts: AgentApi.GetItemCounts.Response | null = null;
    allItems: AgentApi.ListAll.Response[] = [];
    selectedItem: AgentApi.ListAll.Response | undefined = undefined;

    loadItemCounts = async () => {
        try {
            const response = await AgentApi.GetItemCounts.call();
            runInAction(() => {
                this.agentItemCounts = response.data;
            });
        } catch (error) {
            console.error("Error agents/loading agent item counts:", error);
        }
    }

    setSelectedItem = (item: AgentApi.ListAll.Response | undefined) => {
        this.selectedItem = item;
    }

    getAllItems = async () => {
        try {
            const response = await AgentApi.ListAll.call();
            this.allItems = response.data;
        } catch (error) {
            console.error("Error agents/getAllItems method:", error);
        }
    }
}
