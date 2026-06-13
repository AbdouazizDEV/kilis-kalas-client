import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonCol, IonContent, IonGrid, IonRow, IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { AUTH_SERVICE } from '../../../../core/tokens/auth.token';
import { AppBackButtonComponent } from '../../../../shared/ui-kit/app-back-button/app-back-button.component';
import { AppInputComponent } from '../../../../shared/ui-kit/app-input/app-input.component';
import { AppPillButtonComponent } from '../../../../shared/ui-kit/app-pill-button/app-pill-button.component';

function passwordsMatch(group: AbstractControl): { passwordMismatch: true } | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-new-password',
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
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AUTH_SERVICE);

  readonly form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: passwordsMatch },
  );

  identifier = '';
  code = '';
  loading = false;
  errorMessage = '';

  get backHref(): string {
    return `/auth/otp?identifier=${encodeURIComponent(this.identifier)}&flow=reset`;
  }

  ngOnInit(): void {
    this.identifier = this.route.snapshot.queryParamMap.get('identifier') ?? '';
    this.code = this.route.snapshot.queryParamMap.get('code') ?? '';

    if (!this.identifier || !this.code) {
      void this.router.navigateByUrl('/auth/forgot-password');
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (this.form.hasError('passwordMismatch')) {
        this.errorMessage = 'AUTH.NEW_PASSWORD.MISMATCH';
      }
      return;
    }

    const { password } = this.form.getRawValue();
    this.loading = true;
    this.errorMessage = '';

    this.authService.resetPassword({ identifier: this.identifier, code: this.code, password }).subscribe({
      next: (result) => {
        this.loading = false;
        if (!result.success) {
          this.errorMessage = 'AUTH.NEW_PASSWORD.ERROR';
          return;
        }
        void this.router.navigateByUrl('/auth/login');
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'AUTH.NEW_PASSWORD.ERROR';
      },
    });
  }
}
