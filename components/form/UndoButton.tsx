import Link from "next/link";
import React from "react";

interface UndoButtonProps {
  children: React.ReactNode;
  linkTo?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit" | "reset";
}

export default function UndoButton({
  children,
  linkTo,
  onClick,
  type,
}: UndoButtonProps) {
  let button = <>{children}</>;

  if (linkTo) {
    button = (
      <Link href={linkTo} onClick={onClick}>
        <div
          className={
            "ml-1 inline-block rounded bg-tan-400 px-2 py-0.5 hover:bg-tan-400/50 hover:ring-2 hover:ring-inset hover:ring-tan-400/70"
          }
        >
          {button}
        </div>
      </Link>
    );
  } else {
    button = (
      <button
        type={type}
        className={
          "ml-1 inline-block rounded bg-tan-400 px-2 py-0.5 hover:bg-tan-400/50 hover:ring-2 hover:ring-inset hover:ring-tan-400/70"
        }
        onClick={onClick}
      >
        {button}
      </button>
    );
  }
  return button;
}
