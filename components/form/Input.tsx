import { clsx } from "clsx";
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
    <div className="w-full space-y-4">
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
          "w-full rounded border-transparent bg-stone-100 px-4 text-xl first-letter:py-3 placeholder:font-normal placeholder:text-stone-400 focus:ring-8 focus:ring-brown-500/30 disabled:cursor-not-allowed disabled:opacity-50",
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
    <span className="mt-8 block text-xs font-normal text-red-500">
      {children}
    </span>
  );
}
