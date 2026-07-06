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
import config from "../../../../../app.json"

type FormValues = Omit<DispatchApi.Create.Request, 'category' | 'relatedEntityId'>;

export const OperationDispatchCreate: React.FC = observer(() => {
    const { operationStore } = stores;
    const { t } = useTranslation();

    const validationSchema: Yup.ObjectSchema<FormValues> = Yup.object({
        title: Yup.string().required(t('common.validation.required')),
        description: Yup.string().required(t('common.validation.required')),
        occuredAt: Yup.string().required(t('common.validation.required')),
        relatedChildEntityId: Yup.string().nullable().default(null),
        providerAgentId: Yup.string().required(t('common.validation.required')),
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            title: '',
            description: '',
            occuredAt: '',
            relatedChildEntityId: null,
            providerAgentId: config.agentId,
        },
        validationSchema,
        onSubmit: async (values) => {
            await operationStore.createDispatch(values);
        },
    });

    return (
        <Form formik={formik} mode={FormMode.Create}>
            <h4>{t('operation.createDispatch.title')}</h4>

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
