export default function Pill(props) {
  const { children } = props;
  return (
    <span>
      {children}
      <style jsx>{`
        span {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          background: var(--color-brand-alpha);
          color: var(--color-brand);
        }
      `}</style>
    </span>
  );
}
