import { Observable } from 'rxjs';
import { User, UserProfileUpdate } from '../../models/user.model';

export interface IUserRepository {
  getProfile(userId: string): Observable<User>;
  updateProfile(userId: string, data: UserProfileUpdate): Observable<User>;
}
