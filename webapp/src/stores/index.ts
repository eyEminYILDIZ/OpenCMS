import { AgentStore } from "./AgentStore";
import { ApplicationStore } from "./ApplicationStore";

const agentStore = new AgentStore();
const applicationStore = new ApplicationStore(agentStore);

export const stores = {
    agentStore,
    applicationStore,
}