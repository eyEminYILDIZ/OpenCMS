import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) => (
    <TabsPrimitive.List className={cn('tabs-list', className)} {...props} />
);

const TabsTrigger = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) => (
    <TabsPrimitive.Trigger className={cn('tabs-trigger', className)} {...props} />
);

const TabsContent = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) => (
    <TabsPrimitive.Content className={cn('tabs-content', className)} {...props} />
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
