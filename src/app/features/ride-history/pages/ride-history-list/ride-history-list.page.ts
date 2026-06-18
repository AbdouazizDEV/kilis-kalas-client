import { Component, inject } from '@angular/core';
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
import { TranslateService } from '@ngx-translate/core';
import { AppBackButtonComponent } from '../../../../shared/ui-kit/app-back-button/app-back-button.component';

export interface RideHistoryListItem {
  id: string;
  plate: string;
  dateLabel: string;
  priceXof: number;
}

@Component({
  selector: 'app-ride-history-list',
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonButton,
    IonImg,
    AppBackButtonComponent,
  ],
  templateUrl: './ride-history-list.page.html',
  styleUrls: ['./ride-history-list.page.scss'],
})
export class RideHistoryListPage {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly titleLabel = this.translate.translate('RIDE_HISTORY.TITLE');

  readonly rides: RideHistoryListItem[] = [
    { id: 'ride-1', plate: 'AA-000-AA', dateLabel: '18 octobre', priceXof: 2000 },
    { id: 'ride-2', plate: 'AA-000-AA', dateLabel: '18 octobre', priceXof: 2000 },
  ];

  formatPrice(priceXof: number): string {
    return `${new Intl.NumberFormat('fr-FR').format(priceXof)} FCFA`;
  }

  onOpenRide(rideId: string): void {
    void this.router.navigateByUrl(`/ride-history/detail?id=${rideId}`);
  }
}
