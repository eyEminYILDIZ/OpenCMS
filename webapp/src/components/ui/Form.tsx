import { createContext, useContext } from 'react';
import { FormikProps } from 'formik';

export enum FormMode {
    Create = 'create',
    Update = 'update',
}

const formModeClassNames: Record<FormMode, string> = {
    [FormMode.Create]: 'create-form',
    [FormMode.Update]: 'update-form',
};

interface FormContextValue {
    touched: Record<string, unknown>;
    errors: Record<string, unknown>;
    values: Record<string, unknown>;
    setFieldValue: (field: string, value: unknown) => void;
}

const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue {
    const ctx = useContext(FormContext);
    if (!ctx) throw new Error('useFormContext must be used inside <Form>');
    return ctx;
}

interface FormProps<T> {
    formik: FormikProps<T>;
    mode: FormMode;
    children: React.ReactNode;
}

function Form<T>({ formik, mode, children }: FormProps<T>) {
    const value: FormContextValue = {
        touched: formik.touched as Record<string, unknown>,
        errors: formik.errors as Record<string, unknown>,
        values: formik.values as Record<string, unknown>,
        setFieldValue: formik.setFieldValue,
    };

    return (
        <FormContext.Provider value={value}>
            <form onSubmit={formik.handleSubmit} className={formModeClassNames[mode]}>
                {children}
            </form>
        </FormContext.Provider>
    );
}

export default Form;
