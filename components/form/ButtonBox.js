import { toKebab } from "../../helpers.js";
import { cssHelperButtonReset } from "../../styles/global.js";

export default function ButtonBox({
  border,
  disabled,
  label,
  onClick,
  fullWidth,
  selected,
}) {
  const labelKebab = label ? toKebab(label) : "";
  return (
    <button
      id={labelKebab}
      value={labelKebab}
      className="button-box"
      onClick={onClick}
      tabIndex={disabled ? "-1" : undefined}
    >
      {label}
      <style jsx>{`
        .button-box {
          ${cssHelperButtonReset}
          position: relative;
          border: 0.25rem solid transparent;
          background: ${selected
            ? "var(--color-brand)"
            : border
            ? "initial"
            : "var(--color-border)"};
          border-color: ${border ? "var(--color-border)" : "transparent"};
          color: ${selected ? "var(--color-text--overlay)" : "initial"};
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
          padding: 1rem;
          transition: all 150ms ease-out;
        }
        .button-box:hover {
          border-color: ${selected
            ? "var(--color-brand-tone)"
            : "var(--color-brand)"};
        }
        .button-box:focus {
          border-color: ${selected
            ? "var(--color-brand-tone)"
            : "var(--color-brand)"};
          box-shadow: var(--box-shadow-outline-button);
        }
        .button-box:focus:hover {
          border-color: var(--color-brand-tone);
        }
      `}</style>
    </button>
  );
}
