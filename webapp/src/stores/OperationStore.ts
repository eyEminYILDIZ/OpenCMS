import { makeAutoObservable, runInAction, toJS } from "mobx";
import { OperationApi } from "../api";

export class OperationStore {
    constructor() {
        makeAutoObservable(this);
    }

    operationItemCounts: OperationApi.GetItemCounts.Response | null = null;

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
}
