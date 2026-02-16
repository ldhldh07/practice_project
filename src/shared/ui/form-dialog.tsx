import { Button } from "./button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./dialog";

import type { ReactNode } from "react";

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit();
          }}
        >
          <div className="grid gap-4 py-2">{children}</div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={disabled}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
