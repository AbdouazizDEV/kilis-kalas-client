import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { IRideRepository } from '../../core/interfaces/i-ride.repository';
import {
  DriverProfile,
  Ride,
  RideEstimate,
  RideRequest,
  RideStatus,
  VehicleType,
} from '../../models/ride.model';

const MOCK_DRIVER: DriverProfile = {
  id: 'driver-001',
  name: 'Abdoul Aziz Diop',
  rating: 4,
  phone: '+221771234567',
  vehicle: {
    plate: 'AA-000-AA',
    model: 'beverly 500',
    color: 'rouge',
    type: 'moto',
    iconSrc: 'assets/icon/Motorcycle.svg',
  },
};

@Injectable()
export class RideRepository implements IRideRepository {
  private activeRide: Ride | null = null;
  private pollCount = 0;

  estimateRide(request: RideRequest): Observable<RideEstimate> {
    const basePrice = this.getBasePrice(request.vehicleType ?? 'moto');

    return of({
      distanceKm: 5.2,
      durationMinutes: 12,
      priceXof: basePrice,
      currency: 'XOF',
    }).pipe(delay(400));
  }

  requestRide(request: RideRequest): Observable<Ride> {
    const estimate = {
      distanceKm: 5.2,
      durationMinutes: 12,
      priceXof: this.getBasePrice(request.vehicleType ?? 'moto'),
      currency: 'XOF',
    };

    const ride: Ride = {
      id: `ride-${Date.now()}`,
      passengerId: 'user-001',
      pickup: {
        latitude: request.pickup.latitude,
        longitude: request.pickup.longitude,
        address: request.pickup.address,
      },
      destination: {
        latitude: request.destination.latitude,
        longitude: request.destination.longitude,
        address: request.destination.address,
      },
      vehicleType: request.vehicleType,
      paymentMethodId: request.paymentMethodId,
      status: 'searching',
      estimate,
      etaMinutes: 20,
      reference: `gowowndvd#${Math.floor(Math.random() * 9000000 + 1000000)}`,
      createdAt: new Date(),
    };

    this.activeRide = ride;
    this.pollCount = 0;

    return of(ride).pipe(delay(600));
  }

  getRideStatus(rideId: string): Observable<Ride> {
    if (!this.activeRide || this.activeRide.id !== rideId) {
      return of(this.buildFallbackRide(rideId));
    }

    this.pollCount += 1;
    const status = this.resolveStatus(this.pollCount);
    const driver = status === 'searching' ? undefined : { ...MOCK_DRIVER, vehicle: { ...MOCK_DRIVER.vehicle, type: this.activeRide.vehicleType ?? 'moto', iconSrc: this.getVehicleIcon(this.activeRide.vehicleType ?? 'moto') } };

    this.activeRide = {
      ...this.activeRide,
      status,
      driverId: driver?.id,
      driver,
      etaMinutes: status === 'in_progress' ? 20 : status === 'completed' ? 0 : 20,
      completedAt: status === 'completed' ? new Date() : undefined,
    };

    return of({ ...this.activeRide }).pipe(delay(300));
  }

  cancelRide(_rideId: string): Observable<void> {
    if (this.activeRide) {
      this.activeRide = { ...this.activeRide, status: 'cancelled' };
    }

    return of(void 0).pipe(delay(300));
  }

  resetActiveRide(): void {
    this.activeRide = null;
    this.pollCount = 0;
  }

  private resolveStatus(pollCount: number): RideStatus {
    if (pollCount <= 2) {
      return 'searching';
    }

    if (pollCount <= 4) {
      return 'driver_arriving';
    }

    if (pollCount <= 8) {
      return 'in_progress';
    }

    return 'completed';
  }

  private getBasePrice(type: VehicleType): number {
    switch (type) {
      case 'auto':
        return 2500;
      case 'delivery':
        return 1800;
      default:
        return 2000;
    }
  }

  private getVehicleIcon(type: VehicleType): string {
    switch (type) {
      case 'auto':
        return 'assets/icon/Motorcycle.svg';
      case 'delivery':
        return 'assets/icon/noto_package.svg';
      default:
        return 'assets/icon/Motorcycle.svg';
    }
  }

  private buildFallbackRide(rideId: string): Ride {
    return {
      id: rideId,
      passengerId: 'user-001',
      pickup: { latitude: 14.6937, longitude: -16.4597, address: 'Rue zgm' },
      destination: { latitude: 14.7, longitude: -16.45, address: 'parcelles unité 26' },
      status: 'driver_arriving',
      driver: MOCK_DRIVER,
      createdAt: new Date(),
    };
  }
}
