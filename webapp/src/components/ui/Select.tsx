import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {}

const SelectTrigger = ({ className, children, ...props }: SelectTriggerProps) => (
  <SelectPrimitive.Trigger className={cn('select-trigger', className)} {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="select-icon" size={16} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {}

const SelectContent = ({ className, children, position = 'popper', ...props }: SelectContentProps) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      className={cn('select-content', className)}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="select-viewport">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {}

const SelectItem = ({ className, children, ...props }: SelectItemProps) => (
  <SelectPrimitive.Item className={cn('select-item', className)} {...props}>
    <span className="select-item-indicator">
      <SelectPrimitive.ItemIndicator>
        <Check size={14} />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem };
