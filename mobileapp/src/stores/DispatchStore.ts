import { makeAutoObservable, runInAction } from "mobx";
import i18next from "i18next";
import { DispatchApi } from "../api";
import { PanelModes } from "../types";
import { StatusBarStore } from "./StatusBarStore";
import { OperationStore } from "./OperationStore";

export class DispatchStore {

    statusBarStore: StatusBarStore;

    constructor(statusBarStore: StatusBarStore, operationStore: OperationStore) {
        this.statusBarStore = statusBarStore;
        this.operationStore = operationStore;
        makeAutoObservable(this);
    }

    operationStore: OperationStore;
    allItems: DispatchApi.ListAll.Response[] = [];
    filteredItems: DispatchApi.ListFiltered.Response[] = [];
    selectedItem: DispatchApi.ListAll.Response | undefined = undefined;
    panelMode: PanelModes = PanelModes.Detail;
    listSearchValue: string = '';

    clearSelectedItems = () => {
        this.selectedItem = undefined;
    }

    clearFilteredItems = () => {
        this.filteredItems = [];
    }

    setSelectedItem = (item: DispatchApi.ListAll.Response | undefined) => {
        this.selectedItem = item;
    }

    setPanelMode = (mode: PanelModes) => {
        this.panelMode = mode;
    }

    setSearchValue(searchValue: string) {
        this.listSearchValue = searchValue;
        this.getAllItems();
    }

    initialize = async () => {
        await this.getAllItems();
    }

    getAllItems = async () => {
        if (this.operationStore.selectedItem == undefined) {
            runInAction(() => {
                this.allItems = [];
            });
            return;
        }

        try {
            const request: DispatchApi.ListFiltered.Request = { searchValue: this.listSearchValue, relatedEntityId: this.operationStore.selectedItem.id };
            const response = await DispatchApi.ListFiltered.call(request);
            runInAction(() => {
                this.allItems = response.data;
            });
        } catch (error) {
            this.statusBarStore.showError(i18next.t('dispatch.errors.loadItemsFailed'));
        }
    }

    onCreateItem() {
        this.setPanelMode(PanelModes.Create);
        this.clearSelectedItems();
    }

    createItem = async (values: DispatchApi.Create.Request) => {
        try {
            const response = await DispatchApi.Create.call(values);
            await this.getAllItems();
            runInAction(() => {
                this.selectedItem = response.data;
                this.panelMode = PanelModes.Detail;
            });
            this.statusBarStore.showSuccess(i18next.t('dispatch.errors.createSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('dispatch.errors.createFailed'));
        }
    }

    updateItem = async (values: Omit<DispatchApi.Update.Request, 'id'>) => {
        if (!this.selectedItem) {
            this.statusBarStore.showError(i18next.t('dispatch.errors.noItemSelected'));
            return;
        }

        try {
            const id = this.selectedItem.id;
            const request: DispatchApi.Update.Request = { id, ...values };
            const response = await DispatchApi.Update.call(request);
            await this.getAllItems();
            runInAction(() => {
                this.selectedItem = response.data;
            });
            this.statusBarStore.showSuccess(i18next.t('dispatch.errors.updateSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('dispatch.errors.updateFailed'));
        }
    }

    deleteItem = async () => {
        if (!this.selectedItem) {
            this.statusBarStore.showError(i18next.t('dispatch.errors.noItemSelected'));
            return;
        }

        try {
            const request = { id: this.selectedItem.id };
            await DispatchApi.Delete.call(request);

            // after success
            this.clearSelectedItems();
            this.setPanelMode(PanelModes.Detail);
            await this.getAllItems();
            this.statusBarStore.showSuccess(i18next.t('dispatch.errors.deleteSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('dispatch.errors.deleteFailed'));
        }
    }
}
