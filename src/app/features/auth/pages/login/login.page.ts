import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { AUTH_SERVICE } from '../../../../core/tokens/auth.token';
import { AppInputComponent } from '../../../../shared/ui-kit/app-input/app-input.component';
import { AppPillButtonComponent } from '../../../../shared/ui-kit/app-pill-button/app-pill-button.component';
import { AppTextLinkComponent } from '../../../../shared/ui-kit/app-text-link/app-text-link.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonImg,
    IonButton,
    TranslatePipe,
    AppInputComponent,
    AppPillButtonComponent,
    AppTextLinkComponent,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AUTH_SERVICE);

  readonly form = this.fb.nonNullable.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { identifier, password } = this.form.getRawValue();
    const isPhone = /^[\d+\s()-]+$/.test(identifier);

    this.loading = true;
    this.errorMessage = '';

    this.authService
      .login(isPhone ? { phone: identifier, password } : { email: identifier, password })
      .subscribe({
        next: (result) => {
          this.loading = false;
          if (result.requiresOtp) {
            void this.router.navigateByUrl(
              `/auth/otp?identifier=${encodeURIComponent(identifier)}&flow=login`,
            );
            return;
          }
          if (result.success) {
            void this.router.navigateByUrl('/home');
            return;
          }
          this.errorMessage = result.message ?? 'AUTH.LOGIN.ERROR';
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'AUTH.LOGIN.ERROR';
        },
      });
  }

  onGoogleLogin(): void {
    void this.router.navigateByUrl('/home');
  }
}
