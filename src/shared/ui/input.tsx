import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, error, ...props }, ref) => {
  return (
    <div className="space-y-1">
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-red-500 focus-visible:ring-red-500" : "border-input"
        } ${className}`}
        ref={ref}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
