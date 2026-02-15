import { motion } from "framer-motion";
import theme from "styles/theme";

interface ProgressBarProps {
  headline?: string;
  label?: string;
  currentCount: number;
  totalCount: number;
  width?: string;
}

const bar = {
  hidden: { opacity: 0, transform: "scaleX(0)" },
  show: { opacity: 1, transform: "scaleX(1)" },
};

export default function ProgressBar({
  headline,
  label,
  currentCount,
  totalCount,
  width,
}: ProgressBarProps) {
  return (
    <div className="progress-bar">
      {headline && <h6>{headline}</h6>}
      {label && <h3>{label}</h3>}
      <div className="progress-bar__segments">
        {[...Array(totalCount)].map((val, index) => {
          const isActive = index < currentCount;
          const isLastActive = index + 1 === currentCount;
          return (
            <div
              className={`progress-bar-segment ${
                isActive && !isLastActive && "progress-bar-segment--filled"
              }`}
              key={`progress-bar-segment-${index}`}
            >
              {isLastActive && (
                <motion.figure
                  variants={bar}
                  initial="hidden"
                  animate="show"
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{
                    margin: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: theme.color.brand.base,
                    transformOrigin: "0 0",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .progress-bar {
          margin: 0 auto;
          max-width: ${width ? width : "var(--width-page-interior)"};
          text-align: center;
        }
        .progress-bar__segments {
          display: grid;
          width: 100%;
          grid-auto-flow: column;
          grid-auto-rows: 1fr;
          grid-column-gap: 0.25rem;
          border-radius: 1rem;
          overflow: hidden;
          margin: 0 auto;
        }
        .progress-bar-segment {
          height: 0.5rem;
          background-color: ${theme.color.background.alt};
        }
        .progress-bar-segment--filled {
          background-color: ${theme.color.brand.base};
        }
        h3 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
          color: ${theme.color.brand.base};
        }
        h6 {
          font-size: 0.6rem;
          letter-spacing: 0.05rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
