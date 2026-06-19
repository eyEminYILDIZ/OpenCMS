import { useFormContext } from './Form';
import Label from './Label';

interface FormItemProps<T extends Record<string, unknown> = Record<string, unknown>> {
    name?: keyof T & string;
    label?: React.ReactNode;
    children: React.ReactNode;
}

function FormItem<T extends Record<string, unknown> = Record<string, unknown>>({ name, label, children }: FormItemProps<T>) {
    const { touched, errors } = useFormContext();
    const error = name && touched[name] && errors[name]
        ? String(errors[name])
        : undefined;

    return (
        <div className="form-field">
            {label && <Label>{label}</Label>}
            {children}
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}

export default FormItem;
