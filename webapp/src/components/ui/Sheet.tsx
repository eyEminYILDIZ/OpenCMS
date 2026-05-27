import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Sheet = ({ open, onClose, title, children }: SheetProps) => (
  <DialogPrimitive.Root open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }} modal={false}>
    <DialogPrimitive.Portal forceMount>
      <DialogPrimitive.Content
        forceMount
        className="sheet-content"
        aria-describedby={undefined}
        onEscapeKeyDown={onClose}
      >
        <div className="sheet-header">
          <DialogPrimitive.Title className="sheet-title">{title}</DialogPrimitive.Title>
          <button className="sheet-close" onClick={onClose} aria-label="Close panel">
            <X size={18} />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);

export default Sheet;
