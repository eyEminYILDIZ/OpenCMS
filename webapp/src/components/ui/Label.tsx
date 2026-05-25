import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '../../lib/utils';

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

const Label = ({ className, ...props }: LabelProps) => (
  <LabelPrimitive.Root className={cn('label', className)} {...props} />
);

export default Label;
