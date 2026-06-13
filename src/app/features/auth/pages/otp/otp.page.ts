import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonCol, IonContent, IonGrid, IonLabel, IonRow, IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { AUTH_SERVICE } from '../../../../core/tokens/auth.token';
import { AppBackButtonComponent } from '../../../../shared/ui-kit/app-back-button/app-back-button.component';
import { AppOtpInputComponent } from '../../../../shared/ui-kit/app-otp-input/app-otp-input.component';
import { AppPillButtonComponent } from '../../../../shared/ui-kit/app-pill-button/app-pill-button.component';
import { AppTextLinkComponent } from '../../../../shared/ui-kit/app-text-link/app-text-link.component';

@Component({
  selector: 'app-otp',
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
    AppOtpInputComponent,
    AppPillButtonComponent,
    AppTextLinkComponent,
  ],
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AUTH_SERVICE);

  readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
  });

  identifier = '';
  flow: 'login' | 'reset' = 'login';
  loading = false;
  resending = false;
  errorMessage = '';

  ngOnInit(): void {
    this.identifier = this.route.snapshot.queryParamMap.get('identifier') ?? '';
    this.flow = this.route.snapshot.queryParamMap.get('flow') === 'reset' ? 'reset' : 'login';
  }

  get subtitleKey(): string {
    return this.flow === 'reset'
      ? 'AUTH.OTP.SUBTITLE_RESET'
      : 'AUTH.OTP.SUBTITLE_LOGIN';
  }

  get backHref(): string {
    return this.flow === 'reset' ? '/auth/forgot-password' : '/auth/login';
  }

  onSubmit(): void {
    if (this.form.invalid || !this.identifier) {
      this.form.markAllAsTouched();
      return;
    }

    const { code } = this.form.getRawValue();
    this.loading = true;
    this.errorMessage = '';

    this.authService.verifyOtp(this.identifier, code).subscribe({
      next: (result) => {
        this.loading = false;
        if (!result.success) {
          this.errorMessage = 'AUTH.OTP.ERROR';
          return;
        }

        if (this.flow === 'reset') {
          void this.router.navigateByUrl(
            `/auth/new-password?identifier=${encodeURIComponent(this.identifier)}&code=${encodeURIComponent(code)}`,
          );
          return;
        }

        void this.router.navigateByUrl('/home');
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'AUTH.OTP.ERROR';
      },
    });
  }

  onResend(): void {
    if (!this.identifier || this.resending) {
      return;
    }

    this.resending = true;
    this.authService.forgotPassword(this.identifier).subscribe({
      next: () => {
        this.resending = false;
      },
      error: () => {
        this.resending = false;
      },
    });
  }
}
