import theme from "styles/theme";
import { toKebab } from "../../helpers";

interface RadioBoxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  description?: React.ReactNode;
  id?: string;
  label: string;
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
        id={props.id || labelKebab}
        value={props.id || labelKebab}
        type="radio"
        name={props.seriesOf}
        onChange={props.onChange}
        checked={props.checked}
        defaultChecked={props.defaultChecked}
      />
      <label htmlFor={props.id || labelKebab}>
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
          display: flex;
          align-items: center;
          position: relative;
          border: 0.25rem solid ${theme.color.brand.alt};
          background: ${theme.color.brand.base};
          color: ${theme.color.text.overlay.base};
          margin: 0;
          border-radius: ${theme.borderRadius.sm};
          text-align: center;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          transition: all 150ms ease-out;
          user-select: none;
        }
        label:before {
          content: "";
          display: inline-block;
          height: 1rem;
          width: 1rem;
          background: #fff;
          border: 0.35rem solid ${theme.color.brand.alt};
          border-radius: 50%;
          margin-right: 0.5rem;
        }
        input:not(:checked) + label {
          background: ${theme.color.background.alt};
          border-color: transparent;
          color: initial;
        }
        input:not(:checked) + label:before {
          background: transparent;
          border: 0.2rem solid ${theme.color.border.alt};
        }
        input:not(:checked) + label:after {
          border-color: transparent;
        }
        label:hover {
          border-color: ${theme.color.brand.alt};
        }
        input:not(:checked) + label:hover {
          border-color: ${theme.color.border.alt};
        }
        input:focus + label {
          border-color: ${theme.color.brand.alt};
          box-shadow: ${theme.elevation.one.brand};
        }
        input:not(:checked) + label:focus {
          border-color: ${theme.color.border.alt};
        }
        label:focus:hover {
          border-color: ${theme.color.brand.alt};
        }
        input:not(:checked) + label:focus:hover {
          border-color: ${theme.color.border.alt};
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
