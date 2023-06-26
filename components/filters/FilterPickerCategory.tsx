import { cn } from "helpers";

interface FilterPickerCategoryProps {
  category: string;
  active: boolean;
  onClick?: (e: React.MouseEvent) => any;
}

export default function FilterPickerCategory({
  category,
  active,
  onClick,
}: FilterPickerCategoryProps) {
  const handleOnClick = (e) => {
    if (onClick) onClick(e);
  };
  return (
    <button
      className={cn(
        `
          rounded-full
          px-4
          py-1
          font-medium
          text-stone-600
          transition-all
        `,
        active && "bg-white text-stone-900",
        !active && "hover:bg-tan-300 hover:text-stone-800"
      )}
      onClick={handleOnClick}
    >
      {category}
    </button>
  );
}
