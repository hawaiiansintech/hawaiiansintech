import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MenuIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  NavAppearance,
  NavigationData,
  NavigationSection,
  NavigationItem,
  generateNavUrl,
} from "./Nav";

interface MobileNavProps {
  navigation: NavigationData;
}

export function MobileNav({ navigation }: MobileNavProps) {
  const [activeSection, setActiveSection] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setActiveSection(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="rounded-md p-2 hover:bg-muted/20">
          <div className="relative size-6">
            <X
              className={cn(
                "absolute top-1/2 size-5 -translate-y-1/2 transition-all",
                open ? "opacity-100" : "rotate-90 opacity-0",
              )}
            />

            <MenuIcon
              className={cn(
                "absolute top-1/2 size-6 -translate-y-1/2 transition-all",
                open ? "-rotate-90 opacity-0" : "rotate-0 opacity-100",
              )}
            />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[calc(100vw-2rem)] max-w-80 overflow-hidden rounded-xl border-none p-2",
        )}
        align="end"
        side="top"
        sideOffset={20}
      >
        <AnimatePresence mode="wait">
          {activeSection === null ? (
            <motion.div
              key="main-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="flex flex-col gap-1"
            >
              {navigation?.items?.map(
                (section: NavigationSection, i: number) => (
                  <button
                    key={`section-${i}`}
                    onClick={() => setActiveSection(i)}
                    className={cn(
                      "flex items-center rounded-lg px-4 py-3 text-left hover:bg-muted/20",
                      section.variant === "accent" &&
                        "bg-gradient-to-br from-brown-600/5 to-brown-600/10 text-brown-600",
                    )}
                  >
                    <span className="grow text-sm font-medium">
                      {section.label}
                    </span>
                    <ChevronRight className="size-4" />
                  </button>
                ),
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`section-${activeSection}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="flex max-h-[calc(100vh-8rem)] flex-col gap-1 overflow-y-auto"
            >
              <button
                onClick={() => setActiveSection(null)}
                className="flex items-center gap-2 rounded-lg px-2 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/20 hover:text-foreground"
              >
                <ChevronLeft className="size-4" />
                Back to menu
              </button>

              {navigation?.items[activeSection]?.items.map(
                (item: NavigationItem, j: number) => (
                  <Link
                    key={`item-${activeSection}-${j}`}
                    href={
                      item.external
                        ? item.href
                        : generateNavUrl(item.href, NavAppearance.ToMin)
                    }
                    target={item.external ? "_blank" : undefined}
                    className={cn(
                      "flex items-start gap-3 rounded-md p-3 hover:bg-muted/20",
                      item.variant === "accent" &&
                        "border border-brown-600/20 hover:bg-brown-600/5",
                      item.featured &&
                        "bg-gradient-to-b from-muted/25 to-muted/50 hover:from-muted/60 hover:to-muted/60",
                    )}
                  >
                    {item.image && (
                      <div className="flex-shrink-0 overflow-hidden rounded">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={36}
                          height={36}
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">
                        {item.title}
                        {item.external && (
                          <ArrowUpRight className="relative -top-0.5 inline size-3.5 text-secondary-foreground opacity-50" />
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ),
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
