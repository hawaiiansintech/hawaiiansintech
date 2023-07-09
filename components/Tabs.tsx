import { cn } from "helpers";

export type TabsProps = {
  items: Array<{
    label: string | React.ReactNode;
    onClick: () => void;
    selected?: boolean;
  }>;
};

export default function Tabs({ items }: TabsProps) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-tan-500/50 p-1">
      {items.map((item, i) => (
        <button
          key={`pill-${i}`}
          className={cn(
            `rounded-full
            px-3
            py-1
            text-sm
            font-medium
            leading-tight
            text-tan-900
            transition-all
            hover:bg-tan-400/70`,
            item.selected && "bg-white text-stone-900 hover:bg-white"
          )}
          onClick={items[i].onClick}
        >
          {items[i].label}
        </button>
      ))}
    </div>
  );
}
