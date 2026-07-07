import { makeAutoObservable, runInAction } from "mobx";
import { AgentStore } from "./AgentStore";
import { AssetStore } from "./AssetStore";
import { DispatchStore } from "./DispatchStore";
import { OperationStore } from "./OperationStore";
import { StatusBarStore } from "./StatusBarStore";
import { MenuTypes } from "../types/MenuTypes";
import { clientSocketService } from "../services/ClientSocketService";
import { ConnectionStatus } from "../types";

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
    }

    private connectSocket = async () => {
        clientSocketService.onAssetReceived(this.assetStore.onAssetReceived);
        clientSocketService.onAssetReceived(this.operationStore.onAssetReceived);
        clientSocketService.onDispatchReceived(this.dispatchStore.onDispatchReceived);
        clientSocketService.onDispatchReceived(this.operationStore.onDispatchReceived);
        await clientSocketService.start();
        runInAction(() => {
            this.socketConnectionStatus = clientSocketService.getConnectionState();
        });
    }

    statusBarStore: StatusBarStore;
    agentStore: AgentStore;
    assetStore: AssetStore;
    operationStore: OperationStore;
    dispatchStore: DispatchStore;
    currentMenu: MenuTypes;
    socketConnectionStatus: ConnectionStatus = ConnectionStatus.Disconnected;

    changeMenu = (menu: MenuTypes) => {
        this.currentMenu = menu;
    }

    initialize = async () => {

        this.connectSocket();

        await this.agentStore.initialize();
        await this.assetStore.initialize();
        await this.operationStore.initialize();
        await this.dispatchStore.initialize();
    }
}
