import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { stores } from "../../../stores";
import { AgentApi } from "../../../api";
import { agentTypeOptions, PanelModes } from "../../../types";
import Input from "../../ui/Input";
import Form, { FormMode } from "../../ui/Form";
import FormItem from "../../ui/FormItem";
import Button from "../../ui/Button";
import ButtonStack from "../../ui/ButtonStack";
import { CircleX, Save } from "lucide-react";
import Dropdown from "../../ui/Dropdown";

type FormValues = Omit<AgentApi.Create.Request, never>;

export const AgentCreate: React.FC = observer(() => {
    const { agentStore } = stores;
    const { t } = useTranslation();

    const validationSchema: Yup.ObjectSchema<FormValues> = Yup.object({
        name: Yup.string().required(t('common.validation.required')),
        description: Yup.string().required(t('common.validation.required')),
        agentType: Yup.number().required(t('common.validation.required')),
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            name: '',
            description: '',
            agentType: AgentApi.Enums.AgentTypes.ComputerProgram,
        },
        validationSchema,
        onSubmit: async (values) => {
            await agentStore.createItem(values);
        },
    });

    return (
        <Form formik={formik} mode={FormMode.Create}>
            <h4>{t('agent.create.title')}</h4>

            <FormItem<FormValues> name="name" label={t('agent.fields.name')}>
                <Input<FormValues> id="name" name="name" />
            </FormItem>

            <FormItem<FormValues> name="description" label={t('agent.fields.description')}>
                <Input<FormValues> id="description" name="description" />
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
