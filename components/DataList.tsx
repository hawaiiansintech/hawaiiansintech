import theme from "styles/theme";

interface DataListProps {
  children?: React.ReactNode;
  heading?: string;
  translation?: string;
}

export default function DataList({
  heading,
  children,
  translation,
}: DataListProps) {
  return (
    <div className="data-list">
      <h3>{heading}</h3>
      <h4>{translation}</h4>

      <p>{children}</p>
      <style jsx>{`
        .data-list {
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
