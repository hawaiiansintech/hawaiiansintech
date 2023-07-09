import { cn } from "helpers";

export enum TagVariant {
  Primary = "primary",
  Alert = "alert",
  Success = "success",
  NearSuccess = "non-success",
  Warn = "warn",
}

interface TagProps {
  children?: React.ReactNode;
  label?: string;
  variant?: TagVariant;
}

export default function Tag({
  children,
  label,
  variant = TagVariant.Primary,
}: TagProps) {
  return (
    <span
      className={cn(
        `
        font-base
        flex
        items-center
        gap-1
        rounded-full
        bg-brown-500/20
        px-1
        py-0.5
        text-xs
        leading-none
        tracking-wider
        text-brown-600
        `,
        variant === TagVariant.Alert &&
          `bg-red-500/10 bg-gradient-to-br from-red-500/10 to-red-500/60 text-red-800`,
        variant === TagVariant.Success &&
          `bg-emerald-500/10 bg-gradient-to-br from-emerald-500/10 to-emerald-500/60 text-emerald-800`,
        variant === TagVariant.NearSuccess &&
          `bg-violet-500/10 bg-gradient-to-br from-violet-500/10 to-violet-500/60 text-violet-800`,
        variant === TagVariant.Warn &&
          `bg-amber-500/10 bg-gradient-to-br from-amber-500/10 to-amber-500/60 text-amber-800`
      )}
    >
      {children ? children : null}
      {label ? label : null}
    </span>
  );
}
