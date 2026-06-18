import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonRow,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { LocationPlace } from '../../../../models/location.model';

@Component({
  selector: 'app-ride-search-results',
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonIcon, IonImg, IonSpinner, IonText, IonButton, TranslatePipe],
  templateUrl: './ride-search-results.component.html',
  styleUrls: ['./ride-search-results.component.scss'],
})
export class RideSearchResultsComponent {
  constructor() {
    addIcons({ chevronForwardOutline });
  }
  @Input() results: LocationPlace[] = [];
  @Input() loading = false;
  @Input() showEmpty = false;

  @Output() placeSelect = new EventEmitter<LocationPlace>();
}
