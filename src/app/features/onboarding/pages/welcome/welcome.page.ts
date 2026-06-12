import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { AppButtonComponent } from '../../../../shared/ui-kit/app-button/app-button.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonText,
    TranslatePipe,
    AppButtonComponent,
  ],
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
  private readonly router = inject(Router);

  onGoogleLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onPhoneLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
