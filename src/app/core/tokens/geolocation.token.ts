import { InjectionToken } from '@angular/core';
import { IGeolocationService } from '../interfaces/i-geolocation.service';

export const GEOLOCATION_SERVICE = new InjectionToken<IGeolocationService>('GEOLOCATION_SERVICE');
