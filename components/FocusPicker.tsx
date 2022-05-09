import { Focus } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import theme from "styles/theme";
import Button, { ButtonSize, ButtonVariant } from "./Button";
import Selectable, { SelectableSize } from "./form/Selectable";
import Tag from "./Tag";

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
  const [showButton, setShowButton] = useState<boolean>(false);
  const [menuExpanded, setMenuExpanded] = useState<boolean>(false);
  const isSelected = focuses.filter((foc) => foc.active).length === 0;
  const listRef = useRef<HTMLUListElement>();
  const listItemRef = useRef<HTMLLIElement>();

  useEffect(() => {
    setShowButton(true);
  }, []);

  return (
    <>
      <div className="picker">
        <div className="picker__container">
          <ul className="picker__list" ref={listRef}>
            <li className="picker__item" ref={listItemRef}>
              <Selectable
                fullWidth
                headline={`All ${memberCount ? `(${memberCount})` : ""}`}
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
          </ul>
          {showButton && (
            <Button
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Small}
              onClick={() => setMenuExpanded(!menuExpanded)}
            >
              {menuExpanded ? "Less" : "More Filters"}
            </Button>
          )}
        </div>
        {menuExpanded ? (
          <div className="more-options">
            <div className="more-options__container">
              <h6>
                Location <Tag>In-Progress</Tag>
              </h6>
              <div className="more-options__example">
                {["Hawaiʻi", "California", "Washington"].map((item) => (
                  <Selectable
                    headline={item}
                    disabled
                    size={SelectableSize.Large}
                  />
                ))}
              </div>
            </div>
            <div className="more-options__container">
              <h6>
                Industry <Tag>In-Progress</Tag>
              </h6>
              <div className="more-options__example">
                {[`Internet / Technology`, `Education`, `Entertainment`].map(
                  (item) => (
                    <Selectable
                      headline={item}
                      disabled
                      size={SelectableSize.Large}
                    />
                  )
                )}
              </div>
            </div>
            <div className="more-options__container">
              <h6>
                Years of Experience <Tag>In-Progress</Tag>
              </h6>
              <div className="more-options__example">
                {[`Less than a year`, `1 – 2 years`, `3 – 4 years`].map(
                  (item) => (
                    <Selectable
                      headline={item}
                      disabled
                      size={SelectableSize.Large}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        ) : null}
        <style jsx>{`
          .picker {
            width: 100%;
          }
          .picker__container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
            width: 100%;
          }
          .picker__list {
            list-style: none;
            margin: 0 0.5rem 0 0;
            padding: 0;
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
          }
          .picker__item {
            margin: 0;
            white-space: initial;
            flex-shrink: 0;
          }
          @media screen and (min-width: ${theme.layout.breakPoints.small}) {
            .picker__list {
              margin-bottom: 0.75rem;
            }
          }
          @media screen and (min-width: ${theme.layout.breakPoints.medium}) {
            .picker__list {
              margin-bottom: 0;
              max-height: initial;
              overflow: initial;
            }
          }
          .more-options {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem 1rem;
            margin-top: 1.25rem;
          }
          .more-options h6 {
            margin: 0.25rem 0 0.5rem;
            font-size: 1rem;
            color: ${theme.color.text.alt};
          }
          .more-options__container {
            margin-bottom: 1rem;
          }
          .more-options__example {
            display: inline-flex;
            flex-wrap: nowrap;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
        `}</style>
      </div>
    </>
  );
}
