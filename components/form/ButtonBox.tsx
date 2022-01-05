import { toKebab } from "../../helpers.js";
import { cssHelperButtonReset } from "../../styles/global.js";

interface ButtonBoxProps {
  border?: boolean;
  badgeNumber?: string | number;
  disabled?: boolean;
  label: string;
  onClick?: (e: React.MouseEvent) => any;
  fullWidth?: boolean;
  selected?: boolean;
  small?: boolean;
}

export default function ButtonBox(props: ButtonBoxProps) {
  const labelKebab = toKebab(props.label);
  return (
    <button
      id={labelKebab}
      value={labelKebab}
      className="button-box"
      onClick={props.onClick}
      tabIndex={props.disabled ? -1 : undefined}
    >
      {props.label}
      {props.badgeNumber && <span>{props.badgeNumber}</span>}
      <style jsx>{`
        .button-box {
          ${cssHelperButtonReset}
          position: relative;
          border: ${props.small ? "0.125rem" : "0.25rem"} solid transparent;
          background: ${props.selected
            ? "var(--color-brand)"
            : props.border
            ? "initial"
            : "var(--color-border)"};
          border-color: ${props.border ? "var(--color-border)" : "transparent"};
          color: ${props.selected ? "var(--color-text--overlay)" : "initial"};
          width: ${props.fullWidth ? "100%" : "initial"};
          opacity: ${props.disabled ? "0.5" : "initial"};
          pointer-events: ${props.disabled ? "none" : "initial"};
          font-size: ${props.small ? "1rem" : "1rem"};
          font-weight: 600;
          line-height: 120%;
          margin: 0;
          height: 100%;
          border-radius: ${props.small
            ? "var(--border-radius-small)"
            : "var(--border-radius-medium)"};
          text-align: center;
          padding: ${props.small ? "0.25rem 0.5rem" : "0.5rem 0.75rem"};
          transition: all 150ms ease-out;
        }
        .button-box:hover {
          border-color: ${props.selected
            ? "var(--color-brand-alt)"
            : "var(--color-border-alt)"};
        }
        .button-box:focus {
          border-color: ${props.selected
            ? "var(--color-brand-alt)"
            : "var(--color-border-alt)"};
          box-shadow: ${props.small
            ? "var(--box-shadow-outline-button-small)"
            : "var(--box-shadow-outline-button)"};
        }
        .button-box:focus:hover {
          border-color: ${props.selected
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
          background: var(--color-brand-alt);
          color: var(--color-text--overlay);
        }
      `}</style>
    </button>
  );
}
