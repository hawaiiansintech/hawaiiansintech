import { cn } from "@/lib/utils";

interface HeadingProps {
  children: React.ReactNode;
  small?: boolean;
}

export function Heading(props: HeadingProps) {
  return (
    <h1 className="mx-auto mb-8 mt-0 max-w-3xl px-8 text-center text-4xl font-medium text-stone-800">
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
      className={cn(
        { "text-center": props.centered, "text-left": !props.centered },
        "mx-auto mb-8 mt-0 max-w-3xl px-8 text-2xl font-normal text-stone-600 ",
      )}
    >
      {props.children}
    </p>
  );
}
