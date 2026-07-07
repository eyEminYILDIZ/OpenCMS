import * as signalR from '@microsoft/signalr';
import { reaction } from 'mobx';
import { AssetApi, DispatchApi } from '../api';
import { settingsStore } from '../stores/SettingsStore';
import { ConnectionStatus } from '../types';

type AssetReceivedHandler = (asset: AssetApi.ListAll.Response) => void;
type DispatchReceivedHandler = (dispatch: DispatchApi.ListAll.Response) => void;

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
    private assetReceivedHandlers: AssetReceivedHandler[] = [];
    private dispatchReceivedHandlers: DispatchReceivedHandler[] = [];

    constructor() {
        this.connection = this.buildConnection(settingsStore.serverAddress);

        reaction(
            () => settingsStore.serverAddress,
            this.handleServerAddressChanged,
        );
    }

    private buildConnection(serverAddress: string): signalR.HubConnection {
        console.log("Socket Server Address:", `http://${serverAddress}/hubs/agents`);

        return new signalR.HubConnectionBuilder()
            .withUrl(`http://${serverAddress}/hubs/agents`, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .build();
    }

    private handleServerAddressChanged = async (serverAddress: string): Promise<void> => {
        const wasConnected = this.connection.state !== signalR.HubConnectionState.Disconnected;
        await this.stop();

        this.connection = this.buildConnection(serverAddress);
        this.assetReceivedHandlers.forEach((handler) => this.connection.on('AssetReceived', handler));
        this.dispatchReceivedHandlers.forEach((handler) => this.connection.on('DispatchReceived', handler));

        if (wasConnected) {
            await this.start();
        }
    }

    async start(): Promise<void> {
        console.log("Trying to connect websocket server");

        if (this.connection.state === signalR.HubConnectionState.Disconnected) {
            await this.connection.start();
            console.log("connected to server socket");
        }
    }

    async stop(): Promise<void> {
        await this.connection.stop();
    }

    onAssetReceived(handler: AssetReceivedHandler): void {
        this.assetReceivedHandlers.push(handler);
        this.connection.on('AssetReceived', handler);
    }

    offAssetReceived(handler: AssetReceivedHandler): void {
        this.assetReceivedHandlers = this.assetReceivedHandlers.filter((h) => h !== handler);
        this.connection.off('AssetReceived', handler);
    }

    onDispatchReceived(handler: DispatchReceivedHandler): void {
        this.dispatchReceivedHandlers.push(handler);
        this.connection.on('DispatchReceived', handler);
    }

    offDispatchReceived(handler: DispatchReceivedHandler): void {
        this.dispatchReceivedHandlers = this.dispatchReceivedHandlers.filter((h) => h !== handler);
        this.connection.off('DispatchReceived', handler);
    }
}

export const clientSocketService = new ClientSocketService();
