import theme from "styles/theme";

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
    <div onClick={handleOnClick}>
      {category}
      <svg height="0.4rem" width="0.4rem">
        <circle cx="50%" cy="50%" r="50%" />
      </svg>
      <style jsx>{`
        div {
          font-size: 1.4rem;
          color: ${active ? theme.color.brand.alt : theme.color.brand.faded};
          transition: color 0.3s ease;
        }
        div:hover {
          cursor: pointer;
          color: ${active ? theme.color.brand.alt : theme.color.brand.base};
        }
        div:hover svg {
          cursor: pointer;
          visibility: visible;
          opacity: 1;
        }
        svg {
          display: inline-block;
          vertical-align: middle;
          visibility: ${active ? "visible" : "hidden"};
          margin-left: 0.5rem;
          opacity: ${active ? 1 : 0};
          transition: visibility 0.3s ease, opacity 0.3s ease;
        }
        circle {
          fill: ${active ? theme.color.brand.alt : theme.color.brand.faded};
          transition: fill 0.3s ease;
        }
      `}</style>
    </div>
  );
}
