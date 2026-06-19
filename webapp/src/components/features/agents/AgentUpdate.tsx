import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { stores } from "../../../stores";
import { AgentApi } from "../../../api";
import { agentTypeOptions, isActiveOptions, PanelModes } from "../../../types";
import Input from "../../ui/Input";
import Form, { FormMode } from "../../ui/Form";
import FormItem from "../../ui/FormItem";
import Button from "../../ui/Button";
import ButtonStack from "../../ui/ButtonStack";
import { CircleX, Save } from "lucide-react";
import Dropdown from "../../ui/Dropdown";

type FormValues = Omit<AgentApi.Update.Request, 'id'>;

export const AgentUpdate: React.FC = observer(() => {
    const { agentStore } = stores;
    const { t } = useTranslation();
    const item = agentStore.selectedItem;

    const validationSchema = Yup.object({
        name: Yup.string().required(t('common.validation.required')),
        description: Yup.string().required(t('common.validation.required')),
        agentType: Yup.number().required(t('common.validation.required')),
    });

    const formik = useFormik<FormValues>({
        enableReinitialize: true,
        initialValues: {
            name: item?.name ?? '',
            description: item?.description ?? '',
            agentType: item?.agentType ?? AgentApi.Enums.AgentTypes.ComputerProgram,
        },
        validationSchema,
        onSubmit: async (values) => {
            await agentStore.updateItem(values);
        },
    });

    if (item == undefined)
        return (<p className="right-panel-empty">{t('agent.noItemSelected')}</p>);

    return (
        <Form formik={formik} mode={FormMode.Update}>
            <h4>{t('agent.update.title')}</h4>

            <FormItem<FormValues> name="name" label={t('agent.fields.name')}>
                <Input<FormValues>
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </FormItem>

            <FormItem<FormValues> name="description" label={t('agent.fields.description')}>
                <Input<FormValues>
                    id="description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </FormItem>

            <FormItem label={t('agent.fields.agentType')}>
                <Dropdown<FormValues>
                    name="agentType"
                    options={agentTypeOptions}
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
                    onClick={() => agentStore.setPanelMode(PanelModes.Detail)}
                >
                    <CircleX size={16} />
                    {t('common.cancel')}
                </Button>
            </ButtonStack>
        </Form>
    );
});
