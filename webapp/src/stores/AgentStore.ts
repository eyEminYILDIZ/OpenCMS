import { makeAutoObservable, runInAction, toJS } from "mobx";
import i18next from "i18next";
import { AgentApi } from "../api";
import { PanelModes } from "../types";
import { StatusBarStore } from "./StatusBarStore";

export class AgentStore {
    statusBarStore: StatusBarStore;

    constructor(statusBarStore: StatusBarStore) {
        this.statusBarStore = statusBarStore;
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
            this.statusBarStore.showError(i18next.t('agent.errors.loadCountFailed'));
        }
    }

    getAllItems = async () => {
        try {
            const response = await AgentApi.ListAll.call();
            this.allItems = response.data;
        } catch (error) {
            this.statusBarStore.showError(i18next.t('agent.errors.loadItemsFailed'));
        }
    }
}
