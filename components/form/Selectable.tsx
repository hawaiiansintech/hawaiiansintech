import { toKebab } from "../../helpers.js";
import { cssHelperButtonReset } from "../../styles/global.js";

export enum SelectableVariant {
  Primary = "primary",
  Alt = "alt",
}

interface SelectableProps {
  border?: boolean;
  badgeNumber?: string | number;
  disabled?: boolean;
  label: string;
  onClick?: (e: React.MouseEvent) => any;
  onClear?: (e: React.MouseEvent) => any;
  fullWidth?: boolean;
  selected?: boolean;
  variant?: SelectableVariant;
}

export default function Selectable({
  border,
  badgeNumber,
  disabled,
  label,
  onClick,
  onClear,
  fullWidth,
  selected,
  variant = SelectableVariant.Primary,
}: SelectableProps) {
  const labelKebab = toKebab(label);
  return (
    <button
      id={labelKebab}
      value={labelKebab}
      className="button-box"
      onClick={onClick}
      tabIndex={disabled ? -1 : undefined}
    >
      {label}
      {badgeNumber && <span>{badgeNumber}</span>}
      {onClear ? <span onClick={onClear}>×</span> : null}
      <style jsx>{`
        .button-box {
          ${cssHelperButtonReset}
          position: relative;
          border: 0.25rem solid transparent;
          background: ${selected
            ? "var(--color-brand)"
            : variant === SelectableVariant.Alt
            ? "var(--color-border-alt)"
            : "var(--color-border)"};
          border-color: ${border
            ? variant === SelectableVariant.Alt
              ? "var(--color-border-alt-2)"
              : "var(--color-border-alt)"
            : selected
            ? "var(--color-brand-alt)"
            : "transparent"};
          color: ${selected ? "var(--color-text-overlay)" : "initial"};
          width: ${fullWidth ? "100%" : "initial"};
          opacity: ${disabled ? "0.5" : "initial"};
          pointer-events: ${disabled ? "none" : "initial"};
          font-size: 1rem;
          font-weight: 600;
          line-height: 120%;
          margin: 0;
          height: 100%;
          border-radius: var(--border-radius-medium);
          text-align: center;
          padding: 0.5rem 0.75rem;
          transition: all 150ms ease-out;
        }
        .button-box:hover {
          border-color: ${selected
            ? "var(--color-brand-alt)"
            : border
            ? "var(--color-border-alt-2)"
            : "var(--color-border-alt)"};
        }
        .button-box:focus {
          border-color: ${selected
            ? "var(--color-brand-alt)"
            : "var(--color-border-alt)"};
          box-shadow: var(--box-shadow-outline-button);
        }
        .button-box:focus:hover {
          border-color: ${selected
            ? "var(--color-brand-alt)"
            : "var(--color-border-alt)"};
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
            ? "var(--color-brand-alt)"
            : "var(--color-border-alt-2)"};
          color: var(--color-text-overlay);
        }
      `}</style>
    </button>
  );
}
