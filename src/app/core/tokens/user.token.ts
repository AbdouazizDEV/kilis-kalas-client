import { InjectionToken } from '@angular/core';
import { IUserRepository } from '../interfaces/i-user.repository';

export const USER_REPOSITORY = new InjectionToken<IUserRepository>('USER_REPOSITORY');
