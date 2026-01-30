import { useState, useMemo, useEffect } from 'react';
import { Service, ServiceType, services } from '@/data/services';
import { ServicePanel } from '@/components/ServicePanel';
import { ServiceMap } from '@/components/ServiceMap';
import { supabase } from '@/lib/supabase';
import type { Location } from '@/types/database';

const Index = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [activeFilters, setActiveFilters] = useState<ServiceType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [approvedLocations, setApprovedLocations] = useState<Location[]>([]);

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

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
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
  }, [activeFilters, searchQuery]);

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
        onLocationAdded={fetchApprovedLocations}
      />
      <div className="flex-1 min-h-[50vh] md:min-h-full relative">
        <ServiceMap
          services={filteredServices}
          locations={approvedLocations}
          selectedService={selectedService}
          onSelectService={setSelectedService}
          onSelectLocation={setSelectedLocation}
        />
      </div>
    </div>
  );
};

export default Index;
