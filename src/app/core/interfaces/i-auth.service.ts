import { Observable } from 'rxjs';
import { AuthResult, LoginCredentials, RegisterData, ResetPasswordData } from '../../models/auth.model';

export interface IAuthService {
  login(credentials: LoginCredentials): Observable<AuthResult>;
  register(data: RegisterData): Observable<AuthResult>;
  verifyOtp(phone: string, code: string): Observable<AuthResult>;
  forgotPassword(identifier: string): Observable<void>;
  resetPassword(data: ResetPasswordData): Observable<AuthResult>;
  logout(): Observable<void>;
}
