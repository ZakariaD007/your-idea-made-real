import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface RouteInfo {
  coordinates: [number, number][];
  distance: number; // in meters
  duration: number; // in seconds
}

export function useDirections() {
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  const clearRoute = useCallback(() => {
    setRoute(null);
    setUserLocation(null);
  }, []);

  const getDirections = useCallback(async (destinationLat: number, destinationLng: number) => {
    setIsLoading(true);
    
    try {
      // Get user's current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by your browser'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const originLat = position.coords.latitude;
      const originLng = position.coords.longitude;
      
      setUserLocation({ lat: originLat, lng: originLng });

      // Call OSRM API for walking directions
      const url = `https://router.project-osrm.org/route/v1/foot/${originLng},${originLat};${destinationLng},${destinationLat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to get directions');
      }

      const data = await response.json();
      
      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }

      const routeData = data.routes[0];
      const coordinates = routeData.geometry.coordinates as [number, number][];
      
      setRoute({
        coordinates,
        distance: routeData.distance,
        duration: routeData.duration,
      });

      return {
        coordinates,
        distance: routeData.distance,
        duration: routeData.duration,
        userLocation: { lat: originLat, lng: originLng },
      };
    } catch (error) {
      console.error('Error getting directions:', error);
      
      let message = 'Unable to get directions';
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        variant: 'destructive',
        title: 'Directions Error',
        description: message,
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    route,
    userLocation,
    isLoading,
    getDirections,
    clearRoute,
  };
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)} sec`;
  }
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}
