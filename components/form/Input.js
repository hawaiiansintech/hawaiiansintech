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
    optional,
    placeholder,
    tabIndex,
  } = props;

  const nameKebab = toKebab(name);
  return (
    <div className="input">
      {label && labelTranslation && (
        <Label
          htmlFor={nameKebab}
          label={label}
          labelTranslation={labelTranslation}
          optional={optional}
        />
      )}
      <input
        defaultValue={defaultValue}
        id={nameKebab}
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
          margin: 1rem 0 ${error ? "0.25rem" : "0"};
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 1.4rem;
          border-radius: var(--border-radius-small);
          border: 0.2rem solid transparent;
          border-color: ${error ? "border-color: red" : "var(--color-border)"};
          background: var(--color-border);
        }
        input::placeholder {
          color: var(--color-text);
        }
        input:focus {
          border: 0.2rem solid var(--color-brand);
          box-shadow: var(--box-shadow-outline-button);
          background: white;
        }
        input::placeholder {
          color: var(--color-text);
        }
        span {
          font-size: 0.9rem;
          color: var(--color-error);
        }
      `}</style>
    </div>
  );
}
