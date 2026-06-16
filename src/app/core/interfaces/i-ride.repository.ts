import { Observable } from 'rxjs';
import { Ride, RideEstimate, RideRequest } from '../../models/ride.model';

export interface IRideRepository {
  estimateRide(request: RideRequest): Observable<RideEstimate>;
  requestRide(request: RideRequest): Observable<Ride>;
  getRideStatus(rideId: string): Observable<Ride>;
  cancelRide(rideId: string): Observable<void>;
  resetActiveRide(): void;
}
