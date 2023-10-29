"use client";

import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      `inline-flex
      items-center
      justify-center
      rounded-md
      bg-muted
      border
      p-0.5
      text-muted-foreground`,
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabTriggerVariants = cva(
  `grow
  font-medium
  inline-flex
  items-center
  justify-center
  whitespace-nowrap
  ring-offset-background
  transition-all
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-ring
  focus-visible:ring-offset-2
  disabled:pointer-events-none
  disabled:opacity-50`,
  {
    variants: {
      variant: {
        default: `data-[state=active]:bg-background
          data-[state=active]:text-foreground
          data-[state=active]:shadow-sm`,
        alert: `data-[state=active]:bg-red-500/10
          data-[state=active]:bg-gradient-to-br
          data-[state=active]:from-red-500/10
          data-[state=active]:to-red-500/60
          data-[state=active]:text-red-700`,
        success: `data-[state=active]:bg-emerald-500/10
          data-[state=active]:bg-gradient-to-br
          data-[state=active]:from-emerald-500/10
          data-[state=active]:to-emerald-500/60
          data-[state=active]:text-emerald-700`,
        nearSuccess: `data-[state=active]:bg-violet-500/10
          data-[state=active]:bg-gradient-to-br
          data-[state=active]:from-violet-500/10
          data-[state=active]:to-violet-500/60
          data-[state=active]:text-violet-700`,
        warn: `data-[state=active]:bg-amber-500/10
          data-[state=active]:bg-gradient-to-br
          data-[state=active]:from-amber-500/10
          data-[state=active]:to-amber-500/60
          data-[state=active]:text-amber-700`,
      },
      size: {
        default: "rounded-sm px-3 py-1 text-sm",
        sm: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface TabsTriggerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabTriggerVariants> {
  variant?: "default" | "alert" | "success" | "nearSuccess" | "warn";
  size?: "default" | "sm" | "lg";
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps &
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabTriggerVariants({ variant, size }), className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      `mt-2
      ring-offset-background
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-ring
      focus-visible:ring-offset-2`,
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
