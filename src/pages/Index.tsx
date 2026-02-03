import { useState, useMemo, useEffect } from 'react';
import { Service, ServiceType, services } from '@/data/services';
import { ServicePanel } from '@/components/ServicePanel';
import { ServiceMap } from '@/components/ServiceMap';
import { SuggestLocationDialog } from '@/components/SuggestLocationDialog';
import { supabase } from '@/lib/supabase';
import type { Location } from '@/types/database';

const Index = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [activeFilters, setActiveFilters] = useState<ServiceType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [approvedLocations, setApprovedLocations] = useState<Location[]>([]);
  
  // Marker placement state
  const [isPlacingMarker, setIsPlacingMarker] = useState(false);
  const [pendingMarkerCoords, setPendingMarkerCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showSuggestDialog, setShowSuggestDialog] = useState(false);

  const fetchApprovedLocations = async () => {
    const { data } = await supabase
      .from('locations')
      .select('*')
      .eq('status', 'approved');
    
    if (data) {
      setApprovedLocations(data);
    }
  };

  useEffect(() => {
    fetchApprovedLocations();
  }, []);

  const toggleFilter = (type: ServiceType) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Convert approved locations to Service format
  const approvedAsServices: Service[] = useMemo(() => {
    return approvedLocations.map((loc) => ({
      id: `loc-${loc.id}`,
      name: loc.name,
      type: (loc.service_type || 'clinic') as ServiceType,
      address: `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`,
      lat: Number(loc.latitude),
      lng: Number(loc.longitude),
      hours: 'Contact for hours',
      description: loc.description || undefined,
    }));
  }, [approvedLocations]);

  // Combine static services with approved locations
  const allServices = useMemo(() => {
    return [...services, ...approvedAsServices];
  }, [approvedAsServices]);

  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      if (activeFilters.length > 0 && !activeFilters.includes(service.type)) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          service.name.toLowerCase().includes(query) ||
          service.address.toLowerCase().includes(query) ||
          service.description?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [allServices, activeFilters, searchQuery]);

  const handleStartPlacingMarker = () => {
    setIsPlacingMarker(true);
    setPendingMarkerCoords(null);
  };

  const handleMarkerPlaced = (coords: { lat: number; lng: number }) => {
    setPendingMarkerCoords(coords);
    setIsPlacingMarker(false);
    setShowSuggestDialog(true);
  };

  const handleCancelPlacement = () => {
    setIsPlacingMarker(false);
    setPendingMarkerCoords(null);
  };

  const handleDialogClose = (open: boolean) => {
    setShowSuggestDialog(open);
    if (!open) {
      setPendingMarkerCoords(null);
    }
  };

  const handleLocationSuccess = () => {
    setPendingMarkerCoords(null);
    fetchApprovedLocations();
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden">
      <ServicePanel
        selectedService={selectedService}
        onSelectService={setSelectedService}
        filteredServices={filteredServices}
        activeFilters={activeFilters}
        onToggleFilter={toggleFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isPlacingMarker={isPlacingMarker}
        onStartPlacingMarker={handleStartPlacingMarker}
        onCancelPlacement={handleCancelPlacement}
      />
      <div className="flex-1 min-h-[50vh] md:min-h-full relative">
        <ServiceMap
          services={filteredServices}
          locations={approvedLocations}
          selectedService={selectedService}
          onSelectService={setSelectedService}
          onSelectLocation={setSelectedLocation}
          isPlacingMarker={isPlacingMarker}
          onMarkerPlaced={handleMarkerPlaced}
          pendingMarkerCoords={pendingMarkerCoords}
        />
      </div>

      <SuggestLocationDialog
        open={showSuggestDialog}
        onOpenChange={handleDialogClose}
        coordinates={pendingMarkerCoords}
        onSuccess={handleLocationSuccess}
      />
    </div>
  );
};

export default Index;
