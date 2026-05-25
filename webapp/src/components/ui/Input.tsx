import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = ({ className, type, ...props }: InputProps) => {
  return <input type={type} className={cn('input', className)} {...props} />;
};

export default Input;
