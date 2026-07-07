import { makeAutoObservable, runInAction } from "mobx";
import i18next from "i18next";
import { DispatchApi } from "../api";
import { PanelModes } from "../types";
import { StatusBarStore } from "./StatusBarStore";
import { OperationStore } from "./OperationStore";
import { GuidService } from "../services";

export class DispatchStore {

    statusBarStore: StatusBarStore;

    constructor(statusBarStore: StatusBarStore, operationStore: OperationStore) {
        this.statusBarStore = statusBarStore;
        this.operationStore = operationStore;
        makeAutoObservable(this);
    }

    operationStore: OperationStore;
    allItems: DispatchApi.ListAll.Response[] = [];
    filteredItems: DispatchApi.ListAll.Response[] = [];
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

    onDispatchReceived = (dispatch: DispatchApi.ListAll.Response) => {

        console.log("\n\n\nRECEIVED: ", dispatch);

        runInAction(() => {
            const index = this.allItems.findIndex(a => a.id === dispatch.id);

            switch (dispatch.lastActionType) {
                case DispatchApi.Enums.ActionTypes.Create:
                    console.log("Create");

                    if (index === -1) {
                        console.log("Create index: ", index);
                        this.allItems = [...this.allItems, dispatch];
                    }
                    break;
                case DispatchApi.Enums.ActionTypes.Update:
                    console.log("Update");

                    if (index !== -1) {
                        console.log("Update index: ", index);
                        this.allItems = this.allItems.map((item, i) => (i === index ? dispatch : item));
                    }
                    break;
                case DispatchApi.Enums.ActionTypes.Delete:
                    console.log("Delete");
                    if (index !== -1) {
                        console.log("Delete index: ", index);
                        this.allItems = this.allItems.filter((_, i) => i !== index);
                    }
                    break;
                case DispatchApi.Enums.ActionTypes.ListAll:
                case DispatchApi.Enums.ActionTypes.Detail:
                    break;
            }
        });
    }

    getAllItems = async () => {


        try {
            console.log("\n\nCALLED dispatch getAllItems\n\n");
            console.log(this.operationStore.selectedItem?.id);


            const relatedEntityId = this.operationStore.selectedItem?.id || GuidService.generateEmptyGuid();
            const request: DispatchApi.ListAll.Request = { searchValue: this.listSearchValue, relatedEntityId };
            const response = await DispatchApi.ListAll.call(request);
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
            await DispatchApi.Create.call(values);
            await this.getAllItems();
            runInAction(() => {
                this.clearSelectedItems();
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
            await DispatchApi.Update.call(request);
            await this.getAllItems();
            runInAction(() => {
                this.clearSelectedItems();
                this.panelMode = PanelModes.Detail;
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
