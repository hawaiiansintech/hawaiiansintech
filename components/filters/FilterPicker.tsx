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
  filtersList: PickerFilter[];
  activeFilters: PickerFilter[];
  onFilterClick: (id?: string, filterType?: string) => any;
  onFilterSelect: (filterSelect?: string, enable?: boolean) => any;
  selectedMemberCount?: number;
}

export default function FilterPicker({
  filtersList,
  activeFilters,
  onFilterClick,
  onFilterSelect,
  selectedMemberCount,
}: FilterPickerProps) {
  const width = useWindowWidth();
  const [defaultHeight, setDefaultHeight] = useState<number>();
  const [focusActive, setFocusActive] = useState<boolean>(true);
  const [industryActive, setIndustryActive] = useState<boolean>();
  const [regionActive, setRegionActive] = useState<boolean>();
  const [experienceActive, setExperienceActive] = useState<boolean>();
  const listRef = useRef<HTMLUListElement>();
  const listItemsRef = useRef<HTMLLIElement[]>([]);
  const filterIsSelected = activeFilters.length !== 0;

  useLayoutEffect(() => {
    if (!listItemsRef) return;
    setDefaultHeight(listRef.current.scrollHeight);
  }, [width]);

  function activateFilter(setFilter: Function, filtertype: string) {
    const filterSetList = [
      setFocusActive,
      setIndustryActive,
      setRegionActive,
      setExperienceActive,
    ];
    for (const filterSet of filterSetList) {
      if (filterSet !== setFilter) filterSet(false);
    }
    setFilter(true);
    onFilterSelect(filtertype);
  }

  return (
    <>
      <div className="picker">
        <div className="picker__selection">
          <DataList gap="1rem 3rem">
            <FilterPickerCategory
              category="Focus"
              active={focusActive}
              onClick={() => activateFilter(setFocusActive, "focus")}
            />
            <FilterPickerCategory
              category="Industry"
              active={industryActive}
              onClick={() => activateFilter(setIndustryActive, "industry")}
            />
            <FilterPickerCategory
              category="Experience"
              active={experienceActive}
              onClick={() => activateFilter(setExperienceActive, "experience")}
            />
            <FilterPickerCategory
              category="Region"
              active={regionActive}
              onClick={() => activateFilter(setRegionActive, "region")}
            />
            <div className="selected-member-count">{`${
              filterIsSelected
                ? `Selected (${selectedMemberCount})`
                : `All (${selectedMemberCount})`
            }`}</div>
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
                  onClick={() => onFilterClick(focus.id)}
                  selected={true}
                  size={SelectableSize.Large}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="picker__container">
          <ul className="picker__list" ref={listRef}>
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
          .selected-member-count {
            color: ${filterIsSelected
              ? theme.color.brand.alt
              : theme.color.text.alt2};
            position: absolute;
            right: 2rem;
            transition: color 0.5s ease;
          }
          @media screen and (min-width: ${theme.layout.breakPoints.medium}) {
            .picker__list {
              margin-bottom: 0;
              max-height: initial;
            }
          }
          @media screen and (max-width: ${theme.layout.breakPoints.medium}) {
            .selected-member-count {
              position: static;
              width: 100%;
              margin-top: 1rem;
            }
          }
        `}</style>
      </div>
    </>
  );
}