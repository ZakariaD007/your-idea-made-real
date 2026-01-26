import { ServiceType, serviceTypeLabels, serviceTypeIcons } from '@/data/services';
import { cn } from '@/lib/utils';

interface FilterChipsProps {
  activeFilters: ServiceType[];
  onToggle: (type: ServiceType) => void;
}

const allTypes: ServiceType[] = ['clinic', 'library', 'shelter', 'food'];

export function FilterChips({ activeFilters, onToggle }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {allTypes.map((type) => {
        const isActive = activeFilters.includes(type);
        return (
          <button
            key={type}
            onClick={() => onToggle(type)}
            className={cn(
              'filter-chip',
              isActive && 'filter-chip-active'
            )}
          >
            <span>{serviceTypeIcons[type]}</span>
            <span>{serviceTypeLabels[type]}</span>
          </button>
        );
      })}
    </div>
  );
}
