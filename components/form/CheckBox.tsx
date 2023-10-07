import { cn, toKebab } from "../../helpers";

interface CheckBoxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  description?: React.ReactNode;
  error?: boolean | string;
  id?: string;
  label?: string;
  name?: string;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckBox(props: CheckBoxProps) {
  const labelKebab = props.label ? toKebab(props.label) : null;
  return (
    <div className="relative flex" onClick={props.onClick}>
      <input
        id={props.id || labelKebab}
        value={props.id || labelKebab}
        type="checkbox"
        name={props.name || props.id || labelKebab}
        checked={props.checked}
        defaultChecked={props.defaultChecked}
        onChange={props.onChange}
        readOnly
        className="peer hidden"
        tabIndex={-1}
      />

      <label
        className={cn(
          `
          flex
          cursor-pointer
          items-center
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
          peer-checked:text-brown-800
          peer-checked:before:border-4
          peer-checked:before:border-brown-600
          peer-checked:before:bg-white
          peer-checked:before:content-['']
          peer-checked:hover:before:border-brown-700
          sm:peer-checked:before:border-6
        `,
          props.error ?? "text-red-600"
        )}
        htmlFor={labelKebab}
      >
        {props.label ? (
          <h3 className="ml-2 font-medium">{props.label}</h3>
        ) : null}
        {typeof props.error === "string" ? (
          <p className="ml-2 text-xs text-red-600">{props.error}</p>
        ) : null}
      </label>
    </div>
  );
}
