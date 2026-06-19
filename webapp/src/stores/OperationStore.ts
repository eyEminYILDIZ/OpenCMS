import { makeAutoObservable, runInAction, toJS } from "mobx";
import i18next from "i18next";
import { OperationApi } from "../api";
import { PanelModes } from "../types";
import { StatusBarStore } from "./StatusBarStore";

export class OperationStore {
    statusBarStore: StatusBarStore;

    constructor(statusBarStore: StatusBarStore) {
        this.statusBarStore = statusBarStore;
        makeAutoObservable(this);
    }

    operationItemCounts: OperationApi.GetItemCounts.Response | null = null;
    allItems: OperationApi.ListAll.Response[] = [];
    selectedItem: OperationApi.ListAll.Response | undefined = undefined;
    panelMode: PanelModes = PanelModes.Detail;

    setSelectedItem = (item: OperationApi.ListAll.Response | undefined) => {
        this.selectedItem = item;
    }
    setPanelMode = (mode: PanelModes) => {
        this.panelMode = mode;
    }

    loadItemCounts = async () => {
        try {
            const response = await OperationApi.GetItemCounts.call();
            runInAction(() => {
                this.operationItemCounts = response.data;
            });
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.loadCountFailed'));
        }
    }

    getAllItems = async () => {
        try {
            const response = await OperationApi.ListAll.call();
            this.allItems = response.data;
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.loadItemsFailed'));
        }
    }

    deleteItem = async () => {
        if (!this.selectedItem) {
            this.statusBarStore.showError(i18next.t('operation.errors.noItemSelected'));
            return;
        }

        try {
            const request = { id: this.selectedItem.id };
            await OperationApi.Delete.call(request);

            this.setSelectedItem(undefined);
            this.setPanelMode(PanelModes.Detail);
            await this.getAllItems();
            this.statusBarStore.showInfo(i18next.t('operation.errors.deleteSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.deleteFailed'));
        }
    }
}
