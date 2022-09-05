import theme from "styles/theme";

interface FocusPickerCategoryProps {
  category: string;
  active: boolean;
  onClick?: (e: React.MouseEvent) => any;
}

export default function FocusPickerCategory({
  category,
  active,
  onClick,
}: FocusPickerCategoryProps) {
  const handleOnClick = (e) => {
    if (onClick) onClick(e);
  };
  return (
    <div onClick={handleOnClick}>
      {category}{" "}
      <svg height="1rem" width="1rem">
        <circle cx=".4rem" cy=".4rem" r=".4rem" />
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
