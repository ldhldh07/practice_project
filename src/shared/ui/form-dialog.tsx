import { ReactNode } from "react";

import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSubmit: () => Promise<void> | void;
  children: ReactNode;
  submitLabel?: string;
  disabled?: boolean;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  onSubmit,
  children,
  submitLabel = "확인",
  disabled = false,
}: Readonly<FormDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">{children}</div>
        <Button onClick={() => void onSubmit()} disabled={disabled}>
          {submitLabel}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
