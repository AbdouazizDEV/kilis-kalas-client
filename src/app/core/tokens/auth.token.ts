import { InjectionToken } from '@angular/core';
import { IAuthService } from '../interfaces/i-auth.service';

export const AUTH_SERVICE = new InjectionToken<IAuthService>('AUTH_SERVICE');
