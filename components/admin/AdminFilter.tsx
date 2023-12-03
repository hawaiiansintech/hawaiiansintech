import { FirebaseTablesEnum, StatusEnum } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { useState } from "react";
import { Filter, getFilters } from "@/lib/api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "@/components/ui/input";

interface AdminFilterProps {
  filterTypeSingular: string;
  filterTypePlural: string;
  filterTable: FirebaseTablesEnum;
  memberId: string;
  filters: { name: string; id: string; status: string }[];
  setFilters: (filter: { name: string; id: string; status: string }[]) => void;
  emoji: string;
  suggestedFilter: string;
  setSuggestedFilter: (suggestedFilter: string) => void;
}

export default function AdminFilter({
  filterTypeSingular,
  filterTypePlural,
  filterTable,
  memberId,
  filters,
  setFilters,
  emoji,
  suggestedFilter,
  setSuggestedFilter,
}: AdminFilterProps) {
  const [open, setOpen] = useState(false);
  const [allFilters, setAllFilters] = useState<Filter[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(filters.map((f) => f.id));
  const [suggestOpen, setSuggestOpen] = useState(false);

  const filterClass = "inline-block rounded-xl border px-3 py-0.5 text-sm tracking-wide text-secondary-foreground";

  const handleOpen = async () => {
    setOpen(!open);
    (suggestedFilter === "" || suggestedFilter === null) && setSuggestOpen(false);
    allFilters.length === 0 && setAllFilters(await getFilters(filterTable));
  };

  const handleSelect = (filter: Filter) => {
    console.log(selectedFilters.includes(filter.id) ? "true" : "false");
    if (selectedFilters.includes(filter.id)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter.id));
      setFilters(filters.filter((f) => f.id !== filter.id));
    } else {
      setSelectedFilters([...selectedFilters, filter.id]);
      setFilters([...filters, { name: filter.name, id: filter.id, status: StatusEnum.APPROVED }]);
    }
  };

  return (
    <div className="col-span-2">
      <h4 className="text-sm font-semibold">{filterTypePlural}</h4>
      <div className="flex flex-wrap gap-1 py-3">
        {filters &&
          filters.map((filter, i) => {
            const focusNotApproved = filter.status !== StatusEnum.APPROVED;
            return (
              <div className={filterClass}>
                <span
                  className={cn(focusNotApproved && `bg-violet-600/20 font-medium text-violet-600`)}
                  key={memberId + filter.id}
                >
                  {filter.name}
                  {focusNotApproved ? ` (${filter.status})` : null}
                </span>
              </div>
            );
          })}
        {suggestedFilter && (
          <div className={filterClass}>
            <span className={cn(`bg-violet-600/20 font-medium text-violet-600`)} key={suggestedFilter}>
              {suggestedFilter} (pending approval)
            </span>
          </div>
        )}
        <Button className="absolute right-10" variant="secondary" size="sm" onClick={handleOpen}>
          ✏️
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="gap-0 p-0 outline-none bg-white">
            <DialogHeader className="px-4 pb-4 pt-5">
              <DialogTitle className="text-2xl">
                {filterTypePlural} <span className="text-3xl">{emoji}</span>
              </DialogTitle>
              <DialogDescription>
                Edit your {filterTypePlural.toLowerCase()} list, you can have up to 3
              </DialogDescription>
            </DialogHeader>
            <Command className="h-80 border-t">
              <CommandInput placeholder={"Search " + filterTypePlural.toLowerCase()} className="h-9" />
              <CommandEmpty>No {filterTypePlural.toLowerCase()} found.</CommandEmpty>
              <CommandGroup className="overflow-auto">
                {allFilters.map((filter) => (
                  <CommandItem key={filter.id} value={filter.name} onSelect={() => handleSelect(filter)}>
                    {filter.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedFilters.includes(filter.id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
            <DialogFooter className="border-t p-4 sm:justify-start">
              <DialogHeader>
                {!suggestOpen ? (
                  <>
                    <Button variant="secondary" size="sm" onClick={() => setSuggestOpen(true)}>
                      Suggest a new {filterTypeSingular}
                    </Button>
                  </>
                ) : (
                  <>
                    <DialogTitle className="text-sm">Please suggest with care 🤙🏽</DialogTitle>
                    <DialogDescription className="text-xs pb-2">
                      Suggesting a new label increases the time it takes to approve your entry, as we manually review
                      all submissions. Please consider any existing labels that might fit your situation.
                    </DialogDescription>
                    <Input
                      name={"usernamef"}
                      placeholder={"New " + filterTypeSingular}
                      className={suggestedFilter ? " bg-brown-600/20" : "bg-white"}
                      value={suggestedFilter}
                      onChange={(e) => {
                        setSuggestedFilter(e.target.value);
                      }}
                    />
                  </>
                )}
              </DialogHeader>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
