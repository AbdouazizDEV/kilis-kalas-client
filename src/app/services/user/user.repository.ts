import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { IUserRepository } from '../../core/interfaces/i-user.repository';
import { User, UserProfileUpdate } from '../../models/user.model';

@Injectable()
export class UserRepository implements IUserRepository {
  getProfile(userId: string): Observable<User> {
    return of({
      id: userId,
      firstName: 'Amadou',
      lastName: 'Diallo',
      phone: '+221771234567',
      email: 'amadou@example.sn',
      createdAt: new Date(),
    }).pipe(delay(300));
  }

  updateProfile(userId: string, data: UserProfileUpdate): Observable<User> {
    return of({
      id: userId,
      firstName: data.firstName ?? 'Amadou',
      lastName: data.lastName ?? 'Diallo',
      phone: data.phone ?? '+221771234567',
      email: data.email,
      avatarUrl: data.avatarUrl,
      createdAt: new Date(),
    }).pipe(delay(400));
  }
}
