// Core service types - these have predefined icons/labels
export type CoreServiceType = 'clinic' | 'library' | 'shelter' | 'food';

// ServiceType can be a core type or any custom string (for "other")
export type ServiceType = string;

export const coreServiceTypeLabels: Record<CoreServiceType, string> = {
  clinic: 'Clinic',
  library: 'Library',
  shelter: 'Shelter',
  food: 'Food Bank',
};

export const coreServiceTypeIcons: Record<CoreServiceType, string> = {
  clinic: '🏥',
  library: '📚',
  shelter: '🏠',
  food: '🍲',
};

// Helper to get label for any service type (core or custom)
export const getServiceTypeLabel = (type: string): string => {
  if (type in coreServiceTypeLabels) {
    return coreServiceTypeLabels[type as CoreServiceType];
  }
  // Capitalize first letter for custom types
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Helper to get icon for any service type (core or custom)
export const getServiceTypeIcon = (type: string): string => {
  if (type in coreServiceTypeIcons) {
    return coreServiceTypeIcons[type as CoreServiceType];
  }
  return '📍'; // Default icon for custom types
};

// For backwards compatibility
export const serviceTypeLabels = coreServiceTypeLabels;
export const serviceTypeIcons = coreServiceTypeIcons;

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  hours: string;
  description?: string;
}
