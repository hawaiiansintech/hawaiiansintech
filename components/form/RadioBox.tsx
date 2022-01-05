import { toKebab } from "../../helpers.js";

interface RadioBoxProps {
  defaultChecked?: boolean;
  description?: React.ReactNode;
  label?: string;
  onChange?: () => void;
  seriesOf?: string;
  small?: string;
  fullHeight?: string;
}

export default function RadioBox(props: RadioBoxProps) {
  const labelKebab = toKebab(props.label);
  return (
    <div className="radio-box" style={{ height: props.fullHeight && "100%" }}>
      <input
        id={labelKebab}
        value={labelKebab}
        type="radio"
        name={props.seriesOf}
        onChange={props.onChange}
        defaultChecked={props.defaultChecked}
      />
      <label htmlFor={labelKebab}>
        <h3>{props.label}</h3>
      </label>
      <style jsx>{`
        .radio-box {
          position: relative;
        }
        input {
          position: absolute;
          left: -9999px;
        }
        label {
          display: block;
          border: 0.25rem solid var(--color-brand-alt);
          background: var(--color-brand);
          color: var(--color-text--overlay);
          margin: 0;
          border-radius: var(--border-radius-small);
          text-align: center;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          transition: all 150ms ease-out;
        }
        input:not(:checked) + label {
          background: var(--color-border);
          border-color: transparent;
          color: initial;
        }
        label:hover {
          border-color: var(--color-brand-alt);
        }
        input:not(:checked) + label:hover {
          border-color: var(--color-border-alt);
        }
        input:focus + label {
          border-color: var(--color-brand-alt);
          box-shadow: var(--box-shadow-outline-button-small);
        }
        input:not(:checked) + label:focus {
          border-color: var(--color-border-alt);
        }
        label:focus:hover {
          border-color: var(--color-brand-alt);
        }
        input:not(:checked) + label:focus:hover {
          border-color: var(--color-border-alt);
        }
        h3 {
          font-size: 1rem;
          font-weight: 600;
          line-height: 120%;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
