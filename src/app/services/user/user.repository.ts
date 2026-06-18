import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { IUserRepository } from '../../core/interfaces/i-user.repository';
import { User, UserProfileUpdate } from '../../models/user.model';

@Injectable()
export class UserRepository implements IUserRepository {
  getProfile(userId: string): Observable<User> {
    return of({
      id: userId,
      firstName: 'Babacar',
      lastName: 'Nguirane',
      phone: '+221 77 378 29 56',
      email: 'nguiranebabacar305@gmail.com',
      createdAt: new Date(),
    }).pipe(delay(300));
  }

  updateProfile(userId: string, data: UserProfileUpdate): Observable<User> {
    return of({
      id: userId,
      firstName: data.firstName ?? 'Babacar',
      lastName: data.lastName ?? 'Nguirane',
      phone: data.phone ?? '+221 77 378 29 56',
      email: data.email,
      avatarUrl: data.avatarUrl,
      createdAt: new Date(),
    }).pipe(delay(400));
  }
}
