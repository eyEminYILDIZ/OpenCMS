import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { stores } from "../../../../stores";
import { DispatchApi } from "../../../../api";
import { PanelModes } from "../../../../types";
import Input from "../../../ui/Input";
import DatePicker from "../../../ui/DatePicker";
import Form, { FormMode } from "../../../ui/Form";
import FormItem from "../../../ui/FormItem";
import Button from "../../../ui/Button";
import ButtonStack from "../../../ui/ButtonStack";
import { CircleX, Save } from "lucide-react";

type FormValues = Omit<DispatchApi.Update.Request, 'id' | 'category' | 'relatedEntityId'>;

export const OperationDispatchUpdate: React.FC = observer(() => {
    const { operationStore } = stores;
    const { t } = useTranslation();
    const dispatch = operationStore.selectedDispatch;

    const validationSchema: Yup.ObjectSchema<FormValues> = Yup.object({
        title: Yup.string().required(t('common.validation.required')),
        description: Yup.string().required(t('common.validation.required')),
        occuredAt: Yup.string().required(t('common.validation.required')),
        relatedChildEntityId: Yup.string().nullable().default(null),
        providerAgentId: Yup.string().required(t('common.validation.required')),
    });

    const formik = useFormik<FormValues>({
        enableReinitialize: true,
        initialValues: {
            title: dispatch?.title ?? '',
            description: dispatch?.description ?? '',
            occuredAt: dispatch?.occuredAt ?? '',
            relatedChildEntityId: dispatch?.relatedChildEntityId ?? null,
            providerAgentId: dispatch?.providerAgentId ?? '',
        },
        validationSchema,
        onSubmit: async (values) => {
            await operationStore.updateDispatch(values);
        },
    });

    if (dispatch == undefined)
        return (<p className="right-panel-empty">{t('operation.noItemSelected')}</p>);

    return (
        <Form formik={formik} mode={FormMode.Update}>
            <h4>{t('operation.updateDispatch.title')}</h4>

            <FormItem<FormValues> name="title" label={t('operation.dispatchFields.title')}>
                <Input<FormValues> id="title" name="title" />
            </FormItem>

            <FormItem<FormValues> name="description" label={t('operation.dispatchFields.description')}>
                <Input<FormValues> id="description" name="description" />
            </FormItem>

            <FormItem<FormValues> name="occuredAt" label={t('operation.dispatchFields.occuredAt')}>
                <DatePicker<FormValues> name="occuredAt" mode="datetime" />
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
