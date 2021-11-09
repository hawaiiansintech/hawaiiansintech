import { toKebab } from "../../helpers.js";

export default function Label({ label, labelTranslation }) {
  const labelKebab = toKebab(label);
  return (
    <label htmlFor={labelKebab}>
      {label && <h3>{label}</h3>}
      {labelTranslation && <h4>{labelTranslation}</h4>}
      <style jsx>{`
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
      `}</style>
    </label>
  );
}
