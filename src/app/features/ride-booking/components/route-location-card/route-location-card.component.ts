import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { LocationSelection, RouteField } from '../../../../models/location.model';

@Component({
  selector: 'app-route-location-card',
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonIcon, IonText, TranslatePipe],
  templateUrl: './route-location-card.component.html',
  styleUrls: ['./route-location-card.component.scss'],
})
export class RouteLocationCardComponent {
  @Input() pickup: LocationSelection | null = null;
  @Input() destination: LocationSelection | null = null;
  @Input() activeField: RouteField = 'destination';
  @Input() destinationQuery = '';

  @Output() fieldFocus = new EventEmitter<RouteField>();
  @Output() destinationQueryChange = new EventEmitter<string>();

  onFieldClick(field: RouteField): void {
    this.fieldFocus.emit(field);
  }

  onDestinationInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.destinationQueryChange.emit(value);
  }
}
