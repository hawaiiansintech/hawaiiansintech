import Link from "next/link";
import theme from "styles/theme";
import { cssHelperButtonReset } from "../styles/global.js";
import LoadingSpinner from "./LoadingSpinner";

export enum ButtonSize {
  Small = "small",
  Default = "default",
}

interface ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  linkTo?: string;
  loading?: boolean;
  onClick?: (e: React.MouseEvent) => any;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  disabled,
  fullWidth,
  linkTo,
  loading,
  onClick,
  size = ButtonSize.Default,
  type,
}: ButtonProps) {
  let button = (
    <>
      {children}
      {loading && (
        <div className="button__loading-spinner">
          <LoadingSpinner />
        </div>
      )}
    </>
  );

  let buttonStyles = (
    <style jsx>{`
      .button {
        ${cssHelperButtonReset}
        position: relative;
        padding: ${size === ButtonSize.Default ? "1.2rem" : "0.2rem 0.4rem"};
        width: ${fullWidth ? "100%" : "initial"};
        color: ${disabled
          ? theme.color.brand.base
          : loading
          ? "transparent"
          : theme.color.text.overlay.base};
        border: 0.25rem solid transparent;
        border-radius: ${size === ButtonSize.Default
          ? "var(--border-radius-medium)"
          : "var(--border-radius-small)"};
        font-size: ${size === ButtonSize.Default ? "1rem" : "0.875rem"};
        font-weight: 600;
        background: ${disabled
          ? theme.color.background.disabled
          : loading
          ? theme.color.brand.faded
          : theme.color.brand.base};
        cursor: ${disabled || loading ? "not-allowed" : "pointer"};
      }
      .button:hover {
        border-color: ${disabled || loading
          ? "transparent"
          : "var(--color-brand-alt)"};
        color: ${disabled
          ? theme.color.text.overlay.alt2
          : loading
          ? "transparent"
          : theme.color.text.overlay.base};
      }
      .button:focus {
        border-color: ${loading || disabled
          ? "transparent"
          : "var(--color-brand-alt)"};
        box-shadow: ${disabled || loading ? "none" : theme.elevation.two.brand};
      }
      .button:focus:not(:focus-visible) {
        outline: none;
      }
      .button:focus:not(:-moz-focusring) {
        outline: none;
      }
      .button__loading-spinner {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    `}</style>
  );

  const handleOnClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  if (linkTo) {
    button = (
      <Link href={linkTo}>
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
