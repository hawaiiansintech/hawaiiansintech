import Link from "next/link";
import Button, { ButtonSize, ButtonVariant } from "../Button";
import Logo, { LogoSize } from "../Logo";

type AdminNavProps = {
  handleLogOut: () => any;
  handleLogIn: () => any;
  isLoggedIn: boolean;
  name?: string;
};

export default function AdminNav({
  handleLogOut,
  handleLogIn,
  isLoggedIn,
  name,
}: AdminNavProps) {
  return (
    <nav className="flex items-center bg-tan-300 p-1 pr-2">
      <section className="flex grow items-center gap-2">
        <Link href={"/"}>
          <Logo size={LogoSize.Small} />
        </Link>
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
