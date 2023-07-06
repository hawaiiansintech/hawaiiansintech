import { useUserSession } from "@/lib/hooks";
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
    <nav className="flex items-center bg-tan-300 px-2">
      <section className="flex grow items-center">
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
            { label: "Back to main site", url: "/" },
          ].map((link: { label: string; url: string }) => (
            <Link
              href={link.url}
              className="inline-flex items-center self-stretch px-2 text-xs font-semibold text-stone-600 hover:bg-tan-400 hover:text-stone-700 active:bg-tan-500"
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
          variant={isLoggedIn ? ButtonVariant.Secondary : ButtonVariant.Primary}
          onClick={isLoggedIn ? handleLogOut : handleLogIn}
        >
          {isLoggedIn ? "Log Out" : "Log in"}
        </Button>
      </section>
    </nav>
  );
}
