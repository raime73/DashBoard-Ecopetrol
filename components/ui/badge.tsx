import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-border/60 bg-background text-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        indigo: "border-indigo-200/70 bg-indigo-50 text-indigo-700",
        emerald: "border-emerald-200/70 bg-emerald-50 text-emerald-700",
        amber: "border-amber-200/70 bg-amber-50 text-amber-800",
        rose: "border-rose-200/70 bg-rose-50 text-rose-700",
        slate: "border-slate-200/70 bg-slate-50 text-slate-700"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

