import { Icon, IconAsset, IconColor } from "@/components/icon/icon";
import Logo from "@/components/Logo";
import Link from "next/link";

interface NavProps {
  backUrl?: string;
  children?: React.ReactNode;
  primaryNav?: {
    show?: boolean;
  };
}

export default function Nav({ backUrl, children, primaryNav }: NavProps) {
  let logo = <Logo />;
  if (backUrl) {
    logo = (
      <Link
        href={"/"}
        className="transition-transform hover:scale-105 active:scale-95"
      >
        {logo}
      </Link>
    );
  }
  return (
    <header className="flex w-full items-center justify-between gap-4 p-4 sm:pl-8">
      <nav className="flex items-center">
        {backUrl ? (
          <Link href={backUrl} shallow={true}>
            <div className="transition-transform hover:scale-105 active:scale-95">
              <Icon asset={IconAsset.CaretLeft} color={IconColor.Inherit} />
            </div>
          </Link>
        ) : null}
        {primaryNav?.show ? (
          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-8">
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
                  px-2
                  py-0.5
                  text-base
                  font-medium
                  text-stone-700
                  transition-all
                  hover:scale-105
                  hover:border-brown-700/80
                  hover:bg-brown-600
                  hover:text-white
                  active:scale-95
                  sm:px-4
                  sm:py-2
                `}
              href="/join/01-you"
            >
              Join the list
            </Link>
            <Link className="text-base font-medium text-stone-700" href="/edit">
              Request Changes
            </Link>
            <Link href="/hackathon" className="font-script text-2xl">
              Hackathon
            </Link>
          </div>
        ) : null}
      </nav>
      {children ? <div>{children}</div> : null}
      {logo}
    </header>
  );
}
