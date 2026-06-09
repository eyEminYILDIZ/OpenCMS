import { makeAutoObservable, runInAction, toJS } from "mobx";
import { AssetApi, OperationApi } from "../api";
import { PanelModes } from "../types";

export class OperationStore {
    constructor() {
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
            console.error("Error loading operation item counts:", error);
        }
    }

    getAllItems = async () => {
        try {
            const response = await OperationApi.ListAll.call();
            this.allItems = response.data;
        } catch (error) {
            console.error("Error assets/getAllItems method:", error);
        }
    }
}
