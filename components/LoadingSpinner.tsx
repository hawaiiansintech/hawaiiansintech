export enum LoadingSpinnerColor {
  Brand = "var(--color-brand)",
  Black = "var(--color-text-alt)",
  Overlay = "var(--color-text-overlay)",
}

export enum LoadingSpinnerSize {
  Small = "1rem",
  Medium = "2rem",
  Large = "4rem",
}

interface LoadingSpinnerProps {
  color?: LoadingSpinnerColor;
  size?: LoadingSpinnerSize;
}

export default function LoadingSpinner({
  color = LoadingSpinnerColor.Overlay,
  size = LoadingSpinnerSize.Medium,
}: LoadingSpinnerProps) {
  return (
    <figure className="loading-spinner">
      <style jsx>{`
        figure {
          display: inline-block;
          width: ${size};
          height: ${size};
          margin: 0;
          border: calc(${size} / 8) solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          border-top-color: ${color};
          animation: spin 1s ease-in-out infinite;
          -webkit-animation: spin 1s ease-in-out infinite;
        }
      `}</style>
    </figure>
  );
}
