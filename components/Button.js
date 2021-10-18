export default function Button({ children, disabled }) {
  return (
    <button className="button">
      {children}
      <style jsx>{`
        .button {
          display: block;
          border: none;
          margin: 0 auto;
          overflow: visible;
          outline: none;
          font: inherit;
          line-height: normal;
          -webkit-font-smoothing: inherit;
          -moz-osx-font-smoothing: inherit;
          -webkit-appearance: none;

          padding: 1.2rem;
          width: 100%;
          max-width: 24rem;
          color: ${disabled
            ? "var(--color-text-button-disabled)"
            : "var(--color-text-button)"};
          border-radius: 1rem;
          font-size: 1rem;
          background: ${disabled
            ? "var(--color-background-button-disabled)"
            : "var(--color-background-button)"};
          cursor: ${disabled ? "not-allowed" : "pointer"};
        }
        .button:active {
          background: ${disabled
            ? "var(--color-background-button-disabled)"
            : "var(--color-background-button-pressed)"};
        }
        .button:focus {
          box-shadow: ${disabled
            ? "none"
            : "var(--color-background-button-outline) 0px 0px 1rem"};
        }
        .button:focus:not(:focus-visible) {
          outline: none;
        }
        .button:focus:not(:-moz-focusring) {
          outline: none;
        }
      `}</style>
    </button>
  );
}
