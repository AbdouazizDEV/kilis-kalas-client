import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { IAuthService } from '../../core/interfaces/i-auth.service';
import { AuthResult, LoginCredentials, RegisterData, ResetPasswordData } from '../../models/auth.model';

@Injectable()
export class AuthService implements IAuthService {
  login(credentials: LoginCredentials): Observable<AuthResult> {
    return of({
      success: true,
      requiresOtp: !!credentials.phone,
      token: credentials.phone ? undefined : 'mock-jwt-token',
      userId: 'user-001',
      message: 'Connexion initiée',
    }).pipe(delay(500));
  }

  register(data: RegisterData): Observable<AuthResult> {
    return of({
      success: true,
      requiresOtp: true,
      userId: 'user-new',
      message: `Inscription de ${data.firstName} en cours`,
    }).pipe(delay(500));
  }

  verifyOtp(phone: string, code: string): Observable<AuthResult> {
    const isValid = code.length === 4;
    return of({
      success: isValid,
      token: isValid ? 'mock-jwt-token' : undefined,
      userId: isValid ? 'user-001' : undefined,
      message: isValid ? 'OTP validé' : 'Code OTP invalide',
    }).pipe(delay(400));
  }

  forgotPassword(identifier: string): Observable<void> {
    return of(void 0).pipe(delay(300));
  }

  resetPassword(data: ResetPasswordData): Observable<AuthResult> {
    const isValid = data.password.length >= 6 && data.code.length === 4;
    return of({
      success: isValid,
      message: isValid ? 'Mot de passe mis à jour' : 'Impossible de réinitialiser le mot de passe',
    }).pipe(delay(500));
  }

  logout(): Observable<void> {
    return of(void 0).pipe(delay(200));
  }
}
