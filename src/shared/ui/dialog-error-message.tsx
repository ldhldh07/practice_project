interface DialogErrorMessageProps {
  message: string | null;
}

export function DialogErrorMessage({ message }: Readonly<DialogErrorMessageProps>) {
  if (!message) return null;

  return (
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
}
