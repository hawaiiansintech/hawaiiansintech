import { toKebab } from "../../helpers.js";

export default function RadioBox({
  defaultChecked,
  description,
  label,
  seriesOf,
}) {
  const labelKebab = toKebab(label);
  return (
    <div className="radio-box">
      <input
        id={labelKebab}
        value={labelKebab}
        type="radio"
        name={seriesOf}
        defaultChecked={defaultChecked}
      />
      <label for={labelKebab}>
        <h3>{label}</h3>
        <p>{description}</p>
      </label>
      <style jsx>{`
        .radio-box {
          --color-radio-base: #dacbc8;
          --color-radio-fill: var(--color-brand);
          --radio-size: 2rem;
          --radio-stroke: 0.3rem;
          --radio-padding: 2rem;
          position: relative;
        }

        h3 {
          font-size: 1.8rem;
          font-weight: 600;
          line-height: 120%;
          margin: 0;
        }
        p {
          margin: 0.5rem 0 0;
          line-height: 150%;
        }

        input[type="radio"] {
          position: absolute;
          left: -9999px;
        }

        input[type="radio"] + label {
          max-width: 20rem;
          display: inline-block;
          cursor: pointer;
          padding: calc(
              var(--radio-padding) + var(--radio-padding) / 2 +
                var(--radio-size)
            )
            var(--radio-padding) var(--radio-padding);
          border: 0.25rem solid transparent;
          border-radius: 1rem;
          text-align: center;
          transition: border 150ms ease-out;
        }
        input[type="radio"] + label:before {
          content: "";
          display: block;
          position: absolute;
          width: var(--radio-size);
          height: var(--radio-size);
          top: var(--radio-padding);
          left: 50%;
          transform: translateX(-50%);
          border-radius: 100%;
          background: var(--color-radio-base);
        }
        input[type="radio"] + label:after {
          content: "";
          display: block;
          position: absolute;
          height: calc(var(--radio-size) - var(--radio-stroke) * 2);
          width: calc(var(--radio-size) - var(--radio-stroke) * 2);
          top: calc(var(--radio-padding) + var(--radio-stroke));
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          background: var(--color-radio-fill);
          border-radius: 100%;
          transition: opacity 150ms ease-out;
        }
        input[type="radio"]:not(:checked) + label:after {
          opacity: 0;
        }
        input[type="radio"]:checked + label {
          border-color: var(--color-brand);
        }
        input[type="radio"]:not(:checked) + label:hover {
          border-color: var(--color-radio-base);
        }
        input[type="radio"]:checked + label:after {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
