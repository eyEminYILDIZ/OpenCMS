import * as signalR from '@microsoft/signalr';
import { Platform } from 'react-native';
import { AssetApi } from '../api';

const HUB_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const PORT = 5010; // Replace with your actual port number

type AssetUpdatedHandler = (asset: AssetApi.ListAll.Response) => void;

class ClientSocketService {
    private connection: signalR.HubConnection;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`http://${HUB_HOST}:${PORT}/hubs/clients`)
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
