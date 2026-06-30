import * as signalR from '@microsoft/signalr';
import { reaction } from 'mobx';
import { AssetApi } from '../api';
import { settingsStore } from '../stores/SettingsStore';
import { ConnectionStatus } from '../types';

type AssetUpdatedHandler = (asset: AssetApi.ListAll.Response) => void;

class ClientSocketService {
    getConnectionState = (): ConnectionStatus => {
        switch (this.connection.state) {
            case signalR.HubConnectionState.Connected:
                return ConnectionStatus.Connected;
            case signalR.HubConnectionState.Connecting:
                return ConnectionStatus.Unknown;
            case signalR.HubConnectionState.Disconnected:
                return ConnectionStatus.Disconnected;
            case signalR.HubConnectionState.Disconnecting:
                return ConnectionStatus.Disconnected;
            default:
                return ConnectionStatus.Unknown;
        }
    }

    private connection: signalR.HubConnection;
    private assetUpdatedHandlers: AssetUpdatedHandler[] = [];

    constructor() {
        this.connection = this.buildConnection(settingsStore.serverAddress);

        reaction(
            () => settingsStore.serverAddress,
            this.handleServerAddressChanged,
        );
    }

    private buildConnection(serverAddress: string): signalR.HubConnection {
        return new signalR.HubConnectionBuilder()
            .withUrl(`http://${serverAddress}/hubs/clients`)
            .withAutomaticReconnect()
            .build();
    }

    private handleServerAddressChanged = async (serverAddress: string): Promise<void> => {
        const wasConnected = this.connection.state !== signalR.HubConnectionState.Disconnected;
        await this.stop();

        this.connection = this.buildConnection(serverAddress);
        this.assetUpdatedHandlers.forEach((handler) => this.connection.on('UpdateAsset', handler));

        if (wasConnected) {
            await this.start();
        }
    }

    async start(): Promise<void> {
        if (this.connection.state === signalR.HubConnectionState.Disconnected) {
            await this.connection.start();
        }
    }

    async stop(): Promise<void> {
        await this.connection.stop();
    }

    onAssetUpdated(handler: AssetUpdatedHandler): void {
        this.assetUpdatedHandlers.push(handler);
        this.connection.on('UpdateAsset', handler);
    }

    offAssetUpdated(handler: AssetUpdatedHandler): void {
        this.assetUpdatedHandlers = this.assetUpdatedHandlers.filter((h) => h !== handler);
        this.connection.off('UpdateAsset', handler);
    }
}

export const clientSocketService = new ClientSocketService();
