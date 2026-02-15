import * as React from "react";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { MobileNav } from "@/components/MobileNav";
import navigationData from "@/public/navigation.json";
import { ArrowUpRight } from "lucide-react";
import { Icon, IconAsset } from "./icon/icon";

interface NavProps {
  backLinkTo?: string;
  children?: React.ReactNode;
  variant?: "primary" | "minimized";
}

export interface NavigationItem {
  title: string;
  href: string;
  description?: string;
  image?: string;
  external?: boolean;
  featured?: boolean;
  variant?: string;
}

export interface NavigationSection {
  label: string;
  variant?: string;
  layout?: string;
  items: NavigationItem[];
}

export interface NavigationData {
  items: NavigationSection[];
}

export enum NavAppearance {
  ToShow = "to-show",
  ToMin = "to-min",
  ToFade = "to-fade",
}

const navLogoVariants = {
  floatLeft: { x: -40 },
  default: { x: 0 },
  fadeDefault: { x: 0, opacity: 0 },
};

export function generateNavUrl(href: string, appearance?: NavAppearance) {
  if (!appearance) return href;
  return `${href}?nav=${appearance}`;
}

export default function Nav({
  backLinkTo,
  children,
  variant = "primary",
}: NavProps) {
  const router = useRouter();
  const { nav } = router.query;

  const renderLogo = () => {
    const logo = <Logo />;
    if (!backLinkTo) return logo;

    return (
      <>
        <Link href={backLinkTo} shallow={true}>
          <div className="transition-transform hover:scale-105 active:scale-95">
            <Icon asset={IconAsset.CaretLeft} />
          </div>
        </Link>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={
            nav === NavAppearance.ToFade
              ? navLogoVariants.fadeDefault
              : navLogoVariants.default
          }
          initial={
            nav === NavAppearance.ToMin || nav === NavAppearance.ToFade
              ? navLogoVariants.floatLeft
              : navLogoVariants.default
          }
          href="/"
        >
          {logo}
        </motion.a>
      </>
    );
  };

  const renderNavItems = () => {
    if (variant !== "primary" || !navigationData) return null;

    const navigationItems = (
      <NavigationMenuList>
        {navigationData.items.map((section) => (
          <NavigationMenuItem key={section.label}>
            <NavigationMenuTrigger
              variant={section.variant as "default" | "accent"}
            >
              {section.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul
                className={cn(
                  "grid gap-1.5 p-3",
                  "md:w-[400px]",
                  section.layout === "3-column" &&
                    "lg:w-[780px] lg:grid-cols-[1fr_1fr_1fr]",
                )}
              >
                {section.items.map((item) =>
                  item.featured ? (
                    <li key={item.title} className="row-span-2">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/25 to-muted/50 p-3 no-underline outline-none hover:from-muted/60 hover:to-muted/60 focus:shadow-md"
                          href={generateNavUrl(item.href, NavAppearance.ToMin)}
                        >
                          <h6 className="mb-1 font-medium">{item.title}</h6>
                          <p className="text-sm leading-tight text-muted-foreground">
                            {item.description}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ) : (
                    <ListItem
                      key={item.title}
                      href={
                        item.external
                          ? item.href
                          : generateNavUrl(item.href, NavAppearance.ToMin)
                      }
                      title={item.title}
                      variant={item.variant}
                      target={item.external ? "_blank" : undefined}
                      image={
                        item.image && (
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={36}
                            height={36}
                          />
                        )
                      }
                    >
                      {item.description}
                    </ListItem>
                  ),
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    );

    return (
      <div className="flex grow items-center justify-end sm:justify-start">
        <div className="hidden sm:block">
          <NavigationMenu>{navigationItems}</NavigationMenu>
        </div>
        <div className="sm:hidden">
          <MobileNav navigation={navigationData} />
        </div>
      </div>
    );
  };

  return (
    <header className="flex w-full items-center justify-between gap-4 p-4 backdrop-blur-sm sm:gap-8 sm:pl-8">
      <nav
        className={cn(
          "flex w-full items-center gap-4",
          variant === "primary" && "md:gap-8",
        )}
      >
        {renderLogo()}
        {renderNavItems()}
      </nav>
      {children && (
        <div className="flex grow items-center gap-4">{children}</div>
      )}
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    variant?: "default" | "accent";
    image?: React.ReactNode;
    // target?: React.HTMLAttributeAnchorTarget;
  }
>(({ className, title, variant, children, image, ...props }, ref) => {
  const isExternal = props.target === "_blank";

  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "group flex select-none items-start gap-3 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted/20 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            variant === "accent" &&
              "border border-brown-600/20 hover:bg-brown-600/5",
            "max-w-[calc(100vw-2rem)] sm:max-w-none",
            className,
          )}
          target={props.target}
          {...props}
        >
          {image && (
            <div className="flex-shrink-0 overflow-hidden rounded">{image}</div>
          )}
          <div className="space-y-1">
            <div className="text-sm font-medium leading-none">
              {title}{" "}
              {isExternal && (
                <ArrowUpRight className="relative -top-0.5 inline size-3.5 text-secondary-foreground opacity-50 transition-opacity group-hover:opacity-100" />
              )}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
