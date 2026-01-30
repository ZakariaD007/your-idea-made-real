import { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Location } from '@/types/database';
import { Service, serviceTypeLabels, serviceTypeIcons } from '@/data/services';

interface ServiceMapProps {
  services: Service[];
  locations: Location[];
  selectedService: Service | null;
  onSelectService: (service: Service | null) => void;
  onSelectLocation: (location: Location | null) => void;
}

const MAPTILER_KEY = 'wTsvJCy56XFWoAJfKteb';

const typeColors: Record<string, string> = {
  clinic: '#e84393',
  library: '#3b82f6',
  shelter: '#f59e0b',
  food: '#22c55e',
  pending: '#8b5cf6',
};

export function ServiceMap({ 
  services, 
  locations,
  selectedService, 
  onSelectService,
  onSelectLocation 
}: ServiceMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`,
      center: [18.455, -33.925], // Cape Town
      zoom: 13,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when services or locations change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add service markers
    services.forEach((service) => {
      const el = document.createElement('div');
      el.className = 'service-marker';
      el.innerHTML = `
        <div style="
          background-color: ${typeColors[service.type] || '#6366f1'};
          width: ${selectedService?.id === service.id ? '44px' : '36px'};
          height: ${selectedService?.id === service.id ? '44px' : '36px'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${selectedService?.id === service.id ? '22px' : '18px'};
          box-shadow: ${selectedService?.id === service.id ? '0 6px 20px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.25)'};
          border: ${selectedService?.id === service.id ? '4px solid white' : '3px solid white'};
          cursor: pointer;
          transition: all 0.2s ease;
          transform: ${selectedService?.id === service.id ? 'scale(1.1)' : 'scale(1)'};
        ">
          ${serviceTypeIcons[service.type]}
        </div>
      `;

      el.addEventListener('click', () => {
        onSelectService(service);
        onSelectLocation(null);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([service.lng, service.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Add location markers (user-submitted)
    locations.forEach((location) => {
      const el = document.createElement('div');
      el.className = 'location-marker';
      el.innerHTML = `
        <div style="
          background-color: ${typeColors['pending']};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          border: 3px solid white;
          cursor: pointer;
        ">
          📍
        </div>
      `;

      el.addEventListener('click', () => {
        onSelectLocation(location);
        onSelectService(null);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [services, locations, selectedService, mapLoaded, onSelectService, onSelectLocation]);

  // Pan to selected service
  useEffect(() => {
    if (!map.current || !selectedService) return;
    
    map.current.flyTo({
      center: [selectedService.lng, selectedService.lat],
      zoom: 15,
      duration: 1000,
    });
  }, [selectedService]);

  return (
    <div ref={mapContainer} className="h-full w-full" />
  );
}
