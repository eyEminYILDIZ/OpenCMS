import { observer } from "mobx-react-lite";
import { DispatchList } from "./DispatchList";

export const DispatchSidebar: React.FC = observer(() => {

    return (
        <DispatchList />
    );
});
