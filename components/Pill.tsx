interface PillProps {
  active?: boolean;
  children: React.ReactNode;
}

export default function Pill({ active, children }: PillProps) {
  return (
    <span>
      {children}
      <style jsx>{`
        span {
          display: inline-block;
          font-size: 1rem;
          width: 100%;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          border-radius: var(--border-radius-small);
          border: 0.2rem solid transparent;
          background: ${active
            ? "var(--color-brand-alpha)"
            : "var(--color-background-alt)"};
          color: ${active ? "var(--color-brand)" : "var(--color-text-alt-2)"};
          border-color: ${active ? "var(--color-brand-alpha)" : "transparent"};
        }
      `}</style>
    </span>
  );
}
