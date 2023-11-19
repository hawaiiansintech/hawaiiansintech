import { StatusEnum } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface AdminFilterProps {
  filterType: string;
  memberId: string;
  filters: { name: string; id: string; status: string }[];
  setFilters: (filter: { name: string; id: string; status: string }[]) => void;
}

export default function AdminFilter({ filterType, memberId, filters, setFilters }: AdminFilterProps) {
  return (
    <div className="col-span-2">
      <h4 className="text-sm font-semibold">{filterType}</h4>
      <div className="flex flex-wrap gap-1 py-3">
        {filters &&
          filters.map((focus, i) => {
            const focusNotApproved = focus.status !== StatusEnum.APPROVED;
            return (
              <div
                className="
                        relative 
                        inline-block 
                        rounded-xl 
                        border 
                        px-3 
                        py-0.5 
                        text-sm 
                        tracking-wide 
                        text-secondary-foreground
                        mr-3
                        my-1
                      "
              >
                <span
                  className={cn(focusNotApproved && `bg-violet-600/20 font-medium text-violet-600`)}
                  key={memberId + focus.id}
                >
                  {focus.name}
                  {focusNotApproved ? ` (${focus.status})` : null}
                </span>
                <Button
                  className="absolute right-4 bottom-3 transform translate-x-full rounded-full h-6 px-3"
                  variant="secondary"
                  onClick={() => {
                    const newFilter = filters.filter((f) => f.id !== focus.id);
                    setFilters(newFilter);
                  }}
                >
                  x
                </Button>
              </div>
            );
          })}
        <Button className="absolute right-10" variant="secondary">
          +
        </Button>
      </div>
    </div>
  );
}
