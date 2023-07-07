import { cn } from "helpers";

export enum TagVariant {
  Primary = "primary",
  Alert = "alert",
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
        rounded
        bg-brown-600
        px-1
        py-0.5
        text-xs
        leading-none
        tracking-wider
        text-white
        `,
        variant === TagVariant.Alert && `bg-red-600`
      )}
    >
      {children ? children : null}
      {label ? label : null}
    </span>
  );
}
