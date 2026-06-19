import { cn } from '../../lib/utils';

interface InputProps<T extends Record<string, unknown> = Record<string, unknown>>
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
    name?: keyof T & string;
}

function Input<T extends Record<string, unknown> = Record<string, unknown>>({ className, type, ...props }: InputProps<T>) {
    return <input type={type} className={cn('input', className)} {...props} />;
}

export default Input;
