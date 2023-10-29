import { cn } from "@/lib/utils";

export enum LoadingSpinnerVariant {
  Default = "default",
  Invert = "invert",
}

interface LoadingSpinnerProps {
  className?: string;
  variant?: LoadingSpinnerVariant;
}

export default function LoadingSpinner({
  className,
  variant = LoadingSpinnerVariant.Default,
}: LoadingSpinnerProps) {
  return (
    <figure
      className={cn(
        `
        inline-block
        h-6
        w-6
        animate-spin
        rounded-full
        border-4
        border-white/50
        border-t-white
      `,
        variant === LoadingSpinnerVariant.Invert &&
          `border-brown-600/20 border-t-brown-600`,
        className,
      )}
    />
  );
}
