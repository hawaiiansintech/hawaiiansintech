import { cn } from "@/lib/utils";
import React from "react";

export default function Code({
  children,
  noWrap,
}: {
  children: React.ReactNode;
  noWrap?: boolean;
}) {
  return (
    <code
      className={cn(
        `rounded-md bg-tan-300 px-1.5 py-1 text-sm text-stone-600`,
        noWrap && `whitespace-nowrap`,
      )}
    >
      {children}
    </code>
  );
}
