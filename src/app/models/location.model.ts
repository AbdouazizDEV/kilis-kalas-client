export interface LocationPlace {
  id: string;
  label: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
}

export interface LocationSelection {
  label: string;
  latitude: number;
  longitude: number;
}

export type RouteField = 'pickup' | 'destination';
