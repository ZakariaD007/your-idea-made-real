import { lazy, Suspense } from 'react';
import { Service } from '@/data/services';

interface ServiceMapProps {
  services: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
}

// Lazy load the map component to avoid SSR issues
const MapContent = lazy(() => import('./MapContent'));

export function ServiceMap({ services, selectedService, onSelectService }: ServiceMapProps) {
  return (
    <Suspense fallback={
      <div className="h-full w-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    }>
      <MapContent 
        services={services}
        selectedService={selectedService}
        onSelectService={onSelectService}
      />
    </Suspense>
  );
}
