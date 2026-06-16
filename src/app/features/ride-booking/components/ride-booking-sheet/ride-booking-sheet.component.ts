import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonButton,
  IonCol,
  IonFooter,
  IonGrid,
  IonIcon,
  IonImg,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { locationOutline, navigateOutline } from 'ionicons/icons';
import { LocationPlace, LocationSelection, RouteField } from '../../../../models/location.model';
import { VehicleOption, VehicleType } from '../../../../models/ride.model';
import { AppPillButtonComponent } from '../../../../shared/ui-kit/app-pill-button/app-pill-button.component';
import { AppTripRouteSummaryComponent } from '../../../../shared/ui-kit/app-trip-route-summary/app-trip-route-summary.component';
import { AppVehicleOptionCardComponent } from '../../../../shared/ui-kit/app-vehicle-option-card/app-vehicle-option-card.component';
import { RouteLocationCardComponent } from '../route-location-card/route-location-card.component';
import { RideSearchResultsComponent } from '../ride-search-results/ride-search-results.component';

export type BookingPhase = 'search' | 'route' | 'vehicle';
export type SheetMode = 'compact' | 'search';

@Component({
  selector: 'app-ride-booking-sheet',
  standalone: true,
  imports: [
    IonFooter,
    IonButton,
    IonCol,
    IonGrid,
    IonIcon,
    IonImg,
    IonRow,
    IonText,
    TranslatePipe,
    AppPillButtonComponent,
    AppTripRouteSummaryComponent,
    AppVehicleOptionCardComponent,
    RouteLocationCardComponent,
    RideSearchResultsComponent,
  ],
  templateUrl: './ride-booking-sheet.component.html',
  styleUrls: ['./ride-booking-sheet.component.scss'],
})
export class RideBookingSheetComponent {
  @Input() phase: BookingPhase = 'route';
  @Input() sheetMode: SheetMode = 'compact';
  @Input() pickup: LocationSelection | null = null;
  @Input() destination: LocationSelection | null = null;
  @Input() destinationQuery = '';
  @Input() activeField: RouteField = 'destination';
  @Input() searchResults: LocationPlace[] = [];
  @Input() searchLoading = false;
  @Input() hasSearchQuery = false;
  @Input() searchErrorKey: string | null = null;
  @Input() vehicleOptions: VehicleOption[] = [];
  @Input() selectedVehicle: VehicleType = 'moto';
  @Input() paymentMethodIcon = '';
  @Input() canValidate = false;
  @Input() estimateLoading = false;
  @Input() orderLoading = false;

  @Output() sheetToggle = new EventEmitter<void>();
  @Output() expandSearch = new EventEmitter<void>();
  @Output() fieldFocus = new EventEmitter<RouteField>();
  @Output() destinationQueryChange = new EventEmitter<string>();
  @Output() shareCurrentPosition = new EventEmitter<void>();
  @Output() placeSelect = new EventEmitter<LocationPlace>();
  @Output() vehicleSelect = new EventEmitter<VehicleType>();
  @Output() openPayment = new EventEmitter<void>();
  @Output() order = new EventEmitter<void>();
  @Output() validate = new EventEmitter<void>();

  constructor() {
    addIcons({ locationOutline, navigateOutline });
  }

  onGrabClick(): void {
    if (this.phase === 'route') {
      this.sheetToggle.emit();
    }
  }
}
