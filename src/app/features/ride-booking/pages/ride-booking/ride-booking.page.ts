import { Component } from '@angular/core';
import { IonContent, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-ride-booking',
  standalone: true,
  imports: [IonContent, IonText],
  template: `
    <ion-content class="ion-padding">
      <ion-text>Réservation — à implémenter</ion-text>
    </ion-content>
  `,
})
export class RideBookingPage {}
