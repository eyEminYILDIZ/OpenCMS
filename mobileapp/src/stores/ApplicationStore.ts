import { makeAutoObservable, runInAction } from "mobx";
import { AgentStore } from "./AgentStore";
import { AssetStore } from "./AssetStore";
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
    ) {
        this.statusBarStore = _statusBarStore;
        this.agentStore = _agentStore;
        this.assetStore = _assetStore;
        this.operationStore = _operationStore;
        this.currentMenu = MenuTypes.Assets;
        // use this bottom of constructor, otherwise MobX cant detect observables.
        makeAutoObservable(this);
    }

    private connectSocket = async () => {
        clientSocketService.onAssetUpdated(this.assetStore.onAssetUpdated);
        clientSocketService.onAssetUpdated(this.operationStore.onAssetUpdated);
        await clientSocketService.start();
        runInAction(() => {
            this.socketConnectionStatus = clientSocketService.getConnectionState();
        });
    }

    statusBarStore: StatusBarStore;
    agentStore: AgentStore;
    assetStore: AssetStore;
    operationStore: OperationStore;
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
    }
}
