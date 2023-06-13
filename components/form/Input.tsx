import classNames from "classnames";
import React from "react";
import { toKebab } from "../../helpers";
import Label from "./Label";

interface InputProps {
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  label?: string;
  labelTagged?: string;
  labelTranslation?: string;
  name: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => any;
  placeholder?: string;
  value?: string;
  tabIndex?: number;
}

export default function Input({
  defaultValue,
  disabled,
  error,
  fullWidth,
  label,
  labelTagged,
  labelTranslation,
  name,
  onBlur,
  onChange,
  onFocus,
  placeholder,
  tabIndex,
  value,
}: InputProps) {
  const nameKebab = toKebab(name);
  return (
    <div className={`space-y-2 w-full`}>
      {label && labelTranslation && (
        <Label
          htmlFor={nameKebab}
          label={label}
          labelTranslation={labelTranslation}
          tagged={labelTagged}
        />
      )}
      <input
        className={classNames(
          "w-full py-3 px-4 text-xl rounded border-transparent bg-stone-100 focus:ring-8 focus:ring-brown-500/30 disabled:opacity-50 disabled:cursor-not-allowed placeholder:font-normal placeholder:text-stone-400",
          { "ring-8": error, "ring-red-500/50": error }
        )}
        defaultValue={defaultValue}
        id={nameKebab}
        placeholder={placeholder}
        name={name}
        type="text"
        tabIndex={tabIndex}
        aria-invalid="true"
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        value={value}
        disabled={disabled}
      />
      {error && <InputError>{error}</InputError>}
    </div>
  );
}

export function InputError({ children }: { children: React.ReactNode }) {
  return (
    <span className="block mt-8 text-xs text-red-500 font-normal">
      {children}
    </span>
  );
}
