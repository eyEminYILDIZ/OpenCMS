import { makeAutoObservable, runInAction, toJS } from "mobx";
import { AgentApi } from "../api";
import { PanelModes } from "../types";

export class AgentStore {
    constructor() {
        makeAutoObservable(this);
    }

    agentItemCounts: AgentApi.GetItemCounts.Response | null = null;
    allItems: AgentApi.ListAll.Response[] = [];
    selectedItem: AgentApi.ListAll.Response | undefined = undefined;
    panelMode: PanelModes = PanelModes.Detail;

    setSelectedItem = (item: AgentApi.ListAll.Response | undefined) => {
        this.selectedItem = item;
    }

    setPanelMode = (mode: PanelModes) => {
        this.panelMode = mode;
    }

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

    getAllItems = async () => {
        try {
            const response = await AgentApi.ListAll.call();
            this.allItems = response.data;
        } catch (error) {
            console.error("Error agents/getAllItems method:", error);
        }
    }
}
