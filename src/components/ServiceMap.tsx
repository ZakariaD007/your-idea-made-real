import { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Location } from '@/types/database';
import { Service, getServiceTypeIcon } from '@/data/services';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ServiceMapProps {
  services: Service[];
  locations: Location[];
  selectedService: Service | null;
  selectedLocation: Location | null;
  onSelectService: (service: Service | null) => void;
  onSelectLocation: (location: Location | null) => void;
  isPlacingMarker: boolean;
  onMarkerPlaced: (coords: { lat: number; lng: number }) => void;
  pendingMarkerCoords: { lat: number; lng: number } | null;
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
  selectedLocation,
  onSelectService,
  onSelectLocation,
  isPlacingMarker,
  onMarkerPlaced,
  pendingMarkerCoords,
}: ServiceMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const pendingMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

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

  // Handle map clicks for placing markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const handleMapClick = (e: maplibregl.MapMouseEvent) => {
      // Check if click is on a marker element
      const target = e.originalEvent.target as HTMLElement;
      const isMarkerClick = target.closest('.service-marker') || target.closest('.location-marker');
      
      if (isPlacingMarker) {
        if (!user) {
          toast({
            variant: 'destructive',
            title: 'Sign in required',
            description: 'Please sign in to suggest a service location.',
          });
          return;
        }
        const { lng, lat } = e.lngLat;
        onMarkerPlaced({ lat, lng });
      } else if (!isMarkerClick) {
        // Click on empty map area - deselect
        onSelectService(null);
        onSelectLocation(null);
      }
    };

    map.current.on('click', handleMapClick);

    // Change cursor when in placing mode
    if (isPlacingMarker) {
      map.current.getCanvas().style.cursor = 'crosshair';
    } else {
      map.current.getCanvas().style.cursor = '';
    }

    return () => {
      map.current?.off('click', handleMapClick);
    };
  }, [isPlacingMarker, mapLoaded, user, toast, onMarkerPlaced]);

  // Handle pending marker display
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing pending marker
    if (pendingMarkerRef.current) {
      pendingMarkerRef.current.remove();
      pendingMarkerRef.current = null;
    }

    // Add new pending marker if coordinates exist
    if (pendingMarkerCoords) {
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="
          background-color: ${typeColors['pending']};
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
          border: 4px solid white;
          animation: pulse 1.5s infinite;
        ">
          📍
        </div>
      `;

      pendingMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([pendingMarkerCoords.lng, pendingMarkerCoords.lat])
        .addTo(map.current);
    }
  }, [pendingMarkerCoords, mapLoaded]);

  // Update markers when services or locations change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add service markers
    services.forEach((service) => {
      const isSelected = selectedService?.id === service.id;
      const el = document.createElement('div');
      el.className = 'service-marker';
      el.innerHTML = `
        <div style="position: relative;">
          ${isSelected ? `
            <div style="
              position: absolute;
              bottom: 100%;
              left: 50%;
              transform: translateX(-50%);
              background-color: hsl(var(--foreground));
              color: hsl(var(--background));
              padding: 6px 12px;
              border-radius: 8px;
              font-size: 13px;
              font-weight: 600;
              white-space: nowrap;
              margin-bottom: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              z-index: 10;
            ">
              ${service.name}
              <div style="
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 6px solid hsl(var(--foreground));
              "></div>
            </div>
          ` : ''}
          <div style="
            background-color: ${typeColors[service.type] || '#6366f1'};
            width: ${isSelected ? '44px' : '36px'};
            height: ${isSelected ? '44px' : '36px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? '22px' : '18px'};
            box-shadow: ${isSelected ? '0 6px 20px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.25)'};
            border: ${isSelected ? '4px solid white' : '3px solid white'};
            cursor: pointer;
            transition: all 0.2s ease;
            transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
          ">
            ${getServiceTypeIcon(service.type)}
          </div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        // Toggle selection - deselect if already selected
        if (selectedService?.id === service.id) {
          onSelectService(null);
        } else {
          onSelectService(service);
        }
        onSelectLocation(null);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([service.lng, service.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Add approved location markers (user-submitted)
    locations.forEach((location) => {
      const isSelected = selectedLocation?.id === location.id;
      const el = document.createElement('div');
      el.className = 'location-marker';
      el.innerHTML = `
        <div style="position: relative;">
          ${isSelected ? `
            <div style="
              position: absolute;
              bottom: 100%;
              left: 50%;
              transform: translateX(-50%);
              background-color: hsl(var(--foreground));
              color: hsl(var(--background));
              padding: 6px 12px;
              border-radius: 8px;
              font-size: 13px;
              font-weight: 600;
              white-space: nowrap;
              margin-bottom: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              z-index: 10;
            ">
              ${location.name}
              <div style="
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 6px solid hsl(var(--foreground));
              "></div>
            </div>
          ` : ''}
          <div style="
            background-color: ${typeColors['pending']};
            width: ${isSelected ? '44px' : '32px'};
            height: ${isSelected ? '44px' : '32px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? '22px' : '16px'};
            box-shadow: ${isSelected ? '0 6px 20px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.25)'};
            border: ${isSelected ? '4px solid white' : '3px solid white'};
            cursor: pointer;
            transition: all 0.2s ease;
            transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
          ">
            📍
          </div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        // Toggle selection - deselect if already selected
        if (selectedLocation?.id === location.id) {
          onSelectLocation(null);
        } else {
          onSelectLocation(location);
        }
        onSelectService(null);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [services, locations, selectedService, selectedLocation, mapLoaded, onSelectService, onSelectLocation]);

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
    <>
      <div ref={mapContainer} className="h-full w-full" />
      {isPlacingMarker && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg z-10 text-sm font-medium">
          Click on the map to place a service marker
        </div>
      )}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </>
  );
}
