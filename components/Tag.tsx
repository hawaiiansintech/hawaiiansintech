import theme from "styles/theme";

interface TagProps {
  active?: boolean;
  children: React.ReactNode;
}

export default function Tag({ children }: TagProps) {
  return (
    <span>
      {children}
      <style jsx>{`
        span {
          display: inline-block;
          background: ${theme.color.brand.base};
          color: ${theme.color.text.overlay.base};
          font-size: 0.8em;
          padding: 0.33em 0.5em;
          line-height: 1;
          border-radius: ${theme.borderRadius.xs};
        }
      `}</style>
    </span>
  );
}
