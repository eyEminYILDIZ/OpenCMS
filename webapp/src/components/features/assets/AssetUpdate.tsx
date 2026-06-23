import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { stores } from "../../../stores";
import { AssetApi } from "../../../api";
import { assetTypeOptions, threatTypeOptions, isActiveOptions, PanelModes } from "../../../types";
import Input from "../../ui/Input";
import Form, { FormMode } from "../../ui/Form";
import FormItem from "../../ui/FormItem";
import Button from "../../ui/Button";
import ButtonStack from "../../ui/ButtonStack";
import { CircleX, Save } from "lucide-react";
import Dropdown from "../../ui/Dropdown";

type FormValues = Omit<AssetApi.Update.Request, 'id'>;


export const AssetUpdate: React.FC = observer(() => {
    const { assetStore } = stores;
    const { t } = useTranslation();
    const item = assetStore.selectedItem;

    const validationSchema: Yup.ObjectSchema<FormValues> = Yup.object({
        name: Yup.string().required(t('common.validation.required')),
        latitude: Yup.number().required(t('common.validation.required')),
        longitude: Yup.number().required(t('common.validation.required')),
        altitude: Yup.number().required(t('common.validation.required')),
        heading: Yup.number().required(t('common.validation.required')),
        speed: Yup.number().min(0, t('common.validation.nonNegative')).required(t('common.validation.required')),
        assetType: Yup.number().required(t('common.validation.required')),
        threatType: Yup.number().required(t('common.validation.required')),
        isActive: Yup.boolean().required(t('common.validation.required')),
        relatedAgentId: Yup.string().nullable().default(null),
    });

    const formik = useFormik<FormValues>({
        enableReinitialize: true,
        initialValues: {
            name: item?.name ?? '',
            latitude: item?.latitude ?? 0,
            longitude: item?.longitude ?? 0,
            altitude: item?.altitude ?? 0,
            heading: item?.heading ?? 0,
            speed: item?.speed ?? 0,
            assetType: item?.assetType ?? AssetApi.Enums.AssetTypes.Unknown,
            threatType: item?.threatType ?? AssetApi.Enums.ThreatTypes.Unknown,
            isActive: item?.isActive ?? false,
            relatedAgentId: item?.relatedAgentId ?? null,
        },
        validationSchema,
        onSubmit: async (values) => {
            await assetStore.updateItem(values);
        },
    });

    if (item == undefined)
        return (<p className="right-panel-empty">{t('asset.noItemSelected')}</p>);

    return (
        <Form formik={formik} mode={FormMode.Update}>
            <h4>{t('asset.update.title')}</h4>

            <FormItem<FormValues> name="name" label={t('asset.fields.name')}>
                <Input<FormValues> id="name" name="name" />
            </FormItem>

            <FormItem<FormValues> name="latitude" label={t('asset.fields.latitude')}>
                <Input<FormValues> id="latitude" name="latitude" type="number" />
            </FormItem>

            <FormItem<FormValues> name="longitude" label={t('asset.fields.longitude')}>
                <Input<FormValues> id="longitude" name="longitude" type="number" />
            </FormItem>

            <FormItem<FormValues> name="altitude" label={t('asset.fields.altitude')}>
                <Input<FormValues> id="altitude" name="altitude" type="number" />
            </FormItem>

            <FormItem<FormValues> name="heading" label={t('asset.fields.heading')}>
                <Input<FormValues> id="heading" name="heading" type="number" />
            </FormItem>

            <FormItem<FormValues> name="speed" label={t('asset.fields.speed')}>
                <Input<FormValues> id="speed" name="speed" type="number" />
            </FormItem>

            <FormItem label={t('asset.fields.assetType')}>
                <Dropdown<FormValues>
                    name="assetType"
                    options={assetTypeOptions}
                />
            </FormItem>

            <FormItem label={t('asset.fields.threatType')}>
                <Dropdown<FormValues>
                    name="threatType"
                    options={threatTypeOptions}
                />
            </FormItem>

            <FormItem label={t('asset.fields.isActive')}>
                <Dropdown<FormValues>
                    name="isActive"
                    options={isActiveOptions}
                />
            </FormItem>

            <FormItem label={t('asset.fields.relatedAgentId')}>
                <Input
                    id="relatedAgentId"
                    name="relatedAgentId"
                    value={formik.values.relatedAgentId ?? ''}
                    onChange={(e) =>
                        formik.setFieldValue('relatedAgentId', e.target.value || null)
                    }
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
                    onClick={() => assetStore.setPanelMode(PanelModes.Detail)}
                >
                    <CircleX size={16} />
                    {t('common.cancel')}
                </Button>
            </ButtonStack>
        </Form>
    );
});
