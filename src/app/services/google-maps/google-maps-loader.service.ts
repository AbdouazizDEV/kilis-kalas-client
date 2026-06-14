import { Injectable } from '@angular/core';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private loaded = false;
  private loading?: Promise<void>;

  isApiKeyConfigured(): boolean {
    return Boolean(environment.googleMapsApiKey?.trim());
  }

  load(): Promise<void> {
    if (this.loaded) {
      return Promise.resolve();
    }

    if (!this.isApiKeyConfigured()) {
      return Promise.reject(new Error('GOOGLE_MAPS_API_KEY_MISSING'));
    }

    if (!this.loading) {
      this.loading = this.bootstrapMapsApi();
    }

    return this.loading;
  }

  private async bootstrapMapsApi(): Promise<void> {
    setOptions({
      key: environment.googleMapsApiKey,
      v: 'weekly',
      region: 'SN',
      language: 'fr',
    });

    await importLibrary('maps');
    await importLibrary('marker');
    await importLibrary('places');
    this.loaded = true;
  }
}
