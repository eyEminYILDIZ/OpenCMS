import { makeAutoObservable, runInAction } from "mobx";
import i18next from "i18next";
import { DispatchApi } from "../api";
import { PanelModes } from "../types";
import { StatusBarStore } from "./StatusBarStore";
import { GuidService } from "../services";

export class DispatchStore {
    statusBarStore: StatusBarStore;

    constructor(statusBarStore: StatusBarStore) {
        this.statusBarStore = statusBarStore;
        makeAutoObservable(this);
    }

    dispatchItemCounts: DispatchApi.GetItemCounts.Response | null = null;
    allItems: DispatchApi.ListAll.Response[] = [];
    selectedItem: DispatchApi.ListAll.Response | undefined = undefined;
    panelMode: PanelModes = PanelModes.Detail;
    listSearchValue: string = '';

    clearSelectedItems = () => {
        this.selectedItem = undefined;
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

    loadItemCounts = async () => {
        try {
            const response = await DispatchApi.GetItemCounts.call();
            runInAction(() => {
                this.dispatchItemCounts = response.data;
            });
        } catch (error) {
            this.statusBarStore.showError(i18next.t('dispatch.errors.loadCountFailed'));
        }
    }

    onDispatchReceived = (dispatch: DispatchApi.ListAll.Response) => {
        console.log("\n\n\nRECEIVED: ", dispatch);


        runInAction(() => {
            const index = this.allItems.findIndex(a => a.id === dispatch.id);

            switch (dispatch.lastActionType) {
                case DispatchApi.Enums.ActionTypes.Create:
                    if (index === -1) {
                        this.allItems = [...this.allItems, dispatch];
                    }
                    break;
                case DispatchApi.Enums.ActionTypes.Update:
                    if (index !== -1) {
                        this.allItems = this.allItems.map((item, i) => (i === index ? dispatch : item));
                    }
                    break;
                case DispatchApi.Enums.ActionTypes.Delete:
                    if (index !== -1) {
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
        console.log("\n\nCALLED dispatch getAllItems\n\n");

        try {
            const request: DispatchApi.ListAll.Request = {
                searchValue: this.listSearchValue,
                relatedEntityId: GuidService.generateEmptyGuid(),
            };
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
            await this.loadItemCounts();
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

            this.clearSelectedItems();
            this.setPanelMode(PanelModes.Detail);
            await this.getAllItems();
            await this.loadItemCounts();
            this.statusBarStore.showSuccess(i18next.t('dispatch.errors.deleteSucceeded'));
        } catch (error) {
            this.statusBarStore.showError(i18next.t('dispatch.errors.deleteFailed'));
        }
    }
}
