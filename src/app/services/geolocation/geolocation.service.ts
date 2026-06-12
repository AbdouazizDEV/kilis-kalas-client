import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Observable, from, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { IGeolocationService } from '../../core/interfaces/i-geolocation.service';
import { GeolocationOptions, PositionCoordinates } from '../../models/geolocation.model';

@Injectable()
export class GeolocationService implements IGeolocationService {
  private watchId: string | null = null;

  getCurrentPosition(options?: GeolocationOptions): Observable<PositionCoordinates> {
    return from(
      Geolocation.getCurrentPosition({
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        timeout: options?.timeout ?? 10000,
        maximumAge: options?.maximumAge ?? 0,
      }),
    ).pipe(
      map((position) => ({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude ?? undefined,
        heading: position.coords.heading ?? undefined,
        speed: position.coords.speed ?? undefined,
      })),
    );
  }

  watchPosition(options?: GeolocationOptions): Observable<PositionCoordinates> {
    return new Observable<PositionCoordinates>((subscriber) => {
      Geolocation.watchPosition(
        {
          enableHighAccuracy: options?.enableHighAccuracy ?? true,
          timeout: options?.timeout ?? 10000,
          maximumAge: options?.maximumAge ?? 0,
        },
        (position, err) => {
          if (err) {
            subscriber.error(err);
            return;
          }
          if (position) {
            subscriber.next({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
          }
        },
      ).then((id) => {
        this.watchId = id;
      });

      return () => this.clearWatch();
    });
  }

  clearWatch(): void {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }
}
