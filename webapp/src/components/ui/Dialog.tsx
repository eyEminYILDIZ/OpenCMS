import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

const DialogOverlay = ({ className, ...props }: DialogOverlayProps) => (
  <DialogPrimitive.Overlay className={cn('dialog-overlay', className)} {...props} />
);

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {}

const DialogContent = ({ className, children, ...props }: DialogContentProps) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogPrimitive.Content className={cn('dialog-content', className)} {...props}>
      {children}
      <DialogPrimitive.Close className="dialog-close" aria-label="Close">
        <X size={16} />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div className={cn('dialog-header', className)} {...props} />
);

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <div className={cn('dialog-footer', className)} {...props} />
);

interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

const DialogTitle = ({ className, ...props }: DialogTitleProps) => (
  <DialogPrimitive.Title className={cn('dialog-title', className)} {...props} />
);

interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => (
  <DialogPrimitive.Description className={cn('dialog-description', className)} {...props} />
);

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
