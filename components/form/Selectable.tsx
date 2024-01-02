import { toKebab } from "../../helpers";
import { cn } from "@/lib/utils";

export enum SelectableVariant {
  Checkbox = "checkbox",
  Blank = "blank",
}
export enum SelectableSize {
  Default = "default",
  Large = "large",
}

interface SelectableProps {
  border?: boolean;
  centered?: boolean;
  disabled?: boolean;
  gridSpan?: number;
  fullWidth?: boolean;
  headline: string;
  onClear?: (e: React.MouseEvent) => any;
  onClick?: (e: React.MouseEvent) => any;
  count?: string | number;
  selected?: boolean;
  size?: SelectableSize;
  value?: string;
  variant?: SelectableVariant;
}

export default function Selectable({
  centered,
  disabled,
  gridSpan,
  headline,
  onClick,
  onClear,
  fullWidth,
  count,
  selected,
  size,
  value,
  variant = SelectableVariant.Checkbox,
}: SelectableProps) {
  const headlineKebab = value ? toKebab(headline) : undefined;
  return (
    <button
      id={value || headlineKebab}
      value={value || headlineKebab}
      onClick={onClick}
      tabIndex={disabled ? -1 : undefined}
      type="button"
      className={cn(
        `
        relative
        flex
        h-full
        items-end
        break-words
        rounded-lg
        border-4
        border-tan-300
        bg-tan-300
        px-2
        py-1
        text-left
        leading-tight
        transition-all
        after:ml-2
        after:block
        after:h-4
        after:w-4
        after:shrink-0
        after:self-end
        after:rounded
        after:border-4
        after:border-tan-400
        after:transition-all
        after:content-['']
        hover:border-tan-500/50
        hover:after:border-tan-500/50
      `,
        selected &&
          `border-brown-700/50
          bg-brown-600
          after:border-4
          after:border-brown-700
          after:bg-white
          hover:border-brown-700
          hover:after:border-brown-800
          sm:after:border-6
          `,
        centered && "items-center text-center after:self-center",
        fullWidth && "w-full",
        disabled &&
          "cursor-not-allowed opacity-50 ring-0 hover:border-transparent",
        variant === SelectableVariant.Blank && "before:hidden after:hidden",
        size === SelectableSize.Large && "px-3 py-2",
      )}
      style={gridSpan ? { gridColumn: `span ${gridSpan}` } : {}}
      disabled={disabled}
    >
      <h4
        className={cn(
          `m-0
          grow
          font-semibold
          transition-all`,
          selected && "text-white",
        )}
      >
        {headline}
      </h4>
      {count ? (
        <span
          className={cn(
            `
            ml-2
            rounded-xl
            bg-tan-400
            px-2
            py-0.5
            text-xs
            font-semibold
            text-stone-700
            transition-all
          `,
            selected && "bg-brown-700 text-white",
          )}
        >
          {count}
        </span>
      ) : (
        <></>
      )}
      {onClear ? (
        <span
          className={`
            absolute
            right-0
            top-0
            flex
            h-5
            w-5
            -translate-y-1/2
            translate-x-1/2
            items-center
            justify-center
            rounded-full
            bg-brown-800
            text-white
            before:absolute
            before:block
            before:h-3
            before:w-0.5
            before:rotate-45
            before:rounded
            before:bg-white
            before:content-[""]
            after:absolute
            after:block
            after:h-3
            after:w-0.5
            after:-rotate-45
            after:rounded
            after:bg-white
            after:content-[""]
            hover:bg-brown-900
          `}
          onClick={onClear}
        />
      ) : null}
    </button>
  );
}

interface SelectableGridProps {
  children?: React.ReactNode;
  columns?: number;
}

export function SelectableGrid({ children, columns = 3 }: SelectableGridProps) {
  return (
    <div className="rounded-xl bg-tan-400 p-2">
      <div
        className="grid auto-rows-fr gap-2"
        style={{ gridTemplateColumns: `${"1fr ".repeat(columns)}` }}
      >
        {children}
      </div>
    </div>
  );
}
