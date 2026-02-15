import { cn } from "@/lib/utils";
import React from "react";
import { ExternalLink, Mails, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button, { ButtonSize, ButtonVariant } from "../Button";
import Logo, { LogoSize } from "../Logo";

function Admin({ children }: { children: React.ReactNode }) {
  return <div className="flex">{children}</div>;
}

function AdminBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("w-full", className)}>{children}</div>;
}

type AdminNavProps = {
  handleLogOut: () => void;
  handleLogIn: () => void;
  displayName?: string;
  isAdmin?: boolean;
  isLoggedIn?: boolean;
};

function AdminNav({
  handleLogOut,
  handleLogIn,
  displayName,
  isAdmin,
  isLoggedIn,
}: AdminNavProps) {
  return (
    <nav className="sticky top-0 h-[100vh] w-72 bg-tan-300 p-2">
      <div className="flex flex-col gap-1">
        <Link href={isLoggedIn ? "/admin" : "/"} className="mb-2 inline-flex">
          <Logo size={LogoSize.Small} />
        </Link>
        {isLoggedIn &&
          isAdmin &&
          [
            { label: "Members", url: "/admin/directory", icon: <Users /> },
            { label: "Email List", url: "/admin/emails", icon: <Mails /> },
            {
              label: "Back to main site",
              url: "/",
              targetBlank: true,
              small: true,
            },
          ].map((link: AdminNavLinkProps, i) => (
            <AdminNavLink
              label={link.label}
              url={link.url}
              icon={link.icon}
              small={link.small}
              targetBlank={link.targetBlank}
              key={`admin-nav-link-${link.url}-${i}`}
            />
          ))}
        <section className="flex items-center gap-2">
          {displayName && (
            <h1 className="text-sm leading-none">{displayName}</h1>
          )}
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

interface AdminNavLinkProps {
  label: string;
  url: string;
  icon?: React.ReactNode;
  small?: boolean;
  targetBlank?: boolean;
}

function AdminNavLink({
  label,
  url,
  icon,
  small,
  targetBlank,
}: AdminNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === url;

  return (
    <Link
      href={url}
      className={cn(
        "flex items-center gap-2 rounded-lg p-2 text-sm font-semibold text-stone-700 hover:bg-tan-500/20 hover:text-stone-900 hover:no-underline active:bg-brown-600/10",
        small && "text-xs",
        isActive &&
          "bg-brown-600/10 text-brown-600 hover:bg-brown-600/20 hover:text-brown-600",
      )}
      target={targetBlank ? "_blank" : undefined}
      key={`admin-nav-link-${url}`}
    >
      {icon}
      <span className="grow">{label}</span>
      {targetBlank && <ExternalLink width={16} height={16} />}
    </Link>
  );
}

Admin.Nav = AdminNav;
Admin.Body = AdminBody;

export default Admin;
