import React from "react";

export enum HorizontalRuleBackground {
  Base = "var(--color-background)",
  Alt = "var(--color-background-alt)",
  Alt2 = "var(--color-background-alt-2)",
  White = "var(--color-background-white)",
}

interface HorizontalRuleProps {
  background?: HorizontalRuleBackground;
  children?: React.ReactNode;
  label?: string;
}

export default function HorizontalRule({
  background,
  children,
  label,
}: HorizontalRuleProps) {
  return (
    <div>
      <hr />
      <main>
        {label && <span>{label}</span>}
        {children}
      </main>
      <hr />
      <style jsx>{`
        div {
          display: flex;
          width: 100%;
        }
        main {
          margin: 0 0.5rem;
          flex-shrink: 0;
        }
        main:empty {
          margin: 0;
        }
        hr {
          display: block;
          width: 100%;
          border: none;
          border-top: 0.125rem solid var(--color-border-alt);
        }
        span {
          color: var(--color-text-alt-2);
          font-weight: 400;
          font-size: 0.75rem;
          letter-spacing: 0.1rem;
          background: ${background ? background : "initial"};
        }
      `}</style>
    </div>
  );
}
