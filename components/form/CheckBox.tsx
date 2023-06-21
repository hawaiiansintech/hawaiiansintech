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
        className="peer hidden"
        tabIndex={-1}
      />
      <label
        className={`peer-checked:after:content[''] flex cursor-pointer items-center text-stone-600 before:block before:h-5 before:w-5 before:rounded before:border-4 before:border-tan-400 before:content-[''] peer-checked:text-brown-800 peer-checked:before:border-0 peer-checked:before:bg-brown-600 peer-checked:after:absolute peer-checked:after:left-1.5 peer-checked:after:top-2 peer-checked:after:block peer-checked:after:h-2 peer-checked:after:w-2 peer-checked:after:rounded-sm peer-checked:after:bg-white`}
        htmlFor={labelKebab}
      >
        <h3 className="ml-2 font-medium">{props.label}</h3>
      </label>
    </div>
  );
}
