import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonImg,
  IonInput,
  IonItem,
  IonRow,
  IonText,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { USER_REPOSITORY } from '../../../../core/tokens/user.token';
import { AppAvatarComponent } from '../../../../shared/ui-kit/app-avatar/app-avatar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonContent,
    IonFooter,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonImg,
    IonText,
    IonItem,
    IonInput,
    AppAvatarComponent,
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly userRepository = inject(USER_REPOSITORY);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
  });

  avatarSrc = '';
  saving = false;

  readonly saveLabel = this.translate.translate('PROFILE.SAVE');
  readonly editAvatarLabel = this.translate.translate('PROFILE.EDIT_AVATAR');
  readonly backLabel = this.translate.translate('COMMON.BACK');

  private readonly userId = 'current-user';

  ngOnInit(): void {
    this.userRepository.getProfile(this.userId).subscribe((user) => {
      this.form.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email ?? '',
        phone: user.phone,
      });
      this.avatarSrc = user.avatarUrl ?? '';
    });
  }

  get fullName(): string {
    const { firstName, lastName } = this.form.getRawValue();
    return `${firstName} ${lastName}`.trim();
  }

  onEditAvatar(): void {
    // Prévu pour Capacitor Camera.
  }

  onBack(): void {
    void this.router.navigateByUrl('/home');
  }

  onSave(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const { firstName, lastName, email, phone } = this.form.getRawValue();

    this.userRepository
      .updateProfile(this.userId, { firstName, lastName, email, phone, avatarUrl: this.avatarSrc })
      .subscribe({
        next: (user) => {
          this.avatarSrc = user.avatarUrl ?? this.avatarSrc;
          this.saving = false;
        },
        error: () => {
          this.saving = false;
        },
      });
  }
}
