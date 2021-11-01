import { toKebab } from "../../helpers.js";

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
      <label htmlFor={labelKebab}>
        {label && <h3>{label}</h3>}
        {labelTranslation && <h4>{labelTranslation}</h4>}
      </label>

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
        h3,
        h4 {
          margin: 0;
          line-height: 120%;
        }
        h3 {
          font-size: 1.6rem;
          font-weight: 600;
        }
        h4 {
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--color-brand-faded);
          font-style: italic;
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
