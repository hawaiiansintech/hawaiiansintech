import Link from "next/link";
import { cssHelperButtonReset } from "../styles/global.js";

export default function UndoButton(props) {
  const { children, linkTo, onClick, type } = props;
  let button = <>{children}</>;

  let buttonStyles = (
    <style jsx>{`
      .undo-button {
        padding: 0.125rem 0.25rem;
        border: 0.125rem solid transparent;
        border-radius: var(--border-radius-x-small);
        font-size: 0.8rem;
        font-weight: 600;
        background: var(--color-border);
        cursor: pointer;
      }
      .undo-button:hover {
        background: var(--color-border-alt);
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
