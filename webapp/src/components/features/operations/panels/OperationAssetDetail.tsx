import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { RightPanelWrapper } from "../../../layout/right-panel/RightPanelWrapper";
import { stores } from "../../../../stores";
import DetailCard from "../../../ui/DetailCard";
import DetailRow from "../../../ui/DetailRow";

export const OperationAssetDetail: React.FC = observer(() => {
    const { operationStore } = stores;
    const { t } = useTranslation();
    const item = operationStore.selectedAsset;

    if (item == undefined)
        return (<p className="right-panel-empty">{t('operation.errors.noItemSelected')}</p>);

    const rows: { label: string; value: string }[] = [
        { label: t('operation.assetFields.id'), value: item.id },
        { label: t('operation.assetFields.assetId'), value: item.assetId },
        { label: t('operation.assetFields.name'), value: item.asset.name },
    ];

    return (
        <RightPanelWrapper>
            <h4>{t('operation.assetFields.asset')}</h4>
            <DetailCard>
                {rows.map(({ label, value }) => (
                    <DetailRow key={label} label={label} value={value} />
                ))}
            </DetailCard>
        </RightPanelWrapper>
    );
});
