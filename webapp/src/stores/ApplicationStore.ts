import { makeAutoObservable, runInAction } from "mobx";
import { AgentStore } from "./AgentStore";
import { AssetStore } from "./AssetStore";
import { DispatchStore } from "./DispatchStore";
import { OperationStore } from "./OperationStore";
import { StatusBarStore } from "./StatusBarStore";
import { MenuTypes } from "../types/MenuTypes";
import { clientSocketService } from "../services/ClientSocketService";

export class ApplicationStore {
    constructor(
        _statusBarStore: StatusBarStore,
        _agentStore: AgentStore,
        _assetStore: AssetStore,
        _operationStore: OperationStore,
        _dispatchStore: DispatchStore,
    ) {
        this.statusBarStore = _statusBarStore;
        this.agentStore = _agentStore;
        this.assetStore = _assetStore;
        this.operationStore = _operationStore;
        this.dispatchStore = _dispatchStore;
        this.currentMenu = MenuTypes.Assets;
        // use this bottom of constructor, otherwise MobX cant detect observables.
        makeAutoObservable(this);
        this.connectSocket();
    }

    private connectSocket = async () => {
        clientSocketService.onAssetReceived(this.assetStore.onAssetReceived);
        clientSocketService.onAssetReceived(this.operationStore.onAssetReceived);
        clientSocketService.onDispatchReceived(this.dispatchStore.onDispatchReceived);
        clientSocketService.onDispatchReceived(this.operationStore.onDispatchReceived);
        await clientSocketService.start();
    }
    statusBarStore: StatusBarStore;
    agentStore: AgentStore;
    assetStore: AssetStore;
    operationStore: OperationStore;
    dispatchStore: DispatchStore;
    currentMenu: MenuTypes;

    changeMenu = (menu: MenuTypes) => {
        this.currentMenu = menu;
    }

    loadItemCounts = async () => {
        // assets
        await this.assetStore.loadItemCounts();

        // agents
        await this.agentStore.loadItemCounts();

        // operaitons
        await this.operationStore.loadItemCounts();

        // dispatches
        await this.dispatchStore.loadItemCounts();
    }
}
