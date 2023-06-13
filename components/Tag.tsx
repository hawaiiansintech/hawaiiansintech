interface TagProps {
  children?: React.ReactNode;
  label?: string;
}

export default function Tag({ children, label }: TagProps) {
  return (
    <span
      className={
        "text-white font-base bg-brown-600 text-xs px-1 py-0.5 leading-4 rounded tracking-wider"
      }
    >
      {children ? children : null}
      {label ? label : null}
    </span>
  );
}
