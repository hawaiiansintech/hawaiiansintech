import { cn } from "helpers";

export enum LogoSize {
  Default = "default",
  Small = "small",
}

interface LogoProps {
  size?: LogoSize;
}

export default function Logo({ size = LogoSize.Default }: LogoProps) {
  return (
    <>
      <img
        className={cn(
          `
          h-auto
          w-16
          sm:w-24
        `,
          size === LogoSize.Small && "w-8 sm:w-8"
        )}
        src={"/images/HitLogoNoBackground.png"}
        alt="Hawaiians in Tech logo"
      />
    </>
  );
}
