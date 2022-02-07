import React, { useState } from "react";
import { cssHelperButtonReset } from "../../styles/global";

interface LabelProps {
  hint?: React.ReactNode;
  htmlFor?: string;
  label: string;
  labelTranslation?: string;
}

export default function Label({
  hint,
  htmlFor,
  label,
  labelTranslation,
}: LabelProps) {
  return (
    <label htmlFor={htmlFor}>
      <div>
        <main>
          <h3>{label}</h3>
          {labelTranslation && <h4>{labelTranslation}</h4>}
        </main>
        <aside>{hint && <LabelHint hint={hint} />}</aside>
      </div>
      <style jsx>{`
        label {
          position: relative;
        }
        div {
          display: flex;
        }
        main {
          flex-grow: 1;
        }
        h3,
        h4 {
          margin: 0;
          line-height: 120%;
        }
        h3 {
          display: flex;
          align-items: flex-start;
          flex-wrap: nowrap;
          font-size: 1.4rem;
          font-weight: 600;
        }
        span {
          display: inline-flex;
          margin-left: 0.5rem;
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

interface LabelHintProps {
  hint: string | React.ReactNode;
}

function LabelHint({ hint }: LabelHintProps) {
  const [showHint, setShowHint] = useState<boolean>(false);
  return (
    <button
      onMouseOver={() => setShowHint(true)}
      onMouseOut={() => setShowHint(false)}
      onClick={() => setShowHint(!showHint)}
      type="button"
    >
      <span>
        <InfoSVG highlight={showHint} />
      </span>

      <article>
        <main>{hint}</main>
      </article>
      <style jsx>{`
        button {
          ${cssHelperButtonReset}
          text-align: left;
          display: inline-block;
          position: relative;
          cursor: pointer;
          border: 1px solid transparent;
          margin-left: 0.75rem;
          border-radius: var(--border-radius-x-small);
        }
        button:focus {
          border-color: var(--color-brand-alpha);
        }
        button:before {
          // gives it a bigger hover area
          content: "";
          display: ${showHint ? "block" : "none"};
          width: 2rem;
          height: 100%;
          position: absolute;
          left: -2rem;
        }
        article {
          position: absolute;
          right: 0;
          z-index: 100;
          width: max-content;
          max-width: 24rem;
          border: 0.1rem solid var(--color-border);
          background: var(--color-background-white);
          padding: 0.5rem;
          border-radius: var(--border-radius-small);
          user-select: none;
          pointer-events: ${showHint ? "initial" : "none"};
          transform: ${showHint ? "translateY(0)" : "translateY(-0.5rem)"};
          opacity: ${showHint ? "1" : "0"};
          transition: ${showHint
            ? "all 150ms ease-out"
            : "all 150ms ease-out 250ms"};
        }
        header h3 {
          margin: 0;
          line-height: 120%;
        }
        main {
          line-height: 150%;
          font-size: 0.8rem;
          color: var(--color-text-alt-2);
          font-weight: 400;
        }
      `}</style>
    </button>
  );
}

interface InfoSVGProps {
  highlight?: boolean;
}

function InfoSVG({ highlight }: InfoSVGProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="20" height="20" rx="5" />
      <path d="M7 7.5C7 7.22386 7.22386 7 7.5 7H11.5C11.7761 7 12 7.22386 12 7.5V14H13.5C13.7761 14 14 14.2239 14 14.5V16H7V14.5C7 14.2239 7.22386 14 7.5 14H9V9H7V7.5Z" />
      <path d="M9 3.5C9 3.22386 9.22386 3 9.5 3H11.5C11.7761 3 12 3.22386 12 3.5V5.5C12 5.77614 11.7761 6 11.5 6H9.5C9.22386 6 9 5.77614 9 5.5V3.5Z" />
      <style jsx>{`
        rect {
          fill: ${highlight
            ? "var(--color-brand)"
            : "var(--color-background-alt-2)"};
          transition: ${highlight
            ? "all 150ms ease-out"
            : "all 150ms ease-out 250ms"};
        }
        path {
          fill: var(--color-text-overlay-alt-2);
        }
      `}</style>
    </svg>
  );
}
