import { useUserSession } from "@/lib/hooks";
import { cn } from "helpers";
import Link from "next/link";
import Button, { ButtonSize, ButtonVariant } from "../Button";
import Logo, { LogoSize } from "../Logo";

type AdminNavProps = {
  handleLogOut: () => any;
  handleLogIn: () => any;
  name?: string;
};

export default function AdminNav({
  handleLogOut,
  handleLogIn,
  name,
}: AdminNavProps) {
  const { isLoggedIn } = useUserSession();

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="flex h-12 w-full items-center bg-tan-300 px-2">
        <section className="flex h-full grow items-center">
          <Link
            href={isLoggedIn ? "/admin" : "/"}
            className="px-1 py-0.5 transition-transform active:scale-90"
          >
            <Logo size={LogoSize.Small} />
          </Link>
          {isLoggedIn &&
            [
              { label: "Dashboard", url: "/admin" },
              { label: "Email List", url: "/admin/emails" },
              { label: "Back to main site", url: "/", small: true },
            ].map((link: { label: string; url: string; small?: boolean }) => (
              <Link
                href={link.url}
                className={cn(
                  `inline-flex
                items-center
                self-stretch
                px-2
                text-sm
                font-semibold
                text-stone-600
                hover:bg-tan-400
                hover:text-stone-700
                active:bg-tan-500`,
                  link.small && `text-xs`
                )}
                key={`admin-nav-link-${link.url}`}
              >
                {link.label}
              </Link>
            ))}
        </section>
        <section className="flex items-center gap-2">
          {isLoggedIn && <h1 className="text-sm leading-none">{name}</h1>}
          <Button
            size={ButtonSize.XSmall}
            variant={
              isLoggedIn ? ButtonVariant.Secondary : ButtonVariant.Primary
            }
            onClick={isLoggedIn ? handleLogOut : handleLogIn}
          >
            {isLoggedIn ? "Log Out" : "Log in"}
          </Button>
        </section>
      </div>
    </nav>
  );
}
