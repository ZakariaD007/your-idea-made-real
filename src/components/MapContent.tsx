import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Service, serviceTypeLabels, serviceTypeIcons } from '@/data/services';

interface MapContentProps {
  services: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
}

// Custom marker icons for each service type
const createIcon = (type: string) => {
  const colors: Record<string, string> = {
    clinic: '#e84393',
    library: '#3b82f6',
    shelter: '#f59e0b',
    food: '#22c55e',
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${colors[type] || '#6366f1'};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        border: 3px solid white;
        cursor: pointer;
      ">
        ${serviceTypeIcons[type as keyof typeof serviceTypeIcons] || '📍'}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

// Component to handle map view updates
function MapController({ selectedService }: { selectedService: Service | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedService) {
      map.flyTo([selectedService.lat, selectedService.lng], 15, {
        duration: 0.8,
      });
    }
  }, [selectedService, map]);

  return null;
}

export default function MapContent({ services, selectedService, onSelectService }: MapContentProps) {
  // Cape Town center coordinates
  const center: [number, number] = [-33.925, 18.455];

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController selectedService={selectedService} />

      {services.map((service) => (
        <Marker
          key={service.id}
          position={[service.lat, service.lng]}
          icon={createIcon(service.type)}
          eventHandlers={{
            click: () => onSelectService(service),
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-semibold">{service.name}</h3>
              <p className="text-sm opacity-75">{serviceTypeLabels[service.type]}</p>
              <p className="text-sm opacity-60 mt-1">{service.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
