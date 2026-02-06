import { MapPin, Clock, Phone, Navigation, Loader2, X } from 'lucide-react';
import { Service, getServiceTypeLabel, coreServiceTypeLabels } from '@/data/services';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { formatDistance, formatDuration, RouteInfo } from '@/hooks/useDirections';

interface ServiceCardProps {
  service: Service;
  isSelected?: boolean;
  onClick?: () => void;
  onGetDirections?: (service: Service) => void;
  onClearDirections?: () => void;
  isLoadingDirections?: boolean;
  activeRoute?: RouteInfo | null;
}

const typeColors: Record<string, string> = {
  clinic: 'service-badge-clinic',
  library: 'service-badge-library',
  shelter: 'service-badge-shelter',
  food: 'service-badge-food',
};

// Get badge class - use specific color for core types, default for custom
const getBadgeClass = (type: string): string => {
  if (type in coreServiceTypeLabels) {
    return typeColors[type] || '';
  }
  return 'bg-primary/10 text-primary';
};

export function ServiceCard({ 
  service, 
  isSelected, 
  onClick, 
  onGetDirections,
  onClearDirections,
  isLoadingDirections,
  activeRoute,
}: ServiceCardProps) {
  return (
    <div
      data-service-id={service.id}
      className={cn(
        'service-card scroll-mt-4',
        isSelected && 'border-primary ring-2 ring-primary/20 bg-primary/5'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-foreground leading-tight">{service.name}</h3>
        <span className={cn('service-badge shrink-0', getBadgeClass(service.type))}>
          {getServiceTypeLabel(service.type)}
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{service.address}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>{service.hours}</span>
        </div>
        
        {service.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <a 
              href={`tel:${service.phone}`} 
              className="hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {service.phone}
            </a>
          </div>
        )}
      </div>
      
      {service.description && (
        <p className="mt-3 text-sm text-muted-foreground/80 line-clamp-2">
          {service.description}
        </p>
      )}
      
      {isSelected && (
        <div className="mt-3 space-y-2">
          {activeRoute ? (
            <>
              <div className="flex items-center justify-between p-2 bg-primary/10 rounded-lg text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-primary">
                    {formatDistance(activeRoute.distance)}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {formatDuration(activeRoute.duration)} walking
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearDirections?.();
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Route
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={isLoadingDirections}
              onClick={(e) => {
                e.stopPropagation();
                onGetDirections?.(service);
              }}
            >
              {isLoadingDirections ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4 mr-2" />
              )}
              {isLoadingDirections ? 'Getting Directions...' : 'Get Directions'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
