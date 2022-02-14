import { Focus } from "@/lib/api";
import { useWindowWidth } from "@/lib/hooks";
import { useEffect, useState } from "react";
import theme from "styles/theme";
import Selectable from "./form/Selectable";

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
  const [visibleCount, setVisibleCount] = useState<2 | 3 | 4 | 5 | 6>(6);
  const width = useWindowWidth();
  useEffect(() => {
    let mqlSmall = window.matchMedia(
      `(min-width: ${theme.layout.breakPoints.small})`
    );
    let mqlMedium = window.matchMedia(
      `(min-width: ${theme.layout.breakPoints.medium})`
    );

    if (mqlMedium.matches) {
      setVisibleCount(5);
      return;
    }
    if (mqlSmall.matches) {
      setVisibleCount(3);
      return;
    }
  }, [width]);
  return (
    <ul>
      <li>
        <Selectable
          fullWidth
          headline={"All"}
          onClick={() => onFilterClick()}
          selected={focuses.filter((foc) => foc.active).length === 0}
        />
      </li>
      {focuses.map((focus, i) => (
        <li key={`focus-filter-${i}`}>
          <Selectable
            fullWidth
            headline={focus.name}
            onClick={() => onFilterClick(focus.id)}
            selected={focus.active}
            disabled={i >= visibleCount}
          />
        </li>
      ))}
      <style jsx>{`
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          padding-left: 1rem;
        }
        li {
          white-space: nowrap;
          flex-wrap: nowrap;
          margin: 0 0.5rem 0 0;
          padding: 0;
        }

        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          ul {
            margin-bottom: 2rem;
            padding-left: 2rem;
          }
          li {
            white-space: initial;
            flex-wrap: nowrap;
            flex-shrink: 0;
            width: calc((100vw - 4rem - 5 * 0.5rem) / ${visibleCount});
          }
        }
      `}</style>
    </ul>
  );
}
