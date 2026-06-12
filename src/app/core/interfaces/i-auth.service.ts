import { Observable } from 'rxjs';
import { AuthResult, LoginCredentials, RegisterData } from '../../models/auth.model';

export interface IAuthService {
  login(credentials: LoginCredentials): Observable<AuthResult>;
  register(data: RegisterData): Observable<AuthResult>;
  verifyOtp(phone: string, code: string): Observable<AuthResult>;
  forgotPassword(email: string): Observable<void>;
  logout(): Observable<void>;
}
