import theme from "styles/theme";
import React from "react";

interface SplitSectionProps {
  children: React.ReactNode;
  hint?: string;
  title: string;
}

export default function SplitSection({
  hint,
  children,
  title,
}: SplitSectionProps) {
  return (
    <article className="split-section">
      <aside className="split-section__aside">
        <h2 className="split-section__title">{title}</h2>
        {hint ? <h6 className="split-section__hint">{hint}</h6> : null}
      </aside>
      <main className="split-section__main">{children}</main>
      <style jsx>{`
        .split-section {
          padding: 0 1rem;
          margin: 2rem 0;
        }
        .split-section__aside {
          max-width: 25rem;
          width: 100%;
          margin-bottom: 1rem;
        }
        .split-section__main {
          flex-grow: 1;
          width: 100%;
          max-width: ${theme.layout.width.interior};
        }
        @media screen and (min-width: ${theme.layout.breakPoints.medium}) {
          .split-section {
            display: flex;
            gap: 0 2rem;
            padding: 0 2rem;
            margin: 4rem 0;
          }
          .split-section__aside {
            margin-bottom: 0;
            max-width: 16rem;
          }
        }

        .split-section__title,
        .split-section__hint {
          margin: 0;
        }
        .split-section__title {
          font-size: 2rem;
        }
        .split-section__hint {
          color: ${theme.color.text.alt2};
          font-weight: 500;
          font-size: 0.875rem;
        }
        .split-section__title:after {
          content: "";
          display: block;
          width: 8rem;
          height: 0.5rem;
          margin: 0.5rem 0 1rem;
          background: ${theme.color.brand.base};
        }
      `}</style>
    </article>
  );
}
