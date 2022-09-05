import { Focus } from "@/lib/api";
import { useWindowWidth } from "@/lib/hooks";
import { useLayoutEffect, useRef, useState } from "react";
import theme from "styles/theme";
import { DataList } from "./DataList";
import Selectable, { SelectableSize } from "./form/Selectable";

export interface FocusPickerFocus extends Focus {
  active?: boolean;
}

interface FocusPickerProps {
  focuses: FocusPickerFocus[];
  onFilterClick: (id?: string) => any;
  memberCount?: number;
}

export default function FocusPicker({
  focuses,
  onFilterClick,
  memberCount,
}: FocusPickerProps) {
  const width = useWindowWidth();
  const [defaultHeight, setDefaultHeight] = useState<number>();
  const listRef = useRef<HTMLUListElement>();
  const listItemRef = useRef<HTMLLIElement>();
  const listItemsRef = useRef<HTMLLIElement[]>([]);
  const filterIsSelected = focuses.filter((foc) => foc.active).length === 0;

  useLayoutEffect(() => {
    if (!listItemsRef) return;
    setDefaultHeight(listRef.current.scrollHeight);
  }, [width]);

  return (
    <>
      <div className="picker">
        <div className="picker__selection">
          <DataList gap="0rem 3rem">
            <div className="picker__category">
              Focus{" "}
              <svg className="picker__circle" height="15" width="15">
                <circle cx="7" cy="7" r="7" fill={theme.color.brand.faded} />
              </svg>
            </div>
            <div className="picker__category">Industry</div>
            <div className="picker__category">Location</div>
            <div className="picker__category">Experience</div>
          </DataList>
        </div>
        <div className="picker__container">
          <ul
            className="picker__list"
            ref={listRef}
            style={{
              maxHeight: defaultHeight,
            }}
          >
            <li className="picker__item" ref={listItemRef}>
              <Selectable
                fullWidth
                headline={`All ${memberCount ? `(${memberCount})` : ""}`}
                onClick={() => (!filterIsSelected ? onFilterClick() : null)}
                selected={filterIsSelected}
                size={SelectableSize.Large}
              />
            </li>
            {focuses.map((focus, i) => (
              <li
                key={`focus-filter-${i}`}
                ref={(el) => (listItemsRef.current[i] = el)}
              >
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
          </ul>
        </div>

        <style jsx>{`
          .picker {
            width: 100%;
          }
          .picker__selection {
            margin-bottom: 2rem;
            font-size: 1.4rem;
            margin-left: 0.2rem;
            /* color: ${theme.color.text.alt};
            font-weight: 600; */
          }
          .picker__category {
            font-size: 1.4rem;
            color: ${theme.color.brand.faded};
          }
          .picker__category:hover {
            /* border-radius: ${theme.borderRadius.md}; */
            /* background: ${theme.color.brand.alpha}; */
            /* transition: background 150ms ease-out; */
            color: ${theme.color.brand.base};
            cursor: pointer;
          }
          .picker__container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
            width: 100%;
          }
          .picker__circle {
            display: inline-block;
            vertical-align: middle;
          }
          .picker__list {
            list-style: none;
            margin: 0 0.5rem 0 0;
            padding: 0;
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            transition: 150ms ease-out max-height;
            overflow: hidden;
          }
          .picker__item {
            margin: 0;
            white-space: initial;
            flex-shrink: 0;
          }
          @media screen and (min-width: ${theme.layout.breakPoints.medium}) {
            .picker__list {
              margin-bottom: 0;
              max-height: initial;
            }
          }
        `}</style>
      </div>
    </>
  );
}
