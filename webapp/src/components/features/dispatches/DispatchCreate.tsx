import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { stores } from "../../../stores";
import { DispatchApi } from "../../../api";
import { dispatchCategoryOptions, PanelModes } from "../../../types";
import Input from "../../ui/Input";
import DatePicker from "../../ui/DatePicker";
import Form, { FormMode } from "../../ui/Form";
import FormItem from "../../ui/FormItem";
import Button from "../../ui/Button";
import ButtonStack from "../../ui/ButtonStack";
import { CircleX, Save } from "lucide-react";
import Dropdown from "../../ui/Dropdown";
import config from "../../../../app.json"

type FormValues = Omit<DispatchApi.Create.Request, never>;

export const DispatchCreate: React.FC = observer(() => {
    const { dispatchStore } = stores;
    const { t } = useTranslation();

    const validationSchema: Yup.ObjectSchema<FormValues> = Yup.object({
        title: Yup.string().required(t('common.validation.required')),
        description: Yup.string().required(t('common.validation.required')),
        category: Yup.number().required(t('common.validation.required')),
        occuredAt: Yup.string().required(t('common.validation.required')),
        relatedEntityId: Yup.string().required(t('common.validation.required')),
        relatedChildEntityId: Yup.string().nullable().default(null),
        providerAgentId: Yup.string().required(t('common.validation.required')),
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            title: '',
            description: '',
            category: DispatchApi.Enums.DispatchCategories.General,
            occuredAt: '',
            relatedEntityId: '00000000-0000-0000-0000-000000000000',
            relatedChildEntityId: null,
            providerAgentId: config.agentId,
        },
        validationSchema,
        onSubmit: async (values) => {
            await dispatchStore.createItem(values);
        },
    });

    return (
        <Form formik={formik} mode={FormMode.Create}>
            <h4>{t('dispatch.create.title')}</h4>

            <FormItem<FormValues> name="title" label={t('dispatch.fields.title')}>
                <Input<FormValues> id="title" name="title" />
            </FormItem>

            <FormItem<FormValues> name="description" label={t('dispatch.fields.description')}>
                <Input<FormValues> id="description" name="description" />
            </FormItem>

            <FormItem label={t('dispatch.fields.category')}>
                <Dropdown<FormValues>
                    name="category"
                    options={dispatchCategoryOptions}
                />
            </FormItem>

            <FormItem<FormValues> name="occuredAt" label={t('dispatch.fields.occuredAt')}>
                <DatePicker<FormValues> name="occuredAt" mode="datetime" />
            </FormItem>

            <FormItem<FormValues> name="relatedEntityId" label={t('dispatch.fields.relatedEntityId')}>
                <Input<FormValues> id="relatedEntityId" name="relatedEntityId" />
            </FormItem>

            <ButtonStack>
                <Button type="submit" disabled={formik.isSubmitting}>
                    <Save size={16} />
                    {formik.isSubmitting ? t('common.saving') : t('common.save')}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => dispatchStore.setPanelMode(PanelModes.Detail)}
                >
                    <CircleX size={16} />
                    {t('common.cancel')}
                </Button>
            </ButtonStack>
        </Form>
    );
});
