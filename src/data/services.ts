export type ServiceType = 'clinic' | 'library' | 'shelter' | 'food';

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

// Cape Town area mock data
export const services: Service[] = [
  {
    id: '1',
    name: 'City Health Clinic',
    type: 'clinic',
    address: '45 Buitenkant Street, Cape Town',
    lat: -33.9271,
    lng: 18.4263,
    phone: '+27 21 400 3700',
    hours: 'Mon-Fri: 8am-5pm',
    description: 'Free primary healthcare services for all residents.',
  },
  {
    id: '2',
    name: 'Woodstock Community Clinic',
    type: 'clinic',
    address: '12 Gympie Street, Woodstock',
    lat: -33.9291,
    lng: 18.4445,
    phone: '+27 21 448 1234',
    hours: 'Mon-Fri: 7:30am-4:30pm',
    description: 'Walk-in clinic with immunizations and maternal care.',
  },
  {
    id: '3',
    name: 'Cape Town Central Library',
    type: 'library',
    address: '1 Heerengracht Street, Cape Town',
    lat: -33.9198,
    lng: 18.4241,
    phone: '+27 21 467 1840',
    hours: 'Mon-Sat: 9am-6pm',
    description: 'Main public library with free internet access and study rooms.',
  },
  {
    id: '4',
    name: 'Salt River Library',
    type: 'library',
    address: '2 Railway Road, Salt River',
    lat: -33.9318,
    lng: 18.4651,
    phone: '+27 21 448 5678',
    hours: 'Mon-Fri: 9am-5pm, Sat: 9am-1pm',
    description: 'Community library with children\'s programs.',
  },
  {
    id: '5',
    name: 'Haven Night Shelter',
    type: 'shelter',
    address: '16 Napier Street, Green Point',
    lat: -33.9085,
    lng: 18.4155,
    phone: '+27 21 425 1110',
    hours: '24 hours',
    description: 'Emergency overnight accommodation and meals.',
  },
  {
    id: '6',
    name: 'The Carpenter\'s Shop',
    type: 'shelter',
    address: '78 Buitenkant Street, Cape Town',
    lat: -33.9295,
    lng: 18.4268,
    phone: '+27 21 461 1821',
    hours: 'Mon-Fri: 8am-4pm',
    description: 'Day shelter with skills training and social services.',
  },
  {
    id: '7',
    name: 'Ladles of Love',
    type: 'food',
    address: '45 Roeland Street, Cape Town',
    lat: -33.9310,
    lng: 18.4225,
    phone: '+27 21 461 8100',
    hours: 'Mon-Sat: 11am-2pm',
    description: 'Community kitchen serving free nutritious meals.',
  },
  {
    id: '8',
    name: 'SA Harvest Food Bank',
    type: 'food',
    address: '22 Lower Main Road, Observatory',
    lat: -33.9378,
    lng: 18.4720,
    phone: '+27 21 447 7030',
    hours: 'Mon-Fri: 9am-4pm',
    description: 'Food parcels for families in need.',
  },
  {
    id: '9',
    name: 'Langa Community Health Centre',
    type: 'clinic',
    address: 'Washington Street, Langa',
    lat: -33.9450,
    lng: 18.5251,
    phone: '+27 21 694 1234',
    hours: 'Mon-Fri: 7am-6pm',
    description: 'Comprehensive healthcare including HIV/TB services.',
  },
  {
    id: '10',
    name: 'Athlone Library',
    type: 'library',
    address: 'Aden Avenue, Athlone',
    lat: -33.9620,
    lng: 18.5030,
    phone: '+27 21 638 5100',
    hours: 'Mon-Sat: 9am-5pm',
    description: 'Large community library with digital resources.',
  },
];

export const serviceTypeLabels: Record<ServiceType, string> = {
  clinic: 'Health Clinic',
  library: 'Library',
  shelter: 'Shelter',
  food: 'Food Bank',
};

export const serviceTypeIcons: Record<ServiceType, string> = {
  clinic: '🏥',
  library: '📚',
  shelter: '🏠',
  food: '🍽️',
};
