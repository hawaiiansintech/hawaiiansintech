import Link from "next/link";
import theme from "styles/theme";

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

  let buttonStyles = (
    <style jsx>{`
      .undo-button {
        padding: 0.125em 0.25em;
        border: 0.125rem solid transparent;
        border-radius: ${theme.borderRadius.xs};
        font-size: 0.8em;
        font-weight: 600;
        background: ${theme.color.background.alt};
        cursor: pointer;
        transition: background 150ms ease-out;
      }
      .undo-button:hover {
        background: ${theme.color.border.alt};
      }
      .undo-button:focus {
        box-shadow: var(--box-shadow-outline-undo-button);
      }
      .undo-button:focus:not(:focus-visible) {
        outline: none;
      }
      .undo-button:focus:not(:-moz-focusring) {
        outline: none;
      }
    `}</style>
  );

  if (linkTo) {
    button = (
      <Link href={linkTo}>
        <a className="undo-button" onClick={onClick}>
          {button}
          {buttonStyles}
        </a>
      </Link>
    );
  } else {
    button = (
      <button type={type} className="undo-button" onClick={onClick}>
        {button}
        {buttonStyles}
      </button>
    );
  }
  return button;
}
