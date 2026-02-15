import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const inputVariants = cva(`border-red-400`, {
  variants: {
    variant: {
      default:
        "flex w-full border border-input bg-muted ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    },
    sizeVar: {
      sm: "h-10 rounded py-1 px-2",
      default: "h-12 rounded-sm p-2 text-xl file:text-lg sm:text-base",
      lg: "h-14 rounded-md p-4",
    },
  },
  defaultVariants: {
    variant: "default",
    sizeVar: "default",
  },
});

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, error, sizeVar, ...props }, ref) => {
    return (
      <>
        <input
          type={type}
          className={cn(
            inputVariants({ variant, sizeVar, className }),
            error && "border-2 border-red-500 focus-visible:ring-red-500/50",
          )}
          ref={ref}
          {...props}
        />
      </>
    );
  },
);
Input.displayName = "Input";

export { Input };
