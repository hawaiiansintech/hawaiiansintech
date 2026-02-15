import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import LoadingSpinner from "../LoadingSpinner";

const buttonVariants = cva(
  `inline-flex
  items-center
  justify-center
  rounded-md
  font-medium
  ring-offset-background
  transition-colors
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-ring
  focus-visible:ring-offset-2
  disabled:pointer-events-none
  disabled:opacity-50`,
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80 active:bg-primary/90 hover:text-primary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input/50 bg-background hover:border-input border-2",
        secondary:
          "bg-secondary text-secondary-foreground hover:text-secondary-foreground hover:bg-secondary/80",
        secondaryBrand: "bg-primary/15 text-primary hover:bg-primary/30",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        noAnim: "hover:scale-100 active:scale-100",
      },
      size: {
        sm: "h-10 rounded py-1 px-2",
        default: "h-12 rounded-sm p-2 text-xl sm:text-base",
        lg: "h-14 rounded-md p-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      size,
      asChild = false,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner />
          </>
        ) : (
          <>{children}</>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
