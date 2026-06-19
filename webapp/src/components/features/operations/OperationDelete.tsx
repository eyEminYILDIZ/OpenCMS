import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { stores } from "../../../stores";
import { PanelModes } from "../../../types";
import Button from "../../ui/Button";
import ButtonStack from "../../ui/ButtonStack";
import { CircleX, Trash2 } from "lucide-react";

export const OperationDelete: React.FC = observer(() => {
    const { operationStore } = stores;
    const { t } = useTranslation();
    const item = operationStore.selectedItem;

    if (item == undefined)
        return (<p className="right-panel-empty">{t('operation.noItemSelected')}</p>);

    const rows: { label: string; value: string }[] = [
        { label: t('operation.fields.id'), value: item.id },
        { label: t('operation.fields.name'), value: item.name },
    ];

    return (
        <>
            <h4>Operation Delete ?</h4>
            <table style={{ fontSize: '0.8rem', borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                    {rows.map(({ label, value }) => (
                        <tr key={label}>
                            <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}><strong>{label}</strong></td>
                            <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <h5>Are you sure to delete this operation ?</h5>
            <ButtonStack>
                <Button variant="destructive" onClick={() => { operationStore.deleteItem(); }}>
                    <Trash2 size={16} />
                    {t('common.delete')}
                </Button>
                <Button variant="outline" onClick={() => { operationStore.setPanelMode(PanelModes.Detail); }}>
                    <CircleX size={16} />
                    {t('common.cancel')}
                </Button>
            </ButtonStack>
        </>
    );
})
