import ErrorNotifSVG from "../Icons/ErrorNotifSVG.js";

export interface ErrorMessageProps {
  headline: string;
  body: string;
}

export default function ErrorMessage({ headline, body }: ErrorMessageProps) {
  return (
    <div className="error-message">
      <aside>
        <ErrorNotifSVG />
      </aside>
      <main>
        <h3>{headline}</h3>
        <h4>{body}</h4>
      </main>
      <style jsx>{`
        .error-message {
          background: var(--color-error-alpha);
          border-radius: 4px;
          padding: 1rem;
          display: flex;
        }
        aside {
          display: inline-flex;
        }
        main {
          margin-left: 1rem;
        }
        h3,
        h4 {
          margin: 0;
        }
        h3 {
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 120%;
        }
        h4 {
          font-size: 0.75rem;
          font-weight: 400;
          line-height: 150%;
        }
      `}</style>

      <style jsx global>{`
        .error-message svg {
          height: 2rem;
          width: 2rem;
        }
        @media (min-width: 480px) {
          .error-message svg {
            height: 2rem;
            width: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
