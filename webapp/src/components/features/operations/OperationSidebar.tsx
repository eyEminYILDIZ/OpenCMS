import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { stores } from "../../../stores";
import { OperationList } from "./OperationList";

export const OperationSidebar: React.FC = observer(() => {
    const { applicationStore, operationStore } = stores;
    const { t } = useTranslation();

    useEffect(() => {
        operationStore.getAllItems();
    }, [applicationStore.currentMenu]);

    return (
        <OperationList />
    );
});
