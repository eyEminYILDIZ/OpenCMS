import { cn } from '../../lib/utils';
import { useFormContextOptional } from './Form';

interface InputProps<T extends Record<string, unknown> = Record<string, unknown>>
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
    name?: keyof T & string;
}

function Input<T extends Record<string, unknown> = Record<string, unknown>>({
    className,
    type,
    name,
    value,
    onChange,
    onBlur,
    ...props
}: InputProps<T>) {
    const ctx = useFormContextOptional();

    const resolvedValue = value ?? (ctx && name ? (ctx.values[name] as string | number | readonly string[] | undefined) : undefined);
    const resolvedOnChange = onChange ?? ctx?.handleChange;
    const resolvedOnBlur = onBlur ?? ctx?.handleBlur;

    return (
        <input
            type={type}
            name={name}
            className={cn('input', className)}
            value={resolvedValue}
            onChange={resolvedOnChange}
            onBlur={resolvedOnBlur}
            {...props}
        />
    );
}

export default Input;
