import { toKebab } from "../../helpers";

interface CheckBoxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  description?: React.ReactNode;
  id?: string;
  label?: string;
  onClick?: () => void;
  small?: string;
}

export default function CheckBox(props: CheckBoxProps) {
  const labelKebab = props.label ? toKebab(props.label) : null;
  return (
    <div className="relative flex" onClick={props.onClick}>
      <input
        id={props.id || labelKebab}
        value={props.id || labelKebab}
        type="checkbox"
        name={props.id || labelKebab}
        checked={props.checked}
        defaultChecked={props.defaultChecked}
        readOnly
        className="peer hidden"
        tabIndex={-1}
      />

      <label
        className={`
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
          peer-checked:before:border-[6px]
          peer-checked:before:border-brown-600
          peer-checked:before:bg-white
          peer-checked:before:content-['']
          peer-checked:hover:before:border-brown-700
        `}
        htmlFor={labelKebab}
      >
        {props.label ? (
          <h3 className="ml-2 font-medium">{props.label}</h3>
        ) : null}
      </label>
    </div>
  );
}
