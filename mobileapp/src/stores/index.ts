import { AgentStore } from "./AgentStore";
import { ApplicationStore } from "./ApplicationStore";
import { AssetStore } from "./AssetStore";
import { MapSettingsStore } from "./MapSettingsStore";
import { OperationStore } from "./OperationStore";
import { StatusBarStore } from "./StatusBarStore";

const statusBarStore = new StatusBarStore();
const agentStore = new AgentStore(statusBarStore);
const assetStore = new AssetStore(statusBarStore);
const operationStore = new OperationStore(statusBarStore);
const applicationStore = new ApplicationStore(statusBarStore, agentStore, assetStore, operationStore);
const mapSettingsStore = new MapSettingsStore();

export const stores = {
    statusBarStore,
    agentStore,
    assetStore,
    operationStore,
    applicationStore,
    mapSettingsStore,
}
