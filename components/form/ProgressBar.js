export default function ProgressBar({
  headline,
  label,
  currentCount,
  totalCount,
}) {
  return (
    <div className="progress-bar">
      {headline && <h6>{headline}</h6>}
      {label && <h3>{label}</h3>}
      <div className="progress-bar__figures">
        {[...Array(totalCount)].map((value, index) => {
          const isActive = index < currentCount;
          return (
            <figure
              className={`progress-bar__figure${
                isActive ? " progress-bar__figure--active" : ""
              }`}
              key={`pbf-${index}`}
            />
          );
        })}
      </div>
      <style jsx>{`
        .progress-bar {
          margin: 0 auto 4rem;
          max-width: 42rem;
          text-align: center;
        }
        .progress-bar__figures {
          display: grid;
          width: 100%;
          grid-auto-flow: column;
          grid-auto-rows: 1fr;
          grid-column-gap: 0.25rem;
          border-radius: 1rem;
          overflow: hidden;
          max-width: 24rem;
          margin: 0 auto;
        }
        .progress-bar__figure {
          margin: 0;
          height: 0.5rem;
          background-color: var(--color-border);
        }
        .progress-bar__figure--active {
          background-color: var(--color-brand);
        }
        h3 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
          color: var(--color-brand);
        }
        h6 {
          font-size: 0.6rem;
          letter-spacing: 0.05rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
