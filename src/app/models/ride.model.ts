export type RideStatus =
  | 'pending'
  | 'searching'
  | 'accepted'
  | 'driver_arriving'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface GeoPoint {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface RideEstimate {
  distanceKm: number;
  durationMinutes: number;
  priceXof: number;
  currency: string;
}

export interface Ride {
  id: string;
  passengerId: string;
  driverId?: string;
  pickup: GeoPoint;
  destination: GeoPoint;
  status: RideStatus;
  estimate?: RideEstimate;
  createdAt: Date;
}

export interface RideRequest {
  pickup: GeoPoint;
  destination: GeoPoint;
  vehicleType?: string;
  paymentMethodId?: string;
}
