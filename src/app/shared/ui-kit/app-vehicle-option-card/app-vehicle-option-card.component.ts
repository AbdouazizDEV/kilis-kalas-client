import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonImg, IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { VehicleType } from '../../../models/ride.model';

@Component({
  selector: 'app-vehicle-option-card',
  standalone: true,
  imports: [IonImg, IonText, TranslatePipe],
  templateUrl: './app-vehicle-option-card.component.html',
  styleUrls: ['./app-vehicle-option-card.component.scss'],
})
export class AppVehicleOptionCardComponent {
  @Input() type: VehicleType = 'moto';
  @Input() labelKey = '';
  @Input() iconSrc = '';
  @Input() priceXof = 0;
  @Input() selected = false;

  @Output() selectedChange = new EventEmitter<VehicleType>();

  onSelect(): void {
    this.selectedChange.emit(this.type);
  }

  formatPrice(): string {
    return new Intl.NumberFormat('fr-FR').format(this.priceXof);
  }
}
