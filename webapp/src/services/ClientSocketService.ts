import * as signalR from '@microsoft/signalr';
import { AssetApi, DispatchApi } from '../api';

type AssetReceivedHandler = (asset: AssetApi.ListAll.Response) => void;
type DispatchReceivedHandler = (dispatch: DispatchApi.ListAll.Response) => void;

class ClientSocketService {
    private connection: signalR.HubConnection;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5020/hubs/clients', {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
            })
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

    onAssetReceived(handler: AssetReceivedHandler): void {
        this.connection.on('AssetReceived', handler);
    }

    offAssetReceived(handler: AssetReceivedHandler): void {
        this.connection.off('AssetReceived', handler);
    }

    onDispatchReceived(handler: DispatchReceivedHandler): void {
        this.connection.on('DispatchReceived', handler);
    }

    offDispatchReceived(handler: DispatchReceivedHandler): void {
        this.connection.off('DispatchReceived', handler);
    }
}

export const clientSocketService = new ClientSocketService();
