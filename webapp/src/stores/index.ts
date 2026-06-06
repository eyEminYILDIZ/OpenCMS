import { AgentStore } from "./AgentStore";
import { ApplicationStore } from "./ApplicationStore";
import { AssetStore } from "./AssetStore";

const agentStore = new AgentStore();
const assetStore = new AssetStore();
const applicationStore = new ApplicationStore(agentStore, assetStore, {} as any);

export const stores = {
    agentStore,
    assetStore,
    applicationStore,
}