import { useState, useMemo, useEffect } from 'react';
import { Service, ServiceType } from '@/data/services';
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
  const [services, setServices] = useState<Service[]>([]);
  const [approvedLocations, setApprovedLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Marker placement state
  const [isPlacingMarker, setIsPlacingMarker] = useState(false);
  const [pendingMarkerCoords, setPendingMarkerCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showSuggestDialog, setShowSuggestDialog] = useState(false);

  // Fetch services from Supabase
  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*');
    
    if (data && !error) {
      setServices(data.map((s) => ({
        id: s.id,
        name: s.name,
        type: s.type as ServiceType,
        address: s.address,
        lat: Number(s.lat),
        lng: Number(s.lng),
        phone: s.phone || undefined,
        hours: s.hours,
        description: s.description || undefined,
      })));
    }
    setIsLoading(false);
  };

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
    fetchServices();
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

  // Combine database services with approved locations
  const allServices = useMemo(() => {
    return [...services, ...approvedAsServices];
  }, [services, approvedAsServices]);

  // Get unique service types from all services for dynamic filter chips
  const availableServiceTypes = useMemo(() => {
    const types = new Set<string>();
    allServices.forEach((service) => types.add(service.type));
    // Sort with core types first, then alphabetically
    const coreTypes = ['clinic', 'library', 'shelter', 'food'];
    return Array.from(types).sort((a, b) => {
      const aIsCore = coreTypes.includes(a);
      const bIsCore = coreTypes.includes(b);
      if (aIsCore && !bIsCore) return -1;
      if (!aIsCore && bIsCore) return 1;
      return a.localeCompare(b);
    });
  }, [allServices]);

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
        availableTypes={availableServiceTypes}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isPlacingMarker={isPlacingMarker}
        onStartPlacingMarker={handleStartPlacingMarker}
        onCancelPlacement={handleCancelPlacement}
        isLoading={isLoading}
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
