interface TagProps {
  children?: React.ReactNode;
  label?: string;
}

export default function Tag({ children, label }: TagProps) {
  return (
    <span className="font-base rounded bg-brown-600 px-1 py-0.5 text-xs leading-4 tracking-wider text-white">
      {children ? children : null}
      {label ? label : null}
    </span>
  );
}
