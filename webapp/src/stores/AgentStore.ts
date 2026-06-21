import { makeAutoObservable, runInAction } from "mobx";
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
    listSearchValue: string = '';

    setSelectedItem = (item: AgentApi.ListAll.Response | undefined) => {
        this.selectedItem = item;
    }

    setPanelMode = (mode: PanelModes) => {
        this.panelMode = mode;
    }

    setSearchValue(searchValue: string) {
        this.listSearchValue = searchValue;
        this.getAllItems();
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
            const response = await AgentApi.ListAll.call(this.listSearchValue);
            runInAction(() => {
                this.allItems = response.data;
            });
        } catch (error) {
            this.statusBarStore.showError(i18next.t('agent.errors.loadItemsFailed'));
        }
    }

    onCreateItem() {
        this.setPanelMode(PanelModes.Create);
        this.setSelectedItem(undefined);
    }

    createItem = async (values: AgentApi.Create.Request) => {
        try {
            const response = await AgentApi.Create.call(values);
            await this.getAllItems();
            runInAction(() => {
                this.selectedItem = this.allItems.find((a) => a.id === response.data.id);
                this.panelMode = PanelModes.Detail;
            });
            await this.loadItemCounts();
            this.statusBarStore.showSuccess(i18next.t('agent.errors.createSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('agent.errors.createFailed'));
        }
    }

    updateItem = async (values: Omit<AgentApi.Update.Request, 'id'>) => {
        if (!this.selectedItem) {
            this.statusBarStore.showError(i18next.t('agent.errors.noItemSelected'));
            return;
        }

        try {
            const id = this.selectedItem.id;
            const request: AgentApi.Update.Request = { id, ...values };
            await AgentApi.Update.call(request);
            await this.getAllItems();
            runInAction(() => {
                this.selectedItem = this.allItems.find((a) => a.id === id);
            });
            this.statusBarStore.showSuccess(i18next.t('agent.errors.updateSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('agent.errors.updateFailed'));
        }
    }

    deleteItem = async () => {
        if (!this.selectedItem) {
            this.statusBarStore.showError(i18next.t('agent.errors.noItemSelected'));
            return;
        }

        try {
            const request = { id: this.selectedItem.id };
            await AgentApi.Delete.call(request);

            this.setSelectedItem(undefined);
            this.setPanelMode(PanelModes.Detail);
            await this.getAllItems();
            await this.loadItemCounts();
            this.statusBarStore.showSuccess(i18next.t('agent.errors.deleteSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('agent.errors.deleteFailed'));
        }
    }
}
