interface HeadingProps {
  children: React.ReactNode;
  small?: boolean;
}

export function Heading(props: HeadingProps) {
  return (
    <h1 className="heading">
      {props.children}
      <style jsx>{`
        .heading {
          max-width: var(--width-page-interior);
          margin: 0 auto 2rem;
          font-size: ${props.small ? "1.2rem" : "2.4rem"};
          font-weight: 500;
          text-align: center;
        }
      `}</style>
    </h1>
  );
}

interface SubheadingProps {
  children: React.ReactNode;
  centered?: boolean;
}

export function Subheading(props: SubheadingProps) {
  return (
    <p
      className={`header-description ${
        props.centered && "header-description--centered"
      }`}
    >
      {props.children}
      <style jsx>{`
        .header-description {
          max-width: var(--width-page-interior);
          margin: 0 auto;
          text-align: center;
          font-size: 1.4rem;
          font-weight: 400;
          line-height: 150%;
          text-align: left;
        }

        .header-description--centered {
          text-align: center;
        }
      `}</style>
    </p>
  );
}
