export default function Code({ children }) {
  return (
    <code
      className={`whitespace-nowrap rounded-md bg-tan-300 px-1.5 py-1 text-sm text-stone-600`}
    >
      {children}
    </code>
  );
}
