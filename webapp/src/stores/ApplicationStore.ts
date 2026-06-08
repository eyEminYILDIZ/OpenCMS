import { makeAutoObservable, runInAction } from "mobx";
import { AgentStore } from "./AgentStore";
import { AssetStore } from "./AssetStore";
import { OperationStore } from "./OperationStore";
import { MenuTypes } from "../types/MenuTypes";

export class ApplicationStore {
    constructor(_agentStore: AgentStore, _assetStore: AssetStore, _operationStore: OperationStore) {
        this.agentStore = _agentStore;
        this.assetStore = _assetStore;
        this.operationStore = _operationStore;
        this.currentMenu = MenuTypes.Assets;
        // use this bottom of constructor, otherwise MobX cant detect observables.
        makeAutoObservable(this);
    }
    agentStore: AgentStore;
    assetStore: AssetStore;
    operationStore: OperationStore;
    currentMenu: MenuTypes;

    changeMenu = (menu: MenuTypes) => {
        this.currentMenu = menu;
        console.log(menu);
        console.log(this.currentMenu);
    }

    loadItemCounts = async () => {
        // assets
        await this.assetStore.loadItemCounts();

        // agents
        await this.agentStore.loadItemCounts();

        // operaitons
        await this.operationStore.loadItemCounts();
    }
}
