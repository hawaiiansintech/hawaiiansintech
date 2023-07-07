import { cn, toKebab } from "../../helpers";

export enum CheckBoxSize {
  Default = "default",
  Small = "small",
}

interface CheckBoxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  id?: string;
  label?: string;
  onClick?: () => void;
  onChange?: () => void;
  size?: CheckBoxSize;
}

export default function CheckBox({
  checked,
  defaultChecked,
  id,
  label,
  onClick,
  onChange,
  size,
}: CheckBoxProps) {
  const labelKebab = label ? toKebab(label) : null;
  return (
    <div className={`relative flex gap-4`} onClick={onClick}>
      <input
        id={id || labelKebab}
        value={id || labelKebab}
        type="checkbox"
        name={id || labelKebab}
        checked={checked}
        defaultChecked={defaultChecked}
        readOnly
        className="peer hidden"
        tabIndex={-1}
        onChange={onChange}
      />

      <label
        className={cn(
          `
          flex
          cursor-pointer
          select-none
          items-center
          gap-2 
          text-stone-600
          before:block
          before:h-4
          before:w-4
          before:rounded
          before:border-4
          before:border-tan-400
          before:transition-all
          before:content-['']
          hover:transition-all
          hover:before:border-tan-600/50
          peer-checked:before:border-4
          peer-checked:before:border-brown-600
          peer-checked:before:bg-white
          peer-checked:before:content-['']
          peer-checked:hover:before:border-brown-700
          sm:peer-checked:before:border-6
        `,
          size === CheckBoxSize.Small && `gap-1`
        )}
        htmlFor={labelKebab}
      >
        {label ? (
          <h3
            className={cn(
              `font-medium`,
              size === CheckBoxSize.Small && `text-xs`
            )}
          >
            {label}
          </h3>
        ) : null}
      </label>
    </div>
  );
}
