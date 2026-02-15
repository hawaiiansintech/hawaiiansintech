import { cn } from "@/lib/utils";
import React from "react";

export enum TabsSize {
  Default = "default",
  Large = "large",
}

export interface TabsProps {
  items: Array<{
    label: string | React.ReactNode;
    onClick: () => void;
    selected?: boolean;
  }>;
  size?: TabsSize;
  className?: string;
}

/**
 * @deprecated Use /ui/tabs instead
 */
export default function Tabs_old({
  items,
  size = TabsSize.Default,
  className,
}: TabsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-full bg-tan-500/50 p-1 md:gap-1",
        className,
      )}
    >
      {items.map((item, i) => (
        <button
          key={`pill-${i}`}
          className={cn(
            `rounded-full
            px-3
            py-1
            text-sm
            font-medium
            leading-tight
            text-tan-900
            transition-all
            hover:bg-tan-400/70`,
            item.selected && "bg-white text-stone-900 hover:bg-white",
            size === TabsSize.Large &&
              "px-3 py-0.5 text-sm md:px-4 md:py-1 md:text-base",
          )}
          onClick={items[i].onClick}
        >
          {items[i].label}
        </button>
      ))}
    </div>
  );
}
