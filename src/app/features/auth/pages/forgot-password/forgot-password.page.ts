import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonCol, IonContent, IonGrid, IonRow, IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { AUTH_SERVICE } from '../../../../core/tokens/auth.token';
import { AppBackButtonComponent } from '../../../../shared/ui-kit/app-back-button/app-back-button.component';
import { AppInputComponent } from '../../../../shared/ui-kit/app-input/app-input.component';
import { AppPillButtonComponent } from '../../../../shared/ui-kit/app-pill-button/app-pill-button.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    TranslatePipe,
    AppBackButtonComponent,
    AppInputComponent,
    AppPillButtonComponent,
  ],
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AUTH_SERVICE);

  readonly form = this.fb.nonNullable.group({
    identifier: ['', [Validators.required]],
  });

  loading = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { identifier } = this.form.getRawValue();
    this.loading = true;
    this.errorMessage = '';

    this.authService.forgotPassword(identifier).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigateByUrl(
          `/auth/otp?identifier=${encodeURIComponent(identifier)}&flow=reset`,
        );
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'AUTH.FORGOT_PASSWORD.ERROR';
      },
    });
  }
}
