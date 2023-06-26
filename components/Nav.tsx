import HitLogo from "@/components/HitLogo";
import { Icon, IconAsset, IconColor } from "@/components/icon/icon";
import Link from "next/link";

interface NavProps {
  backUrl?: string;
  children?: React.ReactNode;
  primaryNav?: {
    show?: boolean;
  };
}

export default function Nav({ backUrl, children, primaryNav }: NavProps) {
  let logo = <HitLogo inline />;
  if (backUrl) {
    logo = (
      <a
        href={"/"}
        className="transition-transform hover:scale-105 active:scale-95"
      >
        {logo}
      </a>
    );
  }
  return (
    <header className="flex w-full items-center justify-between gap-4 p-4 sm:pl-8">
      <nav className="nav__menu">
        <div style={{ display: "flex", alignItems: "center" }}>
          {backUrl ? (
            <Link href={backUrl} shallow={true}>
              <div className="transition-transform hover:scale-105 active:scale-95">
                <Icon asset={IconAsset.CaretLeft} color={IconColor.Inherit} />
              </div>
            </Link>
          ) : null}
          {primaryNav?.show ? (
            <div className="flex items-center gap-4 sm:gap-8">
              <Link
                className="text-base font-medium text-stone-700"
                href="/about"
              >
                About
              </Link>
              <Link
                className={`
                  rounded-lg
                  border-4
                  border-tan-300
                  bg-tan-300
                  px-4
                  py-2
                  text-base
                  font-medium
                  text-stone-700
                  transition-all
                  hover:scale-105
                  hover:border-brown-700/80
                  hover:bg-brown-600
                  hover:text-white
                  active:scale-95
                `}
                href="/join/01-you"
              >
                Join the list
              </Link>
              <Link
                className="text-base font-medium text-stone-700"
                href="/edit"
              >
                Request Changes
              </Link>
              <Link href="/hackathon" className="font-script text-2xl">
                Hackathon
              </Link>
            </div>
          ) : null}
        </div>
      </nav>
      {children ? <div className="nav__main">{children}</div> : null}
      {logo}
    </header>
  );
}
