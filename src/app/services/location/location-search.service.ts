import { Injectable, inject } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  DIOURBEL_FALLBACK_PLACES,
  DIOURBEL_REGION_BOUNDS,
  isWithinDiourbelRegion,
} from '../../core/constants/diourbel-region';
import { LocationPlace } from '../../models/location.model';
import { GoogleMapsLoaderService } from '../google-maps/google-maps-loader.service';

@Injectable({ providedIn: 'root' })
export class LocationSearchService {
  private readonly mapsLoader = inject(GoogleMapsLoaderService);
  private readonly detailsHost = document.createElement('div');

  private autocompleteService?: google.maps.places.AutocompleteService;
  private placesService?: google.maps.places.PlacesService;
  private sessionToken?: google.maps.places.AutocompleteSessionToken;

  search(query: string): Observable<LocationPlace[]> {
    const normalized = query.trim();

    if (!normalized) {
      return of(DIOURBEL_FALLBACK_PLACES.slice(0, 5));
    }

    if (!this.mapsLoader.isApiKeyConfigured()) {
      return of(this.searchLocalFallback(normalized));
    }

    return from(this.mapsLoader.load()).pipe(
      switchMap(() => from(this.searchGooglePlaces(normalized))),
      catchError(() => of(this.searchLocalFallback(normalized))),
    );
  }

  resolvePlace(place: LocationPlace): Observable<LocationPlace> {
    if (place.latitude != null && place.longitude != null) {
      if (!isWithinDiourbelRegion(place.latitude, place.longitude)) {
        return throwError(() => new Error('OUT_OF_REGION'));
      }

      return of(place);
    }

    if (!place.placeId) {
      return throwError(() => new Error('INVALID_PLACE'));
    }

    if (!this.mapsLoader.isApiKeyConfigured()) {
      return throwError(() => new Error('INVALID_PLACE'));
    }

    return from(this.mapsLoader.load()).pipe(
      switchMap(() => from(this.fetchPlaceDetails(place.placeId!))),
      map((details) => {
        if (!details) {
          throw new Error('INVALID_PLACE');
        }

        if (!isWithinDiourbelRegion(details.latitude, details.longitude)) {
          throw new Error('OUT_OF_REGION');
        }

        return {
          ...place,
          label: details.label,
          latitude: details.latitude,
          longitude: details.longitude,
        };
      }),
    );
  }

  resetSession(): void {
    this.sessionToken = new google.maps.places.AutocompleteSessionToken();
  }

  private searchLocalFallback(query: string): LocationPlace[] {
    const normalized = query.toLowerCase();

    return DIOURBEL_FALLBACK_PLACES.filter((place) =>
      place.label.toLowerCase().includes(normalized),
    ).slice(0, 5);
  }

  private async searchGooglePlaces(query: string): Promise<LocationPlace[]> {
    this.ensurePlacesServices();

    const predictions = await this.fetchPredictions(query);
    if (!predictions.length) {
      return this.searchLocalFallback(query);
    }

    const resolved = await Promise.all(
      predictions.slice(0, 5).map((prediction) => this.predictionToPlace(prediction)),
    );

    const places = resolved.filter((place): place is LocationPlace => place !== null);
    return places.length ? places : this.searchLocalFallback(query);
  }

  private ensurePlacesServices(): void {
    if (!this.autocompleteService) {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    }

    if (!this.placesService) {
      this.placesService = new google.maps.places.PlacesService(this.detailsHost);
    }

    if (!this.sessionToken) {
      this.sessionToken = new google.maps.places.AutocompleteSessionToken();
    }
  }

  private fetchPredictions(
    query: string,
  ): Promise<google.maps.places.AutocompletePrediction[]> {
    this.ensurePlacesServices();

    return new Promise((resolve) => {
      this.autocompleteService!.getPlacePredictions(
        {
          input: query,
          sessionToken: this.sessionToken,
          componentRestrictions: { country: 'sn' },
          locationRestriction: DIOURBEL_REGION_BOUNDS as google.maps.LatLngBoundsLiteral,
        },
        (predictions, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
            resolve([]);
            return;
          }

          resolve(predictions);
        },
      );
    });
  }

  private async predictionToPlace(
    prediction: google.maps.places.AutocompletePrediction,
  ): Promise<LocationPlace | null> {
    const details = await this.fetchPlaceDetails(prediction.place_id);
    if (!details) {
      return null;
    }

    if (!isWithinDiourbelRegion(details.latitude, details.longitude)) {
      return null;
    }

    return {
      id: prediction.place_id,
      placeId: prediction.place_id,
      label: prediction.description,
      latitude: details.latitude,
      longitude: details.longitude,
    };
  }

  private fetchPlaceDetails(
    placeId: string,
  ): Promise<{ label: string; latitude: number; longitude: number } | null> {
    this.ensurePlacesServices();

    return new Promise((resolve) => {
      this.placesService!.getDetails(
        {
          placeId,
          fields: ['geometry', 'formatted_address', 'name'],
          sessionToken: this.sessionToken,
        },
        (place, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !place?.geometry?.location) {
            resolve(null);
            return;
          }

          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();

          resolve({
            label: place.formatted_address ?? place.name ?? '',
            latitude,
            longitude,
          });
        },
      );
    });
  }
}
