import { Focus } from "@/lib/api";
import { useWindowWidth } from "@/lib/hooks";
import { useEffect, useRef, useState } from "react";
import theme from "styles/theme";
import Button, { ButtonSize, ButtonVariant } from "./Button";
import Selectable, { SelectableSize } from "./form/Selectable";

export interface FocusPickerFocus extends Focus {
  active?: boolean;
}

interface FocusPickerProps {
  focuses: FocusPickerFocus[];
  onFilterClick: (id?: string) => any;
}

export default function FocusPicker({
  focuses,
  onFilterClick,
}: FocusPickerProps) {
  const [showButton, setShowButton] = useState<boolean>(false);
  const [maxHeightContainer, setMaxHeightContainer] = useState<number>(0);
  const [menuExpanded, setMenuExpanded] = useState<boolean>(false);
  const width = useWindowWidth();
  const isSelected = focuses.filter((foc) => foc.active).length === 0;
  const listRef = useRef<HTMLUListElement>();
  const allRef = useRef<HTMLLIElement>();

  useEffect(() => {
    let mqlMedium = window.matchMedia(
      `(min-width: ${theme.layout.breakPoints.medium})`
    );
    const containerHeight = listRef.current?.clientHeight;
    const itemsHeight = allRef.current?.clientHeight * 2 + 2;

    if (containerHeight > itemsHeight) {
      setShowButton(true);
      setMaxHeightContainer(itemsHeight - 2);
    } else if (
      !showButton &&
      listRef.current?.clientHeight <= itemsHeight * 2
    ) {
      setShowButton(false);
    }
    if (mqlMedium.matches) setShowButton(false);
  }, [width]);

  return (
    <>
      <ul ref={listRef}>
        <li ref={allRef}>
          <Selectable
            fullWidth
            headline={"All"}
            onClick={() => (!isSelected ? onFilterClick() : null)}
            selected={isSelected}
            size={SelectableSize.Large}
          />
        </li>
        {focuses.map((focus, i) => (
          <li key={`focus-filter-${i}`}>
            <Selectable
              fullWidth
              headline={focus.name}
              onClick={() => onFilterClick(focus.id)}
              selected={focus.active}
              disabled={focus.count === 0}
              size={SelectableSize.Large}
            />
          </li>
        ))}
        <style jsx>{`
          ul {
            list-style: none;
            margin: 0 0.5rem 0 0;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            overflow: hidden;
            max-height: ${showButton && !menuExpanded
              ? `${maxHeightContainer}px`
              : "initial"};
          }
          li {
            margin: 0;
            padding: 0 0.5rem 0.5rem 0;

            white-space: initial;
            flex-shrink: 0;
          }
          @media screen and (min-width: ${theme.layout.breakPoints.small}) {
            ul {
              margin-bottom: 0.75rem;
            }
          }
          @media screen and (min-width: ${theme.layout.breakPoints.medium}) {
            ul {
              margin-bottom: 0;
              max-height: initial;
              overflow: initial;
            }
          }
        `}</style>
      </ul>
      {showButton && (
        <Button
          variant={ButtonVariant.Secondary}
          size={ButtonSize.Small}
          onClick={() => setMenuExpanded(!menuExpanded)}
        >
          {menuExpanded ? "Show Less" : "Show More"}
        </Button>
      )}
    </>
  );
}
