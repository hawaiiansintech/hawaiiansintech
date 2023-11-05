import { cn } from "@/lib/utils";

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
          size === LogoSize.Small && "w-10 sm:w-10",
        )}
        src={"/images/HitLogoNoBackground.png"}
        alt="Hawaiians in Tech logo"
      />
    </>
  );
}
