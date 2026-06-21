import { observer } from "mobx-react-lite";
import { AgentList } from "./AgentList";

export const AgentSidebar: React.FC = observer(() => {

    return (
        <AgentList />
    );
});