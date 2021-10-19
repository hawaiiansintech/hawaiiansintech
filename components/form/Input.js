import { toKebab } from "../../helpers.js";

export default function Input({ placeholder, labelTranslation, label }) {
  const labelKebab = toKebab(label);
  return (
    <div className="input">
      <label htmlFor={labelKebab}>
        <h3>{label}</h3>
        <h4>{labelTranslation}</h4>
      </label>
      <input id={labelKebab} placeholder={placeholder} type="text" />

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
          margin: 1rem 0 2rem;
          width: 100%;
          padding: 0.75rem 0.75rem;
          font-size: 1.6rem;
          border-radius: 0.5rem;
          border: 0.2rem solid var(--color-border);
          background: transparent;
        }
        input:focus {
          border: 0.2rem solid var(--color-brand);
          box-shadow: var(--box-shadow-outline-button);
        }
        input::placeholder {
          color: var(--color-placeholder);
        }
      `}</style>
    </div>
  );
}
