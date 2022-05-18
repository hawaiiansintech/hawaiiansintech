import { Focus } from "@/lib/api";
import { useWindowWidth } from "@/lib/hooks";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import theme from "styles/theme";
import BannerAlert from "./BannerAlert";
import Input from "./form/Input";
import Selectable, { SelectableSize } from "./form/Selectable";

const SHOW_UP_TO_FILTERS_ROW = 2;

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
  const [menuExpanded, setMenuExpanded] = useState<boolean>(false);
  const [defaultHeight, setDefaultHeight] = useState<number>();
  const [minimizedHeight, setMinimizedHeight] = useState<number>();
  const listRef = useRef<HTMLUListElement>();
  const listItemRef = useRef<HTMLLIElement>();
  const listItemsRef = useRef<HTMLLIElement[]>([]);
  const filterIsSelected = focuses.filter((foc) => foc.active).length === 0;

  useLayoutEffect(() => {
    if (!listItemsRef) return;
    const all = listItemsRef?.current.map(
      (item) => item?.getBoundingClientRect().y
    );
    const dedup = all.filter((y, i) => all.indexOf(y) === i);
    const lastItem = all.indexOf(dedup[SHOW_UP_TO_FILTERS_ROW]) - 1;
    const end = listItemsRef?.current[lastItem]?.getBoundingClientRect().bottom;
    const start = listRef.current.getBoundingClientRect().top;
    setDefaultHeight(listRef.current.scrollHeight);
    setMinimizedHeight(
      end && start ? end - start : listRef.current.scrollHeight
    );
  }, [width]);

  return (
    <>
      <div className="picker">
        <div className="picker__container">
          <ul
            className="picker__list"
            ref={listRef}
            style={{
              maxHeight: menuExpanded ? defaultHeight : minimizedHeight,
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
          <a
            href="#"
            onClick={() => setMenuExpanded(!menuExpanded)}
            style={{ whiteSpace: "nowrap" }}
          >
            {menuExpanded ? "Hide" : "View All"}
          </a>
        </div>
        {menuExpanded ? (
          <div
            style={{
              border: `0.25rem solid ${theme.color.brand.alpha}`,
              padding: "0.5rem",
              marginTop: "0.5rem",
              borderRadius: `${theme.borderRadius.md}`,
            }}
          >
            <BannerAlert tag="ALMOST PAU">
              <strong>More filter functionality coming soon!</strong> New
              features were recently added for prospective and existing members
              to add to their profile. If you're on the list,{" "}
              <Link href="/edit">add them now</Link>!
            </BannerAlert>
            <div style={{ marginTop: "1rem" }}>
              <MoreOptions />
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
              overflow: initial;
            }
          }
        `}</style>
      </div>
    </>
  );
}

function MoreOptions() {
  return (
    <div className="more-options">
      <div className="more-options__option more-options__option--search">
        <h6>Search</h6>
        <div className="more-options__example">
          <Input name={"search"} disabled fullWidth />
        </div>
      </div>
      <div className="more-options__option">
        <h6>Location</h6>
        <div className="more-options__example">
          {["Hawaiʻi", "California", "Washington"].map((item) => (
            <Selectable headline={item} disabled size={SelectableSize.Large} />
          ))}
        </div>
      </div>
      <div className="more-options__option">
        <h6>Industry</h6>
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
      <div className="more-options__option">
        <h6>Years of Experience</h6>
        <div className="more-options__example">
          {[`Less than a year`, `1 – 2 years`, `3 – 4 years`].map((item) => (
            <Selectable headline={item} disabled size={SelectableSize.Large} />
          ))}
        </div>
      </div>
      <style jsx>{`
        .more-options {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem 2rem;
          padding: 0 1rem 0.5rem;
        }
        .more-options h6 {
          margin: 0.25rem 0 0.5rem;
          font-size: 1rem;
          color: ${theme.color.text.alt};
        }
        .more-options__option--search {
          flex-grow: 1;
          width: 100%;
        }
        .more-options__option--search > * {
          width: 100%;
        }
        .more-options__example {
          display: inline-flex;
          flex-wrap: nowrap;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .more-options {
            padding: 0 2rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
