import { makeAutoObservable, runInAction } from "mobx";
import i18next from "i18next";
import { AgentApi } from "../api";
import { ConnectionStatus, PanelModes } from "../types";
import { StatusBarStore } from "./StatusBarStore";
import { agentId, assetId } from "../../app.json"

export class AgentStore {
    statusBarStore: StatusBarStore;

    constructor(statusBarStore: StatusBarStore) {
        this.statusBarStore = statusBarStore;
        makeAutoObservable(this);
    }

    allItems: AgentApi.ListAll.Response[] = [];
    selectedItem: AgentApi.GetById.Response | undefined = undefined;
    panelMode: PanelModes = PanelModes.Detail;
    listSearchValue: string = '';
    timer: any = undefined;
    pingErrorCount: number = 0;
    apiConnectionStatus: ConnectionStatus = ConnectionStatus.Unknown;

    // clearSelectedItems = () => {
    //     this.selectedItem = undefined;
    // }

    // setSelectedItem = (item: AgentApi.ListAll.Response | undefined) => {
    //     this.getById(item?.id || '');
    // }

    setPanelMode = (mode: PanelModes) => {
        this.panelMode = mode;
    }

    getMyDetails = async () => {
        try {
            const response = await AgentApi.GetById.call(agentId);
            runInAction(() => {
                this.selectedItem = response.data;
                this.apiConnectionStatus = ConnectionStatus.Connected;
            });
        } catch (error) {
            runInAction(() => {
                this.apiConnectionStatus = ConnectionStatus.Disconnected;
            });
            this.statusBarStore.showError(i18next.t('agent.errors.loadItemFailed'));
        }
    }

    initialize = async () => {
        await this.getMyDetails();

        // setup ping flow
        if (this.timer !== undefined) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(this.pingAgent, 10000);
    }

    pingAgent = async () => {
        try {
            const request: AgentApi.Ping.Request = {
                id: agentId,
                sentAt: new Date().toISOString()
            };
            const response = await AgentApi.Ping.call(request);
            runInAction(() => {
                this.selectedItem = response.data;
                this.pingErrorCount = 0;
                this.apiConnectionStatus = ConnectionStatus.Connected;
            });
            // this.statusBarStore.showSuccess(i18next.t('agent.errors.pingSucceeded'));
        } catch (error) {
            runInAction(() => {
                this.pingErrorCount += 1;
                if (this.pingErrorCount >= 3) {
                    this.apiConnectionStatus = ConnectionStatus.Disconnected;
                }
            });
            if (this.pingErrorCount >= 3) {
                this.statusBarStore.showError(i18next.t('agent.errors.pingFailed'));
            }
        }
    }
}
