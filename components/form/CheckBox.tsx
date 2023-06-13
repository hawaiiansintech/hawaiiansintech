import { toKebab } from "../../helpers";

interface CheckBoxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  description?: React.ReactNode;
  id?: string;
  label: string;
  onClick?: () => void;
  small?: string;
}

export default function CheckBox(props: CheckBoxProps) {
  const labelKebab = toKebab(props.label);
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
        className="hidden peer"
        tabIndex={-1}
      />
      <label
        className={`flex items-center text-stone-600 cursor-pointer peer-checked:text-brown-800 before:content-[''] before:block before:w-5 before:h-5 before:border-4 before:border-tan-400 before:rounded peer-checked:before:bg-brown-600 peer-checked:before:border-0 peer-checked:after:content[''] peer-checked:after:absolute peer-checked:after:block peer-checked:after:bg-white peer-checked:after:w-2 peer-checked:after:h-2 peer-checked:after:rounded-sm peer-checked:after:left-1.5 peer-checked:after:top-2`}
        htmlFor={labelKebab}
      >
        <h3 className="ml-2 font-medium">{props.label}</h3>
      </label>
    </div>
  );
}
