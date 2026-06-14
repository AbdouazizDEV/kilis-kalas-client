import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { AppMapPreviewComponent } from '../../../../shared/ui-kit/app-map-preview/app-map-preview.component';
import { addIcons } from 'ionicons';
import { locationOutline, menuOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonImg,
    IonText,
    TranslatePipe,
    AppMapPreviewComponent,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  private readonly router = inject(Router);

  constructor() {
    addIcons({ menuOutline, locationOutline });
  }

  onMenu(): void {
    void this.router.navigateByUrl('/profile');
  }

  onChooseDestination(): void {
    void this.router.navigateByUrl('/ride-booking');
  }

  onDefineOnMap(): void {
    void this.router.navigateByUrl('/ride-booking?mode=map');
  }

  onDelivery(): void {
    void this.router.navigateByUrl('/ride-booking?mode=delivery');
  }

  onOrder(): void {
    void this.router.navigateByUrl('/ride-booking');
  }
}
