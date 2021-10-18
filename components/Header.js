export default function Header({ children }) {
  return (
    <div className="header">
      {children}
      <style global jsx>{`
        .header {
          max-width: 46rem;
          margin: 0 auto;
          text-align: center;
        }
        h2,
        h3 {
          margin: 0;
        }
        h2 {
          font-size: 2.4rem;
          margin-bottom: 2rem;
        }
        h3 {
          font-size: 1.4rem;
          font-weight: 400;
          line-height: 150%;
        }
      `}</style>
    </div>
  );
}
