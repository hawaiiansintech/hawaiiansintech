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
          font-size: 0.875rem;
          padding: 0.25rem 0.5rem;
          border-radius: var(--border-radius-small);
          background: ${active
            ? "--color-brand-alpha"
            : "var(--color-background-alt)"};
          color: ${active ? "var(--color-brand)" : "var(--color-text-alt-2)"};
        }
      `}</style>
    </span>
  );
}
