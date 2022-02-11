import { Focus } from "@/lib/api";
import Selectable from "./form/Selectable";

export interface FocusPickerFocus extends Focus {
  active?: boolean;
}

interface FocusPickerProps {
  focuses: FocusPickerFocus[];
  onFilterClick: (id: string) => any;
}

export default function FocusPicker({
  focuses,
  onFilterClick,
}: FocusPickerProps) {
  const visibleCount = 6;
  return (
    <ul>
      {focuses.map((focus, i) => (
        <li key={`focus-filter-${i}`}>
          <Selectable
            fullWidth
            headline={focus.name}
            onClick={() => onFilterClick(focus.id)}
            selected={focus.active}
            disabled={i >= visibleCount || focus.count === 0}
          />
        </li>
      ))}
      <style jsx>{`
        ul {
          display: flex;
          list-style: none;
          margin: 0 0 2rem;
          padding: 0;
        }
        li {
          flex-shrink: 0;
          width: calc((100vw - 4rem) / ${visibleCount} - 1rem);
          margin: 0 0.5rem 0 0;
          padding: 0;
        }
      `}</style>
    </ul>
  );
}
