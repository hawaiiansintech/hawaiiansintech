import Link from "next/link";
import theme from "styles/theme";
import { cssHelperButtonReset } from "../styles/global";
import LoadingSpinner from "./LoadingSpinner";

export enum ButtonVariant {
  Primary = "primary",
  Secondary = "secondary",
}

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
  variant?: ButtonVariant;
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
  variant = ButtonVariant.Primary,
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
        padding: ${size === ButtonSize.Default ? "1.2rem" : "0.4rem 0.8rem"};
        width: ${fullWidth ? "100%" : "initial"};
        color: ${disabled
          ? theme.color.text.alt2
          : loading
          ? "transparent"
          : theme.color.text.overlay.base};
        border: 0.25rem solid transparent;
        color: ${variant === ButtonVariant.Secondary
          ? theme.color.text.base
          : disabled
          ? theme.color.text.alt2
          : loading
          ? "transparent"
          : theme.color.text.overlay.base};
        border-radius: ${size === ButtonSize.Default
          ? theme.borderRadius.md
          : theme.borderRadius.sm};
        font-size: ${size === ButtonSize.Default ? "1rem" : "0.875rem"};
        font-weight: 600;
        background: ${variant === ButtonVariant.Secondary
          ? theme.color.background.alt
          : disabled
          ? theme.color.background.disabled
          : loading
          ? theme.color.brand.alpha
          : theme.color.brand.base};
        color: ${variant === ButtonVariant.Secondary
          ? theme.color.text.base
          : disabled
          ? theme.color.text.alt2
          : loading
          ? "transparent"
          : theme.color.text.overlay.base};
        cursor: ${disabled || loading ? "not-allowed" : "pointer"};
      }
      .button:hover {
        border-color: ${variant === ButtonVariant.Secondary
          ? theme.color.border.alt
          : disabled || loading
          ? "transparent"
          : theme.color.brand.alt};
        color: ${variant === ButtonVariant.Secondary
          ? theme.color.text.base
          : disabled
          ? theme.color.text.alt2
          : loading
          ? "transparent"
          : theme.color.text.overlay.base};
      }
      .button:focus {
        border-color: ${variant === ButtonVariant.Secondary
          ? theme.color.border.alt2
          : loading || disabled
          ? "transparent"
          : theme.color.brand.alt};
        box-shadow: ${variant === ButtonVariant.Secondary || disabled || loading
          ? "none"
          : theme.elevation.two.brand};
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
