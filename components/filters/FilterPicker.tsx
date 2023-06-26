import { Filter } from "@/lib/api";
import { cn } from "helpers";
import { useState } from "react";
import Selectable from "../form/Selectable";
import FormTag from "../FormTag";
import FilterPickerCategory from "./FilterPickerCategory";

export interface PickerFilter extends Filter {
  active?: boolean;
}

interface FilterPickerProps {
  filtersList: PickerFilter[];
  activeFilters: PickerFilter[];
  onFilterClick: (id?: string, filterType?: string) => any;
  onViewAll: () => any;
  onFilterSelect: (filterSelect?: string, enable?: boolean) => any;
  selectedMemberCount?: number;
  viewAll?: boolean;
}

export default function FilterPicker({
  filtersList,
  activeFilters,
  onFilterClick,
  onFilterSelect,
  selectedMemberCount,
  onViewAll,
  viewAll,
}: FilterPickerProps) {
  const [focusActive, setFocusActive] = useState<boolean>(true);
  const [industryActive, setIndustryActive] = useState<boolean>();
  const [regionActive, setRegionActive] = useState<boolean>();
  const [experienceActive, setExperienceActive] = useState<boolean>();
  const filterIsSelected = activeFilters.length !== 0;

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
      <div className="relative w-full">
        <ul className={`mb-4 flex min-h-[44px] w-full flex-wrap gap-2`}>
          {activeFilters.map((focus, i) => (
            <li key={`focus-filter-${i}`}>
              <FormTag onClick={() => onFilterClick(focus.id)}>
                {focus.name}
              </FormTag>
            </li>
          ))}
        </ul>
        <div className="mb-4 flex items-center">
          <div className="inline-flex gap-2 rounded-full bg-tan-300/50 p-1">
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
          </div>
          <h4
            className={cn(
              `grow text-right text-stone-600`,
              filterIsSelected && "text-brown-600"
            )}
          >{`${
            filterIsSelected
              ? `Selected (${selectedMemberCount})`
              : `All (${selectedMemberCount})`
          }`}</h4>
        </div>

        <ul className="flex flex-wrap gap-2 transition-all">
          {filtersList.map((filter, i) => (
            <li key={`focus-filter-${i}`}>
              <Selectable
                fullWidth
                headline={filter.name}
                onClick={() => onFilterClick(filter.id)}
                selected={filter.active}
                disabled={filter.count === 0}
                round
              />
            </li>
          ))}
          {viewAll && (
            <li>
              <button
                className={`
                  h-full
                  rounded-lg
                  border-4
                  border-transparent
                  bg-tan-300
                  px-2
                  py-1
                  hover:border-tan-500/50
                  hover:transition-all
                `}
                onClick={onViewAll}
              >
                ...
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
