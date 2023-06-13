import Link from "next/link";

interface UndoButtonProps {
  children: React.ReactNode;
  linkTo?: string;
  onClick?: (e: React.MouseEvent) => any;
  type?: "button" | "submit" | "reset";
}

export default function UndoButton({
  children,
  linkTo,
  onClick,
  type,
}: UndoButtonProps) {
  let button = <>{children}</>;

  const classes =
    "inline-block px-2 py-0.5 ml-1 rounded bg-tan-400 hover:bg-tan-400/50 hover:ring-2 hover:ring-inset hover:ring-tan-400/70";

  if (linkTo) {
    button = (
      <Link href={linkTo} onClick={onClick}>
        <div className={classes}>{button}</div>
      </Link>
    );
  } else {
    button = (
      <button type={type} className={classes} onClick={onClick}>
        {button}
      </button>
    );
  }
  return button;
}
