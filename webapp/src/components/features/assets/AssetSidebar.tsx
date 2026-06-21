import { observer } from "mobx-react-lite";
import { AssetList } from "./AssetList";

export const AssetSidebar: React.FC = observer(() => {

    return (
        <AssetList />
    );
});