import { toKebab } from "../../helpers.js";
import { cssHelperButtonReset } from "../../styles/global.js";

export default function ButtonBox({
  border,
  defaultChecked,
  description,
  disabled,
  label,
  onClick,
  fullHeight,
  fullWidth,
  selected,
}) {
  const labelKebab = toKebab(label);
  return (
    <button
      id={labelKebab}
      value={labelKebab}
      className="button-box"
      onClick={onClick}
      tabIndex={disabled && "-1"}
    >
      {label}
      <style jsx>{`
        .button-box {
          ${cssHelperButtonReset}
          position: relative;
          border: 0.25rem solid transparent;
          ${border || "background: var(--color-border);"};
          ${border ? "border-color: var(--color-border);" : ""}
          ${selected ? "background: var(--color-brand);" : ""}
          ${selected ? "color: #fff;" : ""}
          ${fullWidth ? "width: 100%;" : ""}
          ${fullHeight ? "height: 100%;" : ""}
          font-size: 1rem;
          font-weight: 600;
          line-height: 120%;
          margin: 0;
          height: 100%;
          border-radius: var(--border-radius-medium);
          text-align: center;
          padding: 1rem;
          transition: all 150ms ease-out;
          ${disabled && "opacity: 0.5; pointer-events: none;"}
        }
        .button-box:hover {
          border-color: var(--color-brand);
        }
        .button-box:active {
          color: var(--color-brand-tone);
        }
        .button-box:focus {
          border-color: var(--color-brand);
          box-shadow: var(--box-shadow-outline-button);
        }
      `}</style>
    </button>
  );
}
