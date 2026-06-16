import { Component, Input } from '@angular/core';
import { IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-trip-route-summary',
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonIcon, IonText, TranslatePipe],
  templateUrl: './app-trip-route-summary.component.html',
  styleUrls: ['./app-trip-route-summary.component.scss'],
})
export class AppTripRouteSummaryComponent {
  @Input() pickupLabel = '';
  @Input() destinationLabel = '';
}
