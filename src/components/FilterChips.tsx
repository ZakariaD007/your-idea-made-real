import { getServiceTypeLabel, getServiceTypeIcon, ServiceType } from '@/data/services';
import { cn } from '@/lib/utils';

interface FilterChipsProps {
  activeFilters: ServiceType[];
  onToggle: (type: ServiceType) => void;
  availableTypes: ServiceType[];
}

export function FilterChips({ activeFilters, onToggle, availableTypes }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {availableTypes.map((type) => {
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
            <span>{getServiceTypeIcon(type)}</span>
            <span>{getServiceTypeLabel(type)}</span>
          </button>
        );
      })}
    </div>
  );
}
