import { toKebab } from "../../helpers.js";
import Label from "./Label.js";

export default function Input(props) {
  const {
    defaultValue,
    error,
    label,
    labelTranslation,
    name,
    onBlur,
    onChange,
    onFocus,
    placeholder,
    tabIndex,
  } = props;

  const labelKebab = toKebab(label);
  return (
    <div className="input">
      {label && labelTranslation && (
        <Label label={label} labelTranslation={labelTranslation} />
      )}
      <input
        defaultValue={defaultValue}
        id={labelKebab}
        placeholder={placeholder}
        name={name}
        type="text"
        tabIndex={tabIndex}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
      />
      {error && <span>{error}</span>}

      <style jsx>{`
        input {
          --color-placeholder: #b7b7b7;
        }
        input {
          margin: 1rem 0 0;
          ${error && "margin-bottom: 0.25rem;"};
          width: 100%;
          padding: 0.75rem 0.75rem;
          font-size: 1.6rem;
          border-radius: var(--border-radius-small);
          border: 0.2rem solid var(--color-border);
          ${error && "border-color: red;"};
          background: transparent;
        }
        input:focus {
          border: 0.2rem solid var(--color-brand);
          box-shadow: var(--box-shadow-outline-button);
        }
        input::placeholder {
          color: var(--color-placeholder);
        }
        span {
          font-size: 0.9rem;
          color: var(--color-error);
        }
      `}</style>
    </div>
  );
}
