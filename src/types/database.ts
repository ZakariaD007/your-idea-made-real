export type AppRole = 'admin' | 'user';
export type LocationStatus = 'pending' | 'approved' | 'denied';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export type ServiceType = 'clinic' | 'library' | 'shelter' | 'food';

export interface ServiceRow {
  id: string;
  name: string;
  type: ServiceType;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  hours: string;
  description: string | null;
  created_at: string;
}

export interface Location {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  geometry?: unknown;
  status: LocationStatus;
  service_type: ServiceType;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LiveLocation {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          user_id: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      user_roles: {
        Row: UserRole;
        Insert: {
          user_id: string;
          role?: AppRole;
        };
        Update: {
          role?: AppRole;
        };
      };
      locations: {
        Row: Location;
        Insert: {
          name: string;
          description?: string | null;
          latitude: number;
          longitude: number;
          service_type?: ServiceType;
          status?: LocationStatus;
          created_by?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          latitude?: number;
          longitude?: number;
          service_type?: ServiceType;
          status?: LocationStatus;
          updated_at?: string;
        };
      };
      live_locations: {
        Row: LiveLocation;
        Insert: {
          user_id: string;
          latitude: number;
          longitude: number;
        };
        Update: {
          latitude?: number;
          longitude?: number;
          updated_at?: string;
        };
      };
    };
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: AppRole };
        Returns: boolean;
      };
    };
  };
}
