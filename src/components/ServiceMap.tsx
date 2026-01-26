import { Map, Marker, Overlay } from 'pigeon-maps';
import { Service, serviceTypeLabels, serviceTypeIcons } from '@/data/services';
import { useState, useEffect } from 'react';

interface ServiceMapProps {
  services: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
}

const typeColors: Record<string, string> = {
  clinic: '#e84393',
  library: '#3b82f6',
  shelter: '#f59e0b',
  food: '#22c55e',
};

export function ServiceMap({ services, selectedService, onSelectService }: ServiceMapProps) {
  // Cape Town center coordinates
  const [center, setCenter] = useState<[number, number]>([-33.925, 18.455]);
  const [zoom, setZoom] = useState(13);
  const [hoveredService, setHoveredService] = useState<Service | null>(null);

  // Pan to selected service
  useEffect(() => {
    if (selectedService) {
      setCenter([selectedService.lat, selectedService.lng]);
      setZoom(15);
    }
  }, [selectedService]);

  return (
    <div className="h-full w-full">
      <Map
        center={center}
        zoom={zoom}
        onBoundsChanged={({ center, zoom }) => {
          setCenter(center);
          setZoom(zoom);
        }}
      >
        {services.map((service) => (
          <Marker
            key={service.id}
            anchor={[service.lat, service.lng]}
            onClick={() => onSelectService(service)}
            onMouseOver={() => setHoveredService(service)}
            onMouseOut={() => setHoveredService(null)}
          >
            <div
              style={{
                backgroundColor: typeColors[service.type] || '#6366f1',
                width: selectedService?.id === service.id ? 44 : 36,
                height: selectedService?.id === service.id ? 44 : 36,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: selectedService?.id === service.id ? 22 : 18,
                boxShadow: selectedService?.id === service.id 
                  ? '0 6px 20px rgba(0,0,0,0.4)' 
                  : '0 4px 12px rgba(0,0,0,0.25)',
                border: selectedService?.id === service.id ? '4px solid white' : '3px solid white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: selectedService?.id === service.id ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {serviceTypeIcons[service.type]}
            </div>
          </Marker>
        ))}

        {/* Tooltip overlay for hovered service */}
        {hoveredService && (
          <Overlay anchor={[hoveredService.lat, hoveredService.lng]} offset={[0, -50]}>
            <div className="bg-card text-card-foreground px-3 py-2 rounded-lg shadow-elevated text-sm whitespace-nowrap">
              <p className="font-semibold">{hoveredService.name}</p>
              <p className="text-muted-foreground text-xs">{serviceTypeLabels[hoveredService.type]}</p>
            </div>
          </Overlay>
        )}
      </Map>
    </div>
  );
}
