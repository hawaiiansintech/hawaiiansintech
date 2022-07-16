import theme from "styles/theme";

interface DataListProps {
  children: React.ReactNode;
  mainEventLogistics?: boolean;
  gap: string;
  grid?: boolean;
}

export function DataList({
  children,
  mainEventLogistics,
  gap,
  grid,
}: DataListProps) {
  return (
    <div className={grid ? "grid" : "data-list"}>
      {children}
      <style jsx>{`
        .data-list {
          display: flex;
          flex-wrap: wrap;
          grid-auto-flow: column;
          grid-auto-rows: 1fr;
          gap: ${gap};
          margin: ${mainEventLogistics ? "3rem auto 0" : "1.5rem auto 0"};
          padding: ${mainEventLogistics ? "0 1rem;" : 0};
          max-width: 90rem;
        }
        .grid {
          --n: 2; /* number of columns */
          display: grid;
          grid-gap: 1rem;
          grid-template-columns: repeat(
            auto-fit,
            minmax(calc(100% / var(--n) - 20px), 1fr)
          );
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .data-list {
            padding: ${mainEventLogistics ? "0 2rem;" : 0};
            margin: ${mainEventLogistics ? "3rem 0 0 0" : "0"};
          }
          .grid {
            grid-gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

interface DataListItemProps {
  heading?: string;
  extendedHeading?: boolean;
  customWidth?: string;
  mainEventLogistics?: boolean;
  subHeading?: string;
  subHeadingLight?: boolean;
  children?: React.ReactNode;
  imageWithLink?: boolean;
  translation?: string;
}

export function DataListItem({
  heading,
  customWidth,
  mainEventLogistics,
  children,
  subHeading,
  subHeadingLight,
  imageWithLink,
  translation,
}: DataListItemProps) {
  return (
    <div className="data-list-item">
      <>{imageWithLink ? children : null}</>
      <h3>{heading}</h3>
      <h4>{translation}</h4>
      <h5>{subHeading}</h5>
      <p>{imageWithLink ? null : children}</p>
      <style jsx>{`
        .data-list-item {
          width: ${mainEventLogistics
            ? "20rem"
            : customWidth
            ? customWidth
            : "12rem"};
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
          font-size: 0.8rem;
          color: ${theme.color.text.alt2};
          font-weight: ${subHeadingLight ? "400" : "600"};
        }
        p {
          color: ${mainEventLogistics
            ? theme.color.brand.base
            : theme.color.text.alt2};
          font-weight: ${mainEventLogistics ? 700 : 500};
          font-size: ${mainEventLogistics ? "1.8rem" : "1rem"};
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .data-list-item {
            max-width: ${mainEventLogistics
              ? "20rem"
              : customWidth
              ? customWidth
              : "16rem"};
          }
          h3 {
            font-size: ${mainEventLogistics ? "1.5rem" : "1.25rem"};
          }
          h4 {
            font-size: 1.125rem;
          }
          h5 {
            font-size: 1rem;
          }
          p {
            ${mainEventLogistics ? "2rem" : "1.25rem"}
          }
        }
      `}</style>
    </div>
  );
}
