import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { stores } from "../../../../stores";
import { OperationApi } from "../../../../api";
import { PanelModes } from "../../../../types";
import Input from "../../../ui/Input";
import DatePicker from "../../../ui/DatePicker";
import Form, { FormMode } from "../../../ui/Form";
import FormItem from "../../../ui/FormItem";
import Button from "../../../ui/Button";
import ButtonStack from "../../../ui/ButtonStack";
import { CircleX, Save } from "lucide-react";
import DropdownRemote from "../../../ui/DropdownRemote";
import { AssetApi } from "../../../../api";

type FormValues = Omit<OperationApi.OperationAssets.Create.Request, never>;

export const OperationAssetCreate: React.FC = observer(() => {
    const { operationStore } = stores;
    const { t } = useTranslation();

    const validationSchema: Yup.ObjectSchema<FormValues> = Yup.object({
        operationId: Yup.string().required(t('common.validation.required')),
        assetId: Yup.string().required(t('common.validation.required')),
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            operationId: operationStore.selectedItem?.id ?? '',
            assetId: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            await operationStore.createAsset(values);
        },
    });

    return (
        <Form formik={formik} mode={FormMode.Create}>
            <h4>{t('operation.createAsset.title')}</h4>

            <FormItem<FormValues> name="assetId" label={t('operation.assetFields.assetId')}>
                <DropdownRemote<FormValues>
                    name="assetId"
                    endpoint={AssetApi.Pick.path}
                />
            </FormItem>

            <ButtonStack>
                <Button type="submit" disabled={formik.isSubmitting}>
                    <Save size={16} />
                    {formik.isSubmitting ? t('common.saving') : t('common.save')}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => operationStore.setPanelMode(PanelModes.Detail)}
                >
                    <CircleX size={16} />
                    {t('common.cancel')}
                </Button>
            </ButtonStack>
        </Form>
    );
});
