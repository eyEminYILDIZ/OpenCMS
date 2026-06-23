import * as signalR from '@microsoft/signalr';
import { AssetApi } from '../api';

type AssetUpdatedHandler = (asset: AssetApi.ListAll.Response) => void;

class ClientSocketService {
    private connection: signalR.HubConnection;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5020/hubs/clients')
            .withAutomaticReconnect()
            .build();
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
        this.connection.on('UpdateAsset', handler);
    }

    offAssetUpdated(handler: AssetUpdatedHandler): void {
        this.connection.off('UpdateAsset', handler);
    }
}

export const clientSocketService = new ClientSocketService();
