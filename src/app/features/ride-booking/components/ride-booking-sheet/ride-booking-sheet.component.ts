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
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
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
  @Output() sheetExpand = new EventEmitter<void>();
  @Output() sheetCollapse = new EventEmitter<void>();
  @Output() expandSearch = new EventEmitter<void>();
  @Output() fieldFocus = new EventEmitter<RouteField>();
  @Output() destinationQueryChange = new EventEmitter<string>();
  @Output() shareCurrentPosition = new EventEmitter<void>();
  @Output() placeSelect = new EventEmitter<LocationPlace>();
  @Output() vehicleSelect = new EventEmitter<VehicleType>();
  @Output() openPayment = new EventEmitter<void>();
  @Output() order = new EventEmitter<void>();
  @Output() validate = new EventEmitter<void>();

  private dragStartY = 0;
  private isDragging = false;
  private readonly dragThresholdPx = 44;

  constructor() {
    addIcons({ chevronUpOutline, chevronDownOutline });
  }

  get isExpanded(): boolean {
    return this.sheetMode === 'search';
  }

  get canToggleSheet(): boolean {
    return this.phase === 'route' || this.phase === 'vehicle';
  }

  onGrabClick(): void {
    if (this.canToggleSheet) {
      this.sheetToggle.emit();
    }
  }

  onGrabPointerDown(event: PointerEvent): void {
    if (!this.canToggleSheet) {
      return;
    }

    this.dragStartY = event.clientY;
    this.isDragging = true;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  onGrabPointerMove(event: PointerEvent): void {
    if (!this.isDragging) {
      return;
    }

    event.preventDefault();
  }

  onGrabPointerUp(event: PointerEvent): void {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;
    (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);

    const delta = event.clientY - this.dragStartY;

    if (Math.abs(delta) < this.dragThresholdPx) {
      this.onGrabClick();
      return;
    }

    if (delta < 0) {
      this.sheetExpand.emit();
      return;
    }

    this.sheetCollapse.emit();
  }
}
