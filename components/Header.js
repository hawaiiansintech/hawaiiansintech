export function HeaderHeading({ children }) {
  return (
    <h1 className="header-heading">
      {children}
      <style jsx>{`
        .header-heading {
          max-width: 42rem;
          margin: 0 auto 2rem;
          font-size: 2.4rem;
          font-weight: 600;
          text-align: center;
        }
      `}</style>
    </h1>
  );
}

export function HeaderDescription({ centered, children }) {
  return (
    <p
      className={`header-description ${
        centered && "header-description--centered"
      }`}
    >
      {children}
      <style jsx>{`
        .header-description {
          max-width: 42rem;
          margin: 0 auto 2rem;
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
