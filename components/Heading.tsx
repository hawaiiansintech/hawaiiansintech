import theme from "styles/theme";

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
          max-width: ${theme.layout.width.interior};
          margin: 0 auto 2rem;
          padding: 0 2rem;
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
          max-width: ${theme.layout.width.interior};
          color: ${theme.color.text.alt};
          margin: 0 auto;
          padding: 0 2rem;
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
