import { Observable } from 'rxjs';
import { GeolocationOptions, PositionCoordinates } from '../../models/geolocation.model';

export interface IGeolocationService {
  getCurrentPosition(options?: GeolocationOptions): Observable<PositionCoordinates>;
  watchPosition(options?: GeolocationOptions): Observable<PositionCoordinates>;
  clearWatch(): void;
}
