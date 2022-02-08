import { toKebab } from "../../helpers.js";
import { cssHelperButtonReset } from "../../styles/global.js";

export enum SelectableVariant {
  Primary = "primary",
  Alt = "alt",
}

interface SelectableProps {
  border?: boolean;
  badgeNumber?: string | number;
  centered?: boolean;
  disabled?: boolean;
  groupedBy?: string;
  headline: string;
  byline?: string;
  onClick?: (e: React.MouseEvent) => any;
  onClear?: (e: React.MouseEvent) => any;
  fullWidth?: boolean;
  selected?: boolean;
  value?: string;
  variant?: SelectableVariant;
}

export default function Selectable({
  badgeNumber,
  byline,
  centered,
  disabled,
  groupedBy,
  headline,
  onClick,
  onClear,
  fullWidth,
  selected,
  value,
  variant = SelectableVariant.Primary,
}: SelectableProps) {
  const headlineKebab = value ? toKebab(headline) : undefined;
  return (
    <button
      id={value || headlineKebab}
      value={value || headlineKebab}
      className="button-box"
      onClick={onClick}
      tabIndex={disabled ? -1 : undefined}
      type="button"
    >
      <input
        value={value || headlineKebab}
        type="checkbox"
        checked={selected}
        name={groupedBy}
        readOnly
      />
      <h4>{headline}</h4>
      {byline ? <h6>{byline}</h6> : null}
      {badgeNumber ? <span>{badgeNumber}</span> : null}
      {onClear ? <span onClick={onClear}>×</span> : null}
      <style jsx>{`
        .button-box {
          ${cssHelperButtonReset}
          display: flex;
          align-items: ${centered ? "center" : "flex-end"};
          position: relative;
          border: 0.25rem solid transparent;
          overflow-wrap: anywhere;
          min-height: 4rem;
          line-height: 120%;
          margin: 0;
          height: 100%;
          border-radius: var(--border-radius-medium);
          text-align: ${centered ? "center" : "left"};
          padding: 0.5rem 0.75rem;
          transition: all 150ms ease-out;
          background: ${selected
            ? variant === SelectableVariant.Alt
              ? "var(--color-border-alt-2)"
              : "var(--color-brand)"
            : variant === SelectableVariant.Alt
            ? "var(--color-border-alt)"
            : "var(--color-border)"};
          border-color: ${selected
            ? variant === SelectableVariant.Alt
              ? "var(--color-border-alt-3)"
              : "var(--color-brand-alt)"
            : "transparent"};
          width: ${fullWidth ? "100%" : "initial"};
          opacity: ${disabled ? "0.5" : "initial"};
          pointer-events: ${disabled ? "none" : "initial"};
        }
        .button-box:after {
          content: "";
          display: block;
          align-self: flex-end;
          width: 1rem;
          height: 1rem;
          margin-left: 0.5rem;
          border-radius: var(--border-radius-x-small);
          flex-shrink: 0;
          border-style: ${variant === SelectableVariant.Alt ? "none" : "solid"};
          border-width: ${selected ? "0.35rem" : "0.2rem"};
          border-color: ${selected
            ? "var(--color-brand-alt)"
            : "var(--color-border-alt)"};
          background: ${selected && variant !== SelectableVariant.Alt
            ? "#fff"
            : "transparent"};
        }
        .button-box:hover {
          border-color: ${selected
            ? variant === SelectableVariant.Alt
              ? "var(--color-border-alt-3)"
              : "var(--color-brand-alt)"
            : variant === SelectableVariant.Alt
            ? "var(--color-border-alt-2)"
            : "var(--color-border-alt)"};
        }
        .button-box:focus {
          border-color: ${selected
            ? variant === SelectableVariant.Alt
              ? "var(--color-border-alt-2)"
              : "var(--color-brand-alt)"
            : variant === SelectableVariant.Alt
            ? "var(--color-border-alt-2)"
            : "var(--color-border-alt)"};
          box-shadow: ${selected
            ? "var(--box-shadow-outline-button)"
            : "var(--box-shadow-outline-button-alt)"};
        }
        input {
          position: absolute;
          left: -9999px;
        }
        h4 {
          flex-grow: 1;
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: ${selected ? "var(--color-text-overlay)" : "initial"};
        }
        h6 {
          margin: 0.125rem 0 0;
          font-size: 0.75rem;
          font-weight: 400;
          color: ${selected
            ? "var(--color-text-overlay-alt)"
            : "var(--color-text-alt)"};
        }
        span {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(0.7rem, -0.7rem);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 1.4rem;
          width: 1.4rem;
          border-radius: 0.7rem;
          line-height: 1;
          font-size: 0.8em;
          background: ${selected
            ? variant === SelectableVariant.Alt
              ? "var(--color-border-alt-3)"
              : "var(--color-brand-alt)"
            : "var(--color-border-alt-2)"};
          color: var(--color-text-overlay);
        }
      `}</style>
    </button>
  );
}

interface SelectableGridProps {
  children?: React.ReactNode;
  columns?: number;
}

export function SelectableGrid({ children, columns = 3 }: SelectableGridProps) {
  return (
    <div className="selectable-grid">
      <div
        className="selectable-grid__container"
        style={{ gridTemplateColumns: `${"1fr ".repeat(columns)}` }}
      >
        {children}
      </div>
      <style jsx>{`
        .selectable-grid {
          background: var(--color-background-alt-2);
          border-radius: var(--border-radius-large);
          padding: 0.5rem;
        }
        .selectable-grid__container {
          display: grid;
          grid-auto-rows: 1fr;
          grid-column-gap: 0.5rem;
          grid-row-gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}
