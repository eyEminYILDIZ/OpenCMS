import { AgentStore } from "./AgentStore";
import { ApplicationStore } from "./ApplicationStore";
import { AssetStore } from "./AssetStore";
import { OperationStore } from "./OperationStore";

const agentStore = new AgentStore();
const assetStore = new AssetStore();
const operationStore = new OperationStore();
const applicationStore = new ApplicationStore(agentStore, assetStore, operationStore);

export const stores = {
    agentStore,
    assetStore,
    operationStore,
    applicationStore,
}