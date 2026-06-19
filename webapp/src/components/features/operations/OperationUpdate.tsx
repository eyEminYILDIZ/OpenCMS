import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { stores } from "../../../stores";
import { OperationApi } from "../../../api";
import { operationStatusOptions, operationTypeOptions, PanelModes } from "../../../types";
import Input from "../../ui/Input";
import DatePicker from "../../ui/DatePicker";
import Form, { FormMode } from "../../ui/Form";
import FormItem from "../../ui/FormItem";
import Button from "../../ui/Button";
import ButtonStack from "../../ui/ButtonStack";
import { CircleX, Save } from "lucide-react";
import Dropdown from "../../ui/Dropdown";

type FormValues = Omit<OperationApi.Update.Request, 'id'>;

export const OperationUpdate: React.FC = observer(() => {
    const { operationStore } = stores;
    const { t } = useTranslation();
    const item = operationStore.selectedItem;

    const validationSchema = Yup.object({
        name: Yup.string().required(t('common.validation.required')),
        description: Yup.string().required(t('common.validation.required')),
        startDate: Yup.string().required(t('common.validation.required')),
        estimatedEndDate: Yup.string().required(t('common.validation.required')),
        operationStatus: Yup.number().required(t('common.validation.required')),
        operationType: Yup.number().required(t('common.validation.required')),
    });

    const formik = useFormik<FormValues>({
        enableReinitialize: true,
        initialValues: {
            name: item?.name ?? '',
            description: item?.description ?? '',
            startDate: item?.startDate ?? '',
            estimatedEndDate: item?.estimatedEndDate ?? '',
            operationStatus: item?.operationStatus ?? OperationApi.Enums.OperationStatus.NotStarted,
            operationType: item?.operationType ?? OperationApi.Enums.OperationType.Intercept,
        },
        validationSchema,
        onSubmit: async (values) => {
            await operationStore.updateItem(values);
        },
    });

    if (item == undefined)
        return (<p className="right-panel-empty">{t('operation.noItemSelected')}</p>);

    return (
        <Form formik={formik} mode={FormMode.Update}>
            <h4>{t('operation.update.title')}</h4>

            <FormItem<FormValues> name="name" label={t('operation.fields.name')}>
                <Input<FormValues>
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </FormItem>

            <FormItem<FormValues> name="description" label={t('operation.fields.description')}>
                <Input<FormValues>
                    id="description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </FormItem>

            <FormItem<FormValues> name="startDate" label={t('operation.fields.startDate')}>
                <DatePicker<FormValues> name="startDate" mode="datetime" />
            </FormItem>

            <FormItem<FormValues> name="estimatedEndDate" label={t('operation.fields.estimatedEndDate')}>
                <DatePicker<FormValues> name="estimatedEndDate" mode="datetime" />
            </FormItem>

            <FormItem label={t('operation.fields.operationStatus')}>
                <Dropdown<FormValues>
                    name="operationStatus"
                    options={operationStatusOptions}
                />
            </FormItem>

            <FormItem label={t('operation.fields.operationType')}>
                <Dropdown<FormValues>
                    name="operationType"
                    options={operationTypeOptions}
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
