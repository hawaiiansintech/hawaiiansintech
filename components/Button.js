import Link from "next/link";
import { cssHelperButtonReset } from "../styles/global.js";

export default function Button(props) {
  const { children, disabled, linkTo, small, textOnly, onClick, type } = props;
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
        border: 0.25rem solid transparent;
        border-radius: var(--border-radius-medium);
        font-size: 1rem;
        font-weight: 600;
        background: ${disabled
          ? "var(--color-background-button-disabled)"
          : "var(--color-brand)"};
        cursor: ${disabled ? "not-allowed" : "pointer"};
      }
      .button:hover {
        border-color: var(--color-brand-tone);
      }
      .button:focus {
        border-color: var(--color-brand-tone);
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

  const handleOnClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick();
  };

  if (linkTo) {
    button = (
      <Link href={linkTo} className="button">
        <a className="button" onClick={handleOnClick}>
          {button}
          {buttonStyles}
        </a>
      </Link>
    );
  } else {
    button = (
      <button type={type} className="button" onClick={handleOnClick}>
        {button}
        {buttonStyles}
      </button>
    );
  }
  return button;
}
