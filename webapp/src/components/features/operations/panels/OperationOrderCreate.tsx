import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { stores } from "../../../../stores";
import { OperationApi } from "../../../../api";
import { AssetApi } from "../../../../api";
import { orderStatusOptions, orderTypeOptions, PanelModes } from "../../../../types";
import Input from "../../../ui/Input";
import DatePicker from "../../../ui/DatePicker";
import Form, { FormMode } from "../../../ui/Form";
import FormItem from "../../../ui/FormItem";
import Button from "../../../ui/Button";
import ButtonStack from "../../../ui/ButtonStack";
import { CircleX, Save } from "lucide-react";
import Dropdown from "../../../ui/Dropdown";
import DropdownRemote from "../../../ui/DropdownRemote";

type FormValues = Omit<OperationApi.Orders.Create.Request, never>;

export const OperationOrderCreate: React.FC = observer(() => {
    const { operationStore } = stores;
    const { t } = useTranslation();

    const validationSchema: Yup.ObjectSchema<FormValues> = Yup.object({
        operationId: Yup.string().required(t('common.validation.required')),
        code: Yup.string().max(3, t('common.validation.maxLength', { count: 3 })).defined(),
        description: Yup.string().required(t('common.validation.required')),
        issuedDate: Yup.string().required(t('common.validation.required')),
        completedDate: Yup.string().required(t('common.validation.required')),
        orderStatus: Yup.number().required(t('common.validation.required')),
        orderType: Yup.number().required(t('common.validation.required')),
        targetDatePeriodStart: Yup.string().required(t('common.validation.required')),
        targetDatePeriodEnd: Yup.string().required(t('common.validation.required')),
        targetPointLatitude: Yup.number().required(t('common.validation.required')),
        targetPointLongitude: Yup.number().required(t('common.validation.required')),
        targetPointAltitude: Yup.number().required(t('common.validation.required')),
        targetPointHeading: Yup.number().required(t('common.validation.required')),
        targetPointSpeed: Yup.number().required(t('common.validation.required')),
        responsibleOperationAssetId: Yup.string().required(t('common.validation.required')),
        nextOrderId: Yup.string().nullable().default(null),
        previousOrderId: Yup.string().nullable().default(null),
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            operationId: operationStore.selectedItem?.id ?? '',
            code: '',
            description: '',
            issuedDate: '',
            completedDate: '',
            orderStatus: OperationApi.Enums.OrderStatus.Passive,
            orderType: OperationApi.Enums.OrderTypes.Move,
            targetDatePeriodStart: '',
            targetDatePeriodEnd: '',
            targetPointLatitude: 0,
            targetPointLongitude: 0,
            targetPointAltitude: 0,
            targetPointHeading: 0,
            targetPointSpeed: 0,
            responsibleOperationAssetId: '',
            nextOrderId: null,
            previousOrderId: null,
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log('Submitting form with values:', values);
            await operationStore.createOrder(values);
        },
    });

    useEffect(() => {
        if (Object.keys(formik.errors).length > 0) {
            console.log('Validation errors:', formik.errors);
            console.log("values", formik.values);
        }
    }, [formik.errors]);

    return (
        <Form formik={formik} mode={FormMode.Create}>
            <h4>{t('operation.createOrder.title')}</h4>

            <FormItem<FormValues> name="code" label={t('operation.orderFields.code')}>
                <Input<FormValues> id="code" name="code" maxLength={3} />
            </FormItem>

            <FormItem<FormValues> name="description" label={t('operation.orderFields.description')}>
                <Input<FormValues> id="description" name="description" />
            </FormItem>

            <FormItem<FormValues> name="issuedDate" label={t('operation.orderFields.issuedDate')}>
                <DatePicker<FormValues> name="issuedDate" mode="datetime" />
            </FormItem>

            <FormItem<FormValues> name="completedDate" label={t('operation.orderFields.completedDate')}>
                <DatePicker<FormValues> name="completedDate" mode="datetime" />
            </FormItem>

            <FormItem<FormValues> name="orderStatus" label={t('operation.orderFields.orderStatus')}>
                <Dropdown<FormValues>
                    name="orderStatus"
                    options={orderStatusOptions}
                />
            </FormItem>

            <FormItem<FormValues> name="orderType" label={t('operation.orderFields.orderType')}>
                <Dropdown<FormValues>
                    name="orderType"
                    options={orderTypeOptions}
                />
            </FormItem>

            <FormItem<FormValues> name="targetDatePeriodStart" label={t('operation.orderFields.targetDatePeriodStart')}>
                <DatePicker<FormValues> name="targetDatePeriodStart" mode="datetime" />
            </FormItem>

            <FormItem<FormValues> name="targetDatePeriodEnd" label={t('operation.orderFields.targetDatePeriodEnd')}>
                <DatePicker<FormValues> name="targetDatePeriodEnd" mode="datetime" />
            </FormItem>

            <FormItem<FormValues> name="targetPointLatitude" label={t('operation.orderFields.targetPointLatitude')}>
                <Input<FormValues> id="targetPointLatitude" name="targetPointLatitude" type="number" />
            </FormItem>

            <FormItem<FormValues> name="targetPointLongitude" label={t('operation.orderFields.targetPointLongitude')}>
                <Input<FormValues> id="targetPointLongitude" name="targetPointLongitude" type="number" />
            </FormItem>

            <FormItem<FormValues> name="targetPointAltitude" label={t('operation.orderFields.targetPointAltitude')}>
                <Input<FormValues> id="targetPointAltitude" name="targetPointAltitude" type="number" />
            </FormItem>

            <FormItem<FormValues> name="targetPointHeading" label={t('operation.orderFields.targetPointHeading')}>
                <Input<FormValues> id="targetPointHeading" name="targetPointHeading" type="number" />
            </FormItem>

            <FormItem<FormValues> name="targetPointSpeed" label={t('operation.orderFields.targetPointSpeed')}>
                <Input<FormValues> id="targetPointSpeed" name="targetPointSpeed" type="number" />
            </FormItem>

            <FormItem<FormValues> name="responsibleOperationAssetId" label={t('operation.orderFields.responsibleOperationAssetId')}>
                <DropdownRemote<FormValues>
                    name="responsibleOperationAssetId"
                    endpoint={OperationApi.OperationAssets.Pick.path}
                    relationId={formik.values.operationId}
                />
            </FormItem>

            <FormItem<FormValues> name="previousOrderId" label={t('operation.orderFields.previousOrderId')}>
                <DropdownRemote<FormValues>
                    name="previousOrderId"
                    endpoint={OperationApi.Orders.Pick.path}
                    relationId={formik.values.operationId}
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
