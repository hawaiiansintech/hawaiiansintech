import Link from "next/link";
import { cssHelperButtonReset } from "../styles/global.js";

export default function Button({
  children,
  disabled,
  linkTo,
  small,
  textOnly,
  onClick,
}) {
  let button = <>{children}</>;

  const background =
    (disabled && "var(--color-background-button-disabled)") ||
    (textOnly && "transparent") ||
    "var(--color-background-button)";

  let buttonStyles = (
    <style jsx>{`
      .button {
        ${cssHelperButtonReset}
        padding: 1.2rem;
        width: 100%;
        max-width: 24rem;
        color: ${disabled
          ? "var(--color-text-button-disabled)"
          : "var(--color-text-button)"};
        border-radius: 1rem;
        font-size: 1rem;
        background: ${disabled
          ? "var(--color-background-button-disabled)"
          : "var(--color-background-button)"};
        cursor: ${disabled ? "not-allowed" : "pointer"};
      }
      .button:active {
        background: ${disabled
          ? "var(--color-background-button-disabled)"
          : "var(--color-background-button-pressed)"};
      }
      .button:focus {
        box-shadow: ${disabled ? "none" : "var(--box-shadow-outline-button)"};
      }
      .button:focus:not(:focus-visible) {
        outline: none;
      }
      .button:focus:not(:-moz-focusring) {
        outline: none;
      }
    `}</style>
  );
  if (linkTo) {
    button = (
      <Link href={linkTo} className="button">
        <a className="button">
          {button}
          {buttonStyles}
        </a>
      </Link>
    );
  } else {
    button = (
      <button className="button" onClick={onClick}>
        {button}
        {buttonStyles}
      </button>
    );
  }
  return button;
}
