import React, { ReactElement } from "react";

export enum StatusIndicatorType {
  InProgress = "in-progress",
  HasFeedback = "has-feedback",
  Approved = "approved",
  Declined = "declined",
}

interface StatusIndicatorProps {
  type: StatusIndicatorType;
}

export function StatusIndicator({ type }: StatusIndicatorProps) {
  const getAsset = (): ReactElement => {
    switch (type) {
      case StatusIndicatorType.Approved:
        return (
          <>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M75.572 36.713a5 5 0 0 1 1.715 6.86l-20.4 34a5 5 0 0 1-8.388.288L38.9 64.1a5 5 0 0 1 8.202-5.722l5.183 7.43 16.429-27.38a5 5 0 0 1 6.86-1.715Z"
              fill="#fff"
            />
          </>
        );
      case StatusIndicatorType.Declined:
        return (
          <>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M39.465 39.465a5 5 0 0 1 7.07 0l30.93 30.928a5 5 0 0 1-7.072 7.072l-30.928-30.93a5 5 0 0 1 0-7.07Z"
              fill="#fff"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M77.535 39.465a5 5 0 0 0-7.07 0l-30.93 30.928a5 5 0 0 0 7.072 7.072l30.928-30.93a5 5 0 0 0 0-7.07Z"
              fill="#fff"
            />
          </>
        );
      case StatusIndicatorType.InProgress:
        return (
          <>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M58 22a5 5 0 0 1 5 5v28.229L84.65 68.76a5 5 0 0 1-5.3 8.48l-24-15A5 5 0 0 1 53 58V27a5 5 0 0 1 5-5Z"
              fill="#fff"
            />
          </>
        );
      case StatusIndicatorType.HasFeedback:
        return (
          <>
            <path d="M63 85a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" fill="#fff" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M67.056 39.435c-2.119-3.438-9.601-6.446-18.1-2.834a5 5 0 1 1-3.912-9.204c11.501-4.887 25.02-2.144 30.525 6.792 2.941 4.774 3.044 10.623-.064 16.31-2.539 4.645-7.144 9.108-13.89 13.254l1.094 3.065a5 5 0 0 1-9.418 3.363l-2.5-7a5 5 0 0 1 2.343-6.086c7.934-4.263 11.908-8.304 13.596-11.392 1.563-2.86 1.197-4.854.326-6.268Z"
              fill="#fff"
            />
          </>
        );
    }
  };
  const getBackground = (): string => {
    switch (type) {
      case StatusIndicatorType.Declined:
        return "linear-gradient(to top right, #c31a00, #e14c3b)";
      case StatusIndicatorType.Approved:
        return "linear-gradient(to top right, #00b200, #00d248)";
      case StatusIndicatorType.HasFeedback:
        return "linear-gradient(to top right, #ec9d00, #f5c314)";
      case StatusIndicatorType.InProgress:
        return "linear-gradient(to top right, #0068a1, #009ac0)";
      default:
        break;
    }
  };
  return (
    <div className="status-indicator">
      <svg
        width="116"
        height="116"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {getAsset()}
      </svg>
      <style jsx>{`
        .status-indicator {
          height: 116px;
          width: 116px;
          background-image: ${getBackground()};
          background-size: 100% 100%;
          display: inline-flex;
          border-radius: 50%;
        }
        svg {
          filter: drop-shadow(-0.25rem 0.25rem 0.5rem rgba(0, 0, 0, 0.125));
        }
      `}</style>
    </div>
  );
}
