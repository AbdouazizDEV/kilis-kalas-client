export type RideStatus =
  | 'pending'
  | 'searching'
  | 'accepted'
  | 'driver_arriving'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type VehicleType = 'moto' | 'auto' | 'delivery';

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

export interface DriverVehicle {
  plate: string;
  model: string;
  color: string;
  type: VehicleType;
  iconSrc: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  rating: number;
  photoUrl?: string;
  phone: string;
  vehicle: DriverVehicle;
}

export interface Ride {
  id: string;
  passengerId: string;
  driverId?: string;
  driver?: DriverProfile;
  pickup: GeoPoint;
  destination: GeoPoint;
  status: RideStatus;
  vehicleType?: VehicleType;
  paymentMethodId?: string;
  estimate?: RideEstimate;
  etaMinutes?: number;
  createdAt: Date;
  completedAt?: Date;
  reference?: string;
}

export interface RideRequest {
  pickup: GeoPoint;
  destination: GeoPoint;
  vehicleType?: VehicleType;
  paymentMethodId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'passenger' | 'driver';
  text: string;
  sentAt: Date;
}

export interface VehicleOption {
  type: VehicleType;
  labelKey: string;
  iconSrc: string;
  priceXof: number;
}
