import theme from "styles/theme";

interface DataListProps {
  children: React.ReactNode;
  margin?: string;
  mainEventLogistics?: boolean;
  gap: string;
}

export function DataList({
  children,
  margin,
  mainEventLogistics,
  gap,
}: DataListProps) {
  return (
    <div className="data-list">
      {children}
      <style jsx>{`
        .data-list {
          display: flex;
          flex-wrap: wrap;
          grid-auto-flow: column;
          grid-auto-rows: 1fr;
          gap: ${gap};
          margin: ${mainEventLogistics ? "3rem auto 0" : "1.5rem auto 0"};
          padding: 0 1rem;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .data-list {
            padding: 0 2rem;
            margin: ${mainEventLogistics ? "3rem auto 0" : "0rem auto 0"};
          }
        }
      `}</style>
    </div>
  );
}

interface DataListItemProps {
  heading?: string;
  nameHeading?: string;
  subHeading?: string;
  subHeadingLight?: boolean;
  children?: React.ReactNode;
  translation?: string;
}

export function DataListItem({
  heading,
  nameHeading,
  children,
  subHeading,
  subHeadingLight,
  translation,
}: DataListItemProps) {
  return (
    <div className="data-list-item">
      <h3>{heading}</h3>
      <h3>{nameHeading}</h3>
      <h4>{translation}</h4>
      <h5>{subHeading}</h5>
      <p>{children}</p>
      <style jsx>{`
        .data-list-item {
          max-width: ${nameHeading ? "16rem": "20rem"}
        }
        h3,
        h4,
        h5,
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
        h5 {
          font-size: .8rem;
          color: ${theme.color.text.alt2};
          font-weight: ${subHeadingLight ? "400" : "600"}
        }
        p {
          color: ${theme.color.brand.base};
          font-weight: 500;
          font-size: 1.25rem;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          h3 {
            font-size: ${nameHeading ? "1.25rem": "1.5rem"};
          }
          h4 {
            font-size: 1.125rem;
          }
          h5 {
            font-size: 1rem;
          }
          p {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
