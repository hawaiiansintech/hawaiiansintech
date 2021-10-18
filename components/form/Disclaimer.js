export default function Disclaimer({ children, disabled }) {
  return (
    <p className="disclaimer">
      {children}
      <style jsx>{`
        .disclaimer {
          max-width: 32rem;
          margin: 0 auto;
          font-size: 0.8rem;
          line-height: 150%;
          font-style: italic;
          text-align: center;
        }
      `}</style>
    </p>
  );
}
