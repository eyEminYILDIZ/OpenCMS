import { makeAutoObservable, runInAction, toJS } from "mobx";
import i18next from "i18next";
import { AssetApi, OperationApi } from "../api";
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
}
