import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonCol, IonGrid, IonIcon, IonRow, IonSpinner, IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { LocationPlace } from '../../../../models/location.model';

@Component({
  selector: 'app-ride-search-results',
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonIcon, IonSpinner, IonText, TranslatePipe],
  templateUrl: './ride-search-results.component.html',
  styleUrls: ['./ride-search-results.component.scss'],
})
export class RideSearchResultsComponent {
  @Input() results: LocationPlace[] = [];
  @Input() loading = false;
  @Input() showEmpty = false;

  @Output() placeSelect = new EventEmitter<LocationPlace>();
}
