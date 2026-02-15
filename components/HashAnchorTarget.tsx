import React from "react";

interface HashAnchorTargetProps {
  id: string;
  children: React.ReactNode;
  classNames?: string;
}

export function HashAnchorTarget({
  classNames,
  id,
  children,
}: HashAnchorTargetProps) {
  return (
    <div
      className={`
      group
      relative
      ${classNames}
  `}
      id={id}
    >
      <a
        href={`#${id}`}
        className={`
        absolute
        -left-3
        top-0
        inline-block
        -translate-x-full
        rounded
        bg-brown-600/10
        px-1
        text-lg
        font-medium
        text-brown-500
        opacity-0
        transition
        hover:opacity-100
        group-target:opacity-100
        `}
      >
        #
      </a>

      {children}
    </div>
  );
}
