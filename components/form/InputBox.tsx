import theme from "styles/theme";

interface InputBoxProps {
  border?: boolean;
  disabled?: boolean;
  focusedOnInit?: boolean;
  defaultValue?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  onEnter?: () => any;
  fullWidth?: boolean;
  value?: string;
}

export default function InputBox({
  border,
  disabled,
  focusedOnInit,
  defaultValue,
  onBlur,
  onChange,
  onEnter,
  fullWidth,
  value,
}: InputBoxProps) {
  return (
    <div className="input-box">
      <input
        autoFocus={focusedOnInit}
        onBlur={onBlur}
        onChange={onChange}
        onKeyPress={(e) => {
          if (e.key === "Enter") onEnter();
        }}
        value={value}
        defaultValue={defaultValue}
      />
      <style jsx>{`
        .input-box {
          height: 100%;
        }
        input {
          position: relative;
          border: 0.25rem solid transparent;
          height: 100%;
          font-size: 1rem;
          font-weight: 600;
          line-height: 120%;
          margin: 0;
          border-radius: ${theme.borderRadius.md};
          text-align: center;
          padding: 1rem;
          transition: all 150ms ease-out;
          opacity: ${disabled ? "0.5" : "1"};
          pointer-events: ${disabled ? "none" : "initial"};
          width: ${fullWidth ? "100%" : "initial"};
          background: ${border
            ? theme.color.background.float
            : theme.color.border.base};
          border-color: ${border ? theme.color.border.base : "transparent"};
        }
        .input-box:hover {
          border-color: ${theme.color.brand.base};
        }
        .input-box:active {
          color: ${theme.color.brand.alt};
        }
        .input-box:focus {
          border-color: ${theme.color.brand.base};
          box-shadow: ${theme.elevation.two.brand};
        }
      `}</style>
    </div>
  );
}
