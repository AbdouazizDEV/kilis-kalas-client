import { InjectionToken } from '@angular/core';
import { IRideRepository } from '../interfaces/i-ride.repository';

export const RIDE_REPOSITORY = new InjectionToken<IRideRepository>('RIDE_REPOSITORY');
