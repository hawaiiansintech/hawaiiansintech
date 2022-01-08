import { toKebab } from "../../helpers.js";

interface LabelProps {
  htmlFor?: string;
  label: string;
  labelTranslation?: string;
  optional?: boolean;
}

export default function Label({
  htmlFor,
  label,
  labelTranslation,
  optional,
}: LabelProps) {
  return (
    <label htmlFor={htmlFor}>
      <div>
        {label && <h3>{label}</h3>}
        {optional && <span>(optional)</span>}
      </div>
      {labelTranslation && <h4>{labelTranslation}</h4>}
      <style jsx>{`
        h3,
        h4 {
          margin: 0;
          line-height: 120%;
        }
        h3,
        span {
          display: inline-block;
        }
        h3 {
          font-size: 1.4rem;
          font-weight: 600;
        }
        span {
          margin-left: 0.25rem;
          color: var(--color-text-alt);
          font-weight: 600;
        }
        h4 {
          font-size: 0.9rem;
          line-height: 150%;
          font-weight: 400;
          color: var(--color-brand-faded);
          font-style: italic;
        }
      `}</style>
    </label>
  );
}
