import { cn } from '../../lib/utils';

interface ButtonStackProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

const ButtonStack = ({ children, direction = 'horizontal', className }: ButtonStackProps) => {
  return (
    <div className={cn('btn-stack', direction === 'vertical' ? 'btn-stack-vertical' : 'btn-stack-horizontal', className)}>
      {children}
    </div>
  );
};

export default ButtonStack;
