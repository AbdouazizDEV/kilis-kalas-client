import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonLabel,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { bicycleOutline } from 'ionicons/icons';
import { AppPillButtonComponent } from '../../../../shared/ui-kit/app-pill-button/app-pill-button.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonIcon,
    IonLabel,
    IonText,
    TranslatePipe,
    AppPillButtonComponent,
  ],
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
  private readonly router = inject(Router);

  constructor() {
    addIcons({ bicycleOutline });
  }

  onStart(): void {
    this.router.navigate(['/auth/login']);
  }
}
