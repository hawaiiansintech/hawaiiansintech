import { cn } from "helpers";
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
  loading,
  onClick,
  size = ButtonSize.Default,
  variant = ButtonVariant.Primary,
  type,
}: ButtonProps) {
  const handleOnClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };
  return (
    <button
      type={type}
      className={cn(
        `relative
        rounded-lg
        border-8
        border-transparent
        bg-brown-600
        px-4
        py-2
        text-xl
        font-semibold
        tracking-wide
        text-white
        transition-all
        hover:border-brown-700/40
        focus:ring-8
        focus:ring-brown-500/30
        active:border-transparent
        `,
        disabled &&
          "cursor-not-allowed bg-tan-300 text-stone-700 opacity-50 ring-0 hover:border-transparent",
        fullWidth && "w-full",
        loading &&
          "cursor-progress border-transparent bg-brown-600/25 text-transparent hover:border-transparent",
        variant === ButtonVariant.Secondary &&
          "bg-tan-300 text-stone-700 hover:border-tan-500/20 hover:text-stone-900 focus:ring-tan-400/20",
        size === ButtonSize.Small &&
          "rounded-md px-4 py-2 text-base tracking-normal"
      )}
      onClick={handleOnClick}
      disabled={disabled || loading}
    >
      {children}
      {loading && (
        <div
          className={`
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
          `}
        >
          <LoadingSpinner />
        </div>
      )}
    </button>
  );
}
