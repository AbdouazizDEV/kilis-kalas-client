import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonCol, IonGrid, IonIcon, IonRow, IonSpinner, IonText } from '@ionic/angular/standalone';
import { PositionCoordinates } from '../../../models/geolocation.model';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [DecimalPipe, IonGrid, IonRow, IonCol, IonText, IonIcon, IonSpinner],
  templateUrl: './app-map-view.component.html',
  styleUrls: ['./app-map-view.component.scss'],
})
export class AppMapViewComponent {
  @Input() center?: PositionCoordinates;
  @Input() loading = false;
  @Input() placeholder = 'Carte';
}
