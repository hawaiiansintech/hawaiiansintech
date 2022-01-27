export enum HorizontalRuleBackground {
  Base = "var(--color-background)",
  Alt = "var(--color-background-alt)",
  Alt2 = "var(--color-background-alt-2)",
  White = "var(--color-background-white)",
}

interface HorizontalRuleProps {
  background?: HorizontalRuleBackground;
  label?: string;
}

export default function HorizontalRule({
  background,
  label,
}: HorizontalRuleProps) {
  return (
    <div>
      <hr />
      {label && (
        <>
          <span>AND/OR</span>
          <hr />
        </>
      )}
      <style jsx>{`
        div {
          display: flex;
          width: 100%;
        }
        hr {
          display: block;
          width: 100%;
          border: none;
          border-top: 0.125rem solid var(--color-border-alt);
        }
        span {
          padding: 0 0.5rem;
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
