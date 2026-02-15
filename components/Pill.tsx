import theme from "styles/theme";
import React from "react";

interface PillProps {
  active?: boolean;
  customWidth?: string;
  customFontSize?: string;
  children: React.ReactNode;
}

export default function Pill({
  active,
  customWidth,
  customFontSize,
  children,
}: PillProps) {
  return (
    <span>
      {children}
      <style jsx>{`
        span {
          display: inline-block;
          font-size: ${customFontSize ? customFontSize : "0.9rem"};
          width: ${customWidth ? customWidth : "100%"};
          font-weight: 500;
          padding: 0.0625rem 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          border-radius: ${theme.borderRadius.md};
          border: 0.2rem solid transparent;
          background: ${active ? theme.color.brand.alpha : "transparent"};
          color: ${active ? theme.color.brand.base : theme.color.text.alt2};
          background-color: ${active
            ? theme.color.brand.alpha
            : theme.color.border.base};
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          span {
            font-size: ${customFontSize ? customFontSize : "0.7rem"};
            letter-spacing: 0.02rem;
            padding: 0 0.25rem;
          }
        }
      `}</style>
    </span>
  );
}
