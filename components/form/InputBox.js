import { toKebab } from "../../helpers.js";
import { cssHelperButtonReset } from "../../styles/global.js";

export default function InputBox({
  border,
  disabled,
  focusedOnInit,
  defaultValue,
  label,
  onBlur,
  onChange,
  fullWidth,
  selected,
  value,
}) {
  const labelKebab = label ? toKebab(label) : "";
  return (
    <div className="input-box">
      <input
        autoFocus={focusedOnInit}
        onBlur={onBlur}
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
      />
      <style jsx>{`
        .input-box {
          height: 100%;
        }
        input {
          position: relative;
          border: 0.25rem solid transparent;
          ${border || "background: var(--color-border);"};
          ${border ? "border-color: var(--color-border);" : ""}
          ${selected ? "background: var(--color-brand);" : ""}
          ${selected ? "color: #fff;" : ""}
          ${fullWidth ? "width: 100%;" : ""}
          height: 100%;
          font-size: 1rem;
          font-weight: 600;
          line-height: 120%;
          margin: 0;
          border-radius: var(--border-radius-medium);
          text-align: center;
          padding: 1rem;
          transition: all 150ms ease-out;
          ${disabled && "opacity: 0.5; pointer-events: none;"}
        }
        .input-box:hover {
          border-color: var(--color-brand);
        }
        .input-box:active {
          color: var(--color-brand-alt);
        }
        .input-box:focus {
          border-color: var(--color-brand);
          box-shadow: var(--box-shadow-outline-button);
        }
      `}</style>
    </div>
  );
}
