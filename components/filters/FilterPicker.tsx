import { DataList } from "@/components/DataList";
import { Filter } from "@/lib/api";
import { useWindowWidth } from "@/lib/hooks";
import { useLayoutEffect, useRef, useState } from "react";
import theme from "styles/theme";
import Selectable, { SelectableSize } from "../form/Selectable";
import FilterPickerCategory from "./FilterPickerCategory";

export interface PickerFilter extends Filter {
  active?: boolean;
}

interface FilterPickerProps {
  focuses: PickerFilter[];
  filtersList: PickerFilter[];
  activeFilters: PickerFilter[];
  onFilterClick: (id?: string, filterType?: string) => any;
  onFilterSeclect: (filterSelect?: string, enable?: boolean) => any;
  memberCount?: number;
}

export default function FilterPicker({
  focuses,
  filtersList,
  activeFilters,
  onFilterClick,
  onFilterSeclect,
  memberCount,
}: FilterPickerProps) {
  const width = useWindowWidth();
  const [defaultHeight, setDefaultHeight] = useState<number>();
  const [focusActive, setFocusActive] = useState<boolean>();
  const [industryActive, setIndustryActive] = useState<boolean>();
  const [locationActive, setLocationActive] = useState<boolean>();
  const [experienceActive, setExperienceActive] = useState<boolean>();
  const listRef = useRef<HTMLUListElement>();
  const listItemRef = useRef<HTMLLIElement>();
  const listItemsRef = useRef<HTMLLIElement[]>([]);
  const filterIsSelected = focuses.filter((foc) => foc.active).length === 0;

  useLayoutEffect(() => {
    if (!listItemsRef) return;
    setDefaultHeight(listRef.current.scrollHeight);
  }, [width]);

  function activateFilter(
    filterActive: boolean,
    setFilter: Function,
    filtertype: string
  ) {
    let enable = filterActive ? false : true;
    setFilter(enable);
    onFilterSeclect(filtertype, enable);
  }

  return (
    <>
      <div className="picker">
        <div className="picker__selection">
          <DataList gap="0rem 3rem">
            <FilterPickerCategory
              category="Focus"
              active={focusActive}
              onClick={() =>
                activateFilter(focusActive, setFocusActive, "focus")
              }
            />
            <FilterPickerCategory
              category="Industry"
              active={industryActive}
              onClick={() =>
                industryActive
                  ? setIndustryActive(false)
                  : setIndustryActive(true)
              }
            />
            <FilterPickerCategory
              category="Location"
              active={locationActive}
              onClick={() =>
                locationActive
                  ? setLocationActive(false)
                  : setLocationActive(true)
              }
            />
            <FilterPickerCategory
              category="Experience"
              active={experienceActive}
              onClick={() =>
                experienceActive
                  ? setExperienceActive(false)
                  : setExperienceActive(true)
              }
            />
            {/* <div>{`All ${memberCount ? `(${memberCount})` : ""}`}</div> */}
          </DataList>
        </div>
        <div className="picker__container top">
          <ul className="picker__list" ref={listRef}>
            {activeFilters.map((focus, i) => (
              <li
                key={`focus-filter-${i}`}
                ref={(el) => (listItemsRef.current[i] = el)}
              >
                <Selectable
                  fullWidth
                  headline={focus.name}
                  onClick={() => onFilterClick(focus.id, focus.filterType)}
                  selected={true}
                  size={SelectableSize.Large}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="picker__container">
          <ul className="picker__list" ref={listRef}>
            {/* <li className="picker__item" ref={listItemRef}>
              <Selectable
                fullWidth
                headline={`All ${memberCount ? `(${memberCount})` : ""}`}
                onClick={() => (!filterIsSelected ? onFilterClick() : null)}
                selected={filterIsSelected}
                size={SelectableSize.Large}
              />
            </li> */}
            {filtersList.map((filter, i) => (
              <li
                key={`focus-filter-${i}`}
                ref={(el) => (listItemsRef.current[i] = el)}
              >
                <Selectable
                  fullWidth
                  headline={filter.name}
                  onClick={() => onFilterClick(filter.id)}
                  selected={filter.active}
                  disabled={filter.count === 0}
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
          }
          .picker__container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
            width: 100%;
          }
          .top {
            margin-bottom: 1.5rem;
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
