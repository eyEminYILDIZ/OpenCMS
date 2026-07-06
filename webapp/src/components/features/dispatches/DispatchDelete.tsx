import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { stores } from "../../../stores";
import { PanelModes } from "../../../types";
import Button from "../../ui/Button";
import ButtonStack from "../../ui/ButtonStack";
import { CircleX, Trash2 } from "lucide-react";

export const DispatchDelete: React.FC = observer(() => {
    const { dispatchStore } = stores;
    const { t } = useTranslation();
    const item = dispatchStore.selectedItem;

    if (item == undefined)
        return (<p className="right-panel-empty">{t('dispatch.noItemSelected')}</p>);

    return (
        <>
            <h4>{t('dispatch.delete.title')}</h4>
            <p>{t('dispatch.delete.confirmMessage', { title: item.title })}</p>
            <ButtonStack>
                <Button variant="destructive" onClick={() => { dispatchStore.deleteItem(); }}>
                    <Trash2 size={16} />
                    {t('common.delete')}
                </Button>
                <Button variant="outline" onClick={() => { dispatchStore.setPanelMode(PanelModes.Detail); }}>
                    <CircleX size={16} />
                    {t('common.cancel')}
                </Button>
            </ButtonStack>
        </>
    );
})
