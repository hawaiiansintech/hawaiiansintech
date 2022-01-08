export default function LoadingSpinner() {
  return (
    <figure className="loading-spinner">
      <style jsx>{`
        figure {
          display: inline-block;
          width: 2rem;
          height: 2rem;
          border: 0.4rem solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          -webkit-animation: spin 1s ease-in-out infinite;
        }
      `}</style>
    </figure>
  );
}
