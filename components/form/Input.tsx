import React from "react";
import { toKebab } from "../../helpers";
import { cn } from "@/lib/utils";
import Label from "./Label";

interface InputProps {
  autoFocus?: boolean;
  centered?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  fullHeight?: boolean;
  label?: string;
  labelTagged?: string;
  labelTranslation?: string;
  name: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => any;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => any;
  placeholder?: string;
  value?: string;
  tabIndex?: number;
}

export default function Input({
  autoFocus,
  defaultValue,
  centered,
  disabled,
  error,
  fullHeight,
  label,
  labelTagged,
  labelTranslation,
  name,
  onBlur,
  onChange,
  onFocus,
  onKeyPress,
  placeholder,
  tabIndex,
  value,
}: InputProps) {
  const nameKebab = toKebab(name);
  return (
    <div className={cn(`w-full space-y-4`, fullHeight && "h-full")}>
      {label && labelTranslation && (
        <Label
          htmlFor={nameKebab}
          label={label}
          labelTranslation={labelTranslation}
          tagged={labelTagged}
        />
      )}
      <input
        className={cn(
          `w-full
          rounded
          border-transparent
          bg-tan-100
          px-4
          py-3
          text-xl
          first-letter:py-3
          placeholder:font-normal
          placeholder:text-stone-400
          focus:ring-8
          focus:ring-brown-500/30
          disabled:cursor-not-allowed
          disabled:opacity-50`,
          { "ring-8": error, "ring-red-500/50": error },
          centered && "text-center",
          fullHeight && "h-full",
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
        onKeyPress={onKeyPress}
        autoFocus={autoFocus}
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
