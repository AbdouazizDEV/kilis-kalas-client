import { LocationPlace } from '../../models/location.model';

/** Bounding box approximatif de la région de Diourbel (SN). */
export const DIOURBEL_REGION_BOUNDS = {
  south: 14.35,
  west: -16.85,
  north: 15.5,
  east: -15.55,
} as const;

export const DIOURBEL_REGION_CENTER = {
  lat: 14.6551,
  lng: -16.2314,
} as const;

export function isWithinDiourbelRegion(latitude: number, longitude: number): boolean {
  return (
    latitude >= DIOURBEL_REGION_BOUNDS.south &&
    latitude <= DIOURBEL_REGION_BOUNDS.north &&
    longitude >= DIOURBEL_REGION_BOUNDS.west &&
    longitude <= DIOURBEL_REGION_BOUNDS.east
  );
}

export const DIOURBEL_FALLBACK_PLACES: LocationPlace[] = [
  { id: 'leona', label: 'Léona, Bambey', latitude: 14.6945, longitude: -16.4585 },
  { id: 'diamagueune', label: 'Diamagueune, Bambey', latitude: 14.7012, longitude: -16.4498 },
  { id: 'marche', label: 'Marché De Bambey', latitude: 14.6931, longitude: -16.4562 },
  { id: 'hopital', label: 'Hôpital de Bambey', latitude: 14.6918, longitude: -16.4598 },
  { id: 'diourbel', label: 'Diourbel', latitude: 14.6551, longitude: -16.2314 },
  { id: 'touba', label: 'Touba', latitude: 14.8506, longitude: -15.8763 },
  { id: 'mbacke', label: 'Mbacké', latitude: 14.7903, longitude: -15.9087 },
  { id: 'bambey-gare', label: 'Gare de Bambey', latitude: 14.6935, longitude: -16.4555 },
];
