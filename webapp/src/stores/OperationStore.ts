import { makeAutoObservable, runInAction } from "mobx";
import i18next from "i18next";
import { OperationApi } from "../api";
import { PanelModes } from "../types";
import { StatusBarStore } from "./StatusBarStore";

export enum OperationTabs {
    Details = 'details',
    Assets = 'assets',
    Orders = 'orders',
}

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
    listSearchValue: string = '';
    selectedTab: OperationTabs = OperationTabs.Details;

    setSelectedTab = (tab: OperationTabs) => {
        this.selectedTab = tab;
    }

    setSelectedItem = (item: OperationApi.ListAll.Response | undefined) => {
        this.selectedItem = item;
    }

    setPanelMode = (mode: PanelModes) => {
        this.panelMode = mode;
    }

    setSearchValue(searchValue: string) {
        this.listSearchValue = searchValue;
        this.getAllItems();
    }

    onBackToList() {
        this.setSelectedItem(undefined);
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
            const response = await OperationApi.ListAll.call(this.listSearchValue);
            runInAction(() => {
                this.allItems = response.data;
            });
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.loadItemsFailed'));
        }
    }

    onCreateItem() {
        this.setPanelMode(PanelModes.Create);
        this.setSelectedItem(undefined);
    }

    createItem = async (values: OperationApi.Create.Request) => {
        try {
            const response = await OperationApi.Create.call(values);
            await this.getAllItems();
            runInAction(() => {
                this.selectedItem = this.allItems.find((o) => o.id === response.data.id);
                this.panelMode = PanelModes.Detail;
            });
            await this.loadItemCounts();
            this.statusBarStore.showSuccess(i18next.t('operation.errors.createSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.createFailed'));
        }
    }

    updateItem = async (values: Omit<OperationApi.Update.Request, 'id'>) => {
        if (!this.selectedItem) {
            this.statusBarStore.showError(i18next.t('operation.errors.noItemSelected'));
            return;
        }

        try {
            const id = this.selectedItem.id;
            const request: OperationApi.Update.Request = { id, ...values };
            await OperationApi.Update.call(request);
            await this.getAllItems();
            runInAction(() => {
                this.selectedItem = this.allItems.find((o) => o.id === id);
            });
            this.statusBarStore.showSuccess(i18next.t('operation.errors.updateSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.updateFailed'));
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
            await this.loadItemCounts();
            this.statusBarStore.showSuccess(i18next.t('operation.errors.deleteSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('operation.errors.deleteFailed'));
        }
    }
}
