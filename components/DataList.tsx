import theme from "styles/theme";

export function DataList({ children }) {
  return (
    <div className="data-list">
      {children}
      <style jsx>{`
        .data-list {
          display: flex;
          flex-wrap: wrap;
          grid-auto-flow: column;
          grid-auto-rows: 1fr;
          gap: 1rem 6rem;
          margin: 3rem auto 0;
          padding: 0 1rem;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .data-list {
            padding: 0 2rem;
          }
        }
      `}</style>
    </div>
  );
}

interface DataListItemProps {
  children?: React.ReactNode;
  heading?: string;
  translation?: string;
}

export function DataListItem({
  heading,
  children,
  translation,
}: DataListItemProps) {
  return (
    <div className="data-list-item">
      <h3>{heading}</h3>
      <h4>{translation}</h4>

      <p>{children}</p>
      <style jsx>{`
        .data-list-item {
          max-width: 20rem;
        }
        h3,
        h4,
        p {
          margin: 0;
        }
        h3 {
          font-weight: 600;
          font-size: 1.25rem;
        }
        h4 {
          font-size: 1rem;
          font-style: italic;
          font-weight: 400;
          color: ${theme.color.brand.faded};
          margin-bottom: 0.25rem;
        }
        p {
          color: ${theme.color.brand.base};
          font-weight: 500;
          font-size: 1.25rem;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          h3 {
            font-size: 1.5rem;
          }
          h4 {
            font-size: 1.125rem;
          }
          p {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
