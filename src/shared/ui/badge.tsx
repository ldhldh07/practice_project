import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";

import { cn } from "@shared/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        success: "border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
        warning: "border-transparent bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
        info: "border-transparent bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
        purple: "border-transparent bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: Readonly<BadgeProps>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
