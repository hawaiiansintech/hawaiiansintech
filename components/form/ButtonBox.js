import { toKebab } from "../../helpers.js";
import { cssHelperButtonReset } from "../../styles/global.js";

export default function ButtonBox({
  border,
  defaultChecked,
  description,
  horizontal,
  label,
  seriesOf,
  small,
  fullHeight,
}) {
  const labelKebab = toKebab(label);
  return (
    <button
      id={labelKebab}
      value={labelKebab}
      className="button-box"
      style={{ height: fullHeight && "100%" }}
    >
      {label}
      <style jsx>{`
        .button-box {
          --button-box-padding: ${small ? "1rem" : "2rem"};
          ${cssHelperButtonReset}
          position: relative;
          background: var(--color-border);
          font-size: ${small ? "1rem" : "1.8rem"};
          font-weight: 600;
          line-height: 120%;
          margin: 0;
          height: ${horizontal && "100%"};
          border-radius: var(--border-radius-medium);
          text-align: center;
          padding: var(--button-box-padding);
          transition: color 150ms ease-out;
        }
        .button-box:hover {
          color: var(--color-brand);
        }
        .button-box:active {
          color: var(--color-brand-tone);
        }
        .button-box:focus {
          box-shadow: var(--box-shadow-outline-button);
        }
      `}</style>
    </button>
  );
}
