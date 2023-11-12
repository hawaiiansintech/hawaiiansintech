import { cn } from "@/lib/utils";

interface BigPillProps {
  children?: React.ReactNode;
  onClick?: () => {};
}

export default function BigPill({ children, onClick }: BigPillProps) {
  return (
    <button
      className={cn(`
        flex
        items-center
        gap-2
        overflow-hidden
        rounded-full
        border-4
        border-transparent
        bg-stone-700
        py-1
        pl-4
        pr-3
        font-medium
        tracking-tight
        text-white
        transition-all
        after:text-lg
        after:font-semibold
        after:text-white/50
        after:transition-all
        after:content-['×']
        hover:border-stone-800
        hover:after:text-white/70
      `)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
