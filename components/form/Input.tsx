import React from "react";
import { toKebab } from "../../helpers.js";
import Label from "./Label";

interface InputProps {
  defaultValue?: string;
  error?: string;
  label?: string;
  labelTranslation?: string;
  name: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => any;
  optional?: boolean;
  placeholder?: string;
  value?: string;
  tabIndex?: number;
}

export default function Input({
  defaultValue,
  error,
  label,
  labelTranslation,
  name,
  onBlur,
  onChange,
  onFocus,
  optional,
  placeholder,
  tabIndex,
  value,
}: InputProps) {
  const nameKebab = toKebab(name);
  return (
    <div className="input">
      {label && labelTranslation && (
        <div className="input__label">
          <Label
            htmlFor={nameKebab}
            label={label}
            labelTranslation={labelTranslation}
            optional={optional}
          />
        </div>
      )}
      <input
        defaultValue={defaultValue}
        id={nameKebab}
        placeholder={placeholder}
        name={name}
        type="text"
        tabIndex={tabIndex}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        value={value}
      />
      {error && <FieldError>{error}</FieldError>}

      <style jsx>{`
        input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 1.4rem;
          border-radius: var(--border-radius-small);
          border: 0.2rem solid transparent;
          border-color: ${error ? "red" : "var(--color-border)"};
          background: var(--color-border);
        }
        input::placeholder {
          color: var(--color-text-alt-2);
        }
        input:focus {
          border-color: var(--color-brand);
          box-shadow: var(--box-shadow-outline-button);
          background: white;
        }
        input:focus::placeholder {
          color: var(--color-text-alt-3);
        }
        .input__label {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}

export function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <span>
      {children}
      <style jsx>{`
        span {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.9rem;
          color: var(--color-error);
        }
      `}</style>
    </span>
  );
}
