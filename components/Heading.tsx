import classNames from "classnames";

interface HeadingProps {
  children: React.ReactNode;
  small?: boolean;
}

export function Heading(props: HeadingProps) {
  return (
    <h1 className="text-stone-800 font-medium text-4xl max-w-3xl mx-auto mt-0 mb-8 px-8 text-center">
      {props.children}
    </h1>
  );
}

interface SubheadingProps {
  children: React.ReactNode;
  centered?: boolean;
}

export function Subheading(props: SubheadingProps) {
  return (
    <p
      className={classNames(
        { "text-center": props.centered, "text-left": !props.centered },
        `font-normal text-stone-600 text-2xl max-w-3xl mx-auto mt-0 mb-8 px-8`
      )}
    >
      {props.children}
    </p>
  );
}
