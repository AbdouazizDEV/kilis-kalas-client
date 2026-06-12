import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { IRideRepository } from '../../core/interfaces/i-ride.repository';
import { Ride, RideEstimate, RideRequest, RideStatus } from '../../models/ride.model';

@Injectable()
export class RideRepository implements IRideRepository {
  estimateRide(request: RideRequest): Observable<RideEstimate> {
    return of({
      distanceKm: 5.2,
      durationMinutes: 12,
      priceXof: 1500,
      currency: 'XOF',
    }).pipe(delay(400));
  }

  requestRide(request: RideRequest): Observable<Ride> {
    return of({
      id: `ride-${Date.now()}`,
      passengerId: 'user-001',
      pickup: request.pickup,
      destination: request.destination,
      status: 'searching' as RideStatus,
      createdAt: new Date(),
    }).pipe(delay(600));
  }

  getRideStatus(rideId: string): Observable<Ride> {
    return of({
      id: rideId,
      passengerId: 'user-001',
      driverId: 'driver-001',
      pickup: { latitude: 14.6937, longitude: -16.4597, address: 'Bambey Centre' },
      destination: { latitude: 14.7, longitude: -16.45, address: 'Marché Bambey' },
      status: 'driver_arriving' as RideStatus,
      createdAt: new Date(),
    }).pipe(delay(300));
  }

  cancelRide(rideId: string): Observable<void> {
    return of(void 0).pipe(delay(300));
  }
}
