export type ServiceType = 'clinic' | 'library' | 'shelter' | 'food';

export const serviceTypeLabels: Record<ServiceType, string> = {
  clinic: 'Clinic',
  library: 'Library',
  shelter: 'Shelter',
  food: 'Food Bank',
};

export const serviceTypeIcons: Record<ServiceType, string> = {
  clinic: '🏥',
  library: '📚',
  shelter: '🏠',
  food: '🍲',
};

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
