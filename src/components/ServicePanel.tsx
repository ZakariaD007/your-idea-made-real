import { useState, useEffect, useRef } from 'react';
import { Menu, MapPin, Plus, X } from 'lucide-react';
import { Service, ServiceType } from '@/data/services';
import { ServiceCard } from './ServiceCard';
import { FilterChips } from './FilterChips';
import { SearchInput } from './SearchInput';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { RouteInfo } from '@/hooks/useDirections';

interface ServicePanelProps {
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  filteredServices: Service[];
  activeFilters: ServiceType[];
  onToggleFilter: (type: ServiceType) => void;
  availableTypes: ServiceType[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isPlacingMarker: boolean;
  onStartPlacingMarker: () => void;
  onCancelPlacement: () => void;
  isLoading?: boolean;
  onGetDirections?: (service: Service) => void;
  onClearDirections?: () => void;
  isLoadingDirections?: boolean;
  activeRoute?: RouteInfo | null;
}

export function ServicePanel({
  selectedService,
  onSelectService,
  filteredServices,
  activeFilters,
  onToggleFilter,
  availableTypes,
  searchQuery,
  onSearchChange,
  isPlacingMarker,
  onStartPlacingMarker,
  onCancelPlacement,
  isLoading = false,
  onGetDirections,
  onClearDirections,
  isLoadingDirections,
  activeRoute,
}: ServicePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selected service when it changes
  useEffect(() => {
    if (selectedService && scrollAreaRef.current) {
      const selectedCard = scrollAreaRef.current.querySelector(
        `[data-service-id="${selectedService.id}"]`
      );
      if (selectedCard) {
        selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedService]);

  return (
    <div
      className={cn(
        'bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-0 md:w-16' : 'w-full md:w-[400px] lg:w-[440px]'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className={cn('flex items-center gap-3', isCollapsed && 'hidden md:hidden')}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Service Finder</h1>
              <p className="text-xs text-muted-foreground">Find nearby public services</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(isCollapsed && 'hidden md:hidden')}>
              <ThemeToggle />
            </div>
            <div className={cn(isCollapsed && 'hidden md:hidden')}>
              <UserMenu />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {!isCollapsed && (
          <>
            <SearchInput
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search by name or address..."
            />
            <div className="mt-4">
              <FilterChips activeFilters={activeFilters} onToggle={onToggleFilter} availableTypes={availableTypes} />
            </div>
            {user && (
              <div className="mt-4">
                {isPlacingMarker ? (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={onCancelPlacement}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Placement
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={onStartPlacingMarker}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Suggest a Service
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Service List */}
      {!isCollapsed && (
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="p-4 space-y-3">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p>Loading services...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No services found</p>
                <p className="text-sm mt-1">Try adjusting your filters or search</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-2">
                  {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
                </p>
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isSelected={selectedService?.id === service.id}
                    onClick={() => onSelectService(service)}
                    onGetDirections={onGetDirections}
                    onClearDirections={onClearDirections}
                    isLoadingDirections={isLoadingDirections}
                    activeRoute={selectedService?.id === service.id ? activeRoute : null}
                  />
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
