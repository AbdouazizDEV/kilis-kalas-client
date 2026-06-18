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
import {
  AppSideMenuComponent,
  SideMenuAction,
} from '../../../../shared/ui-kit/app-side-menu/app-side-menu.component';
import { addIcons } from 'ionicons';
import {
  chevronForwardOutline,
  locationOutline,
  mapOutline,
  menuOutline,
} from 'ionicons/icons';

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
    AppSideMenuComponent,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  private readonly router = inject(Router);

  isMenuOpen = false;

  constructor() {
    addIcons({ menuOutline, locationOutline, chevronForwardOutline, mapOutline });
  }

  onMenu(): void {
    this.isMenuOpen = true;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  onMenuAction(action: SideMenuAction): void {
    this.closeMenu();

    switch (action) {
      case 'profile':
        void this.router.navigateByUrl('/profile');
        break;
      case 'history':
        void this.router.navigateByUrl('/ride-history');
        break;
      case 'payment':
        void this.router.navigateByUrl('/payment');
        break;
      case 'help':
        void this.router.navigateByUrl('/help');
        break;
      case 'logout':
        void this.router.navigateByUrl('/auth/login');
        break;
      default:
        break;
    }
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
