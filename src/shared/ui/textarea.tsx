import { forwardRef, useId, type TextareaHTMLAttributes } from "react";

import { cn } from "@shared/lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, id, ...props }, ref) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;

  return (
    <div className="space-y-1.5">
      <textarea
        id={textareaId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "flex min-h-[100px] w-full rounded-lg border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-destructive focus-visible:ring-destructive" : "border-input",
          className,
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";
