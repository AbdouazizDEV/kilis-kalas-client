import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { addIcons } from 'ionicons';
import { locateOutline, location, locationOutline, navigateOutline } from 'ionicons/icons';
import { isWithinDiourbelRegion } from '../../../../core/constants/diourbel-region';
import { GEOLOCATION_SERVICE } from '../../../../core/tokens/geolocation.token';
import { LocationPlace, LocationSelection, RouteField } from '../../../../models/location.model';
import { LocationSearchService } from '../../../../services/location/location-search.service';
import { AppBackButtonComponent } from '../../../../shared/ui-kit/app-back-button/app-back-button.component';
import { AppPillButtonComponent } from '../../../../shared/ui-kit/app-pill-button/app-pill-button.component';
import { AppRideMapComponent } from '../../../../shared/ui-kit/app-ride-map/app-ride-map.component';
import { RouteLocationCardComponent } from '../../components/route-location-card/route-location-card.component';
import { RideSearchResultsComponent } from '../../components/ride-search-results/ride-search-results.component';

type BookingPhase = 'search' | 'route';
type SheetMode = 'compact' | 'search';

const BAMBey_CENTER: LocationSelection = {
  label: 'Bambey',
  latitude: 14.6928,
  longitude: -16.4571,
};

@Component({
  selector: 'app-ride-booking',
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonText,
    TranslatePipe,
    AppBackButtonComponent,
    AppPillButtonComponent,
    AppRideMapComponent,
    RouteLocationCardComponent,
    RideSearchResultsComponent,
  ],
  templateUrl: './ride-booking.page.html',
  styleUrls: ['./ride-booking.page.scss'],
})
export class RideBookingPage implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
  private readonly geolocation = inject(GEOLOCATION_SERVICE);
  private readonly locationSearch = inject(LocationSearchService);
  private readonly destroy$ = new Subject<void>();
  private readonly searchQuery$ = new Subject<string>();

  @ViewChild(AppRideMapComponent)
  private rideMap?: AppRideMapComponent;

  phase: BookingPhase = 'search';
  sheetMode: SheetMode = 'compact';
  activeField: RouteField = 'destination';
  pickup: LocationSelection | null = null;
  destination: LocationSelection | null = null;
  destinationQuery = '';
  searchResults: LocationPlace[] = [];
  mapSuggestions: LocationPlace[] = [];
  searchLoading = false;
  searchErrorKey: string | null = null;
  mapSelectionField: RouteField | null = null;
  isDeliveryMode = false;

  constructor() {
    addIcons({ locationOutline, location, locateOutline, navigateOutline });
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const mode = params.get('mode');
      this.isDeliveryMode = mode === 'delivery';

      if (mode === 'map') {
        this.phase = 'route';
        this.activeField = 'destination';
        this.mapSelectionField = 'destination';
      }
    });

    this.searchQuery$
      .pipe(
        debounceTime(320),
        distinctUntilChanged(),
        tap(() => {
          this.searchLoading = true;
          this.searchErrorKey = null;
        }),
        switchMap((query) => this.locationSearch.search(query)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (results) => {
          this.searchLoading = false;
          this.searchResults = results;
          this.mapSuggestions =
            this.activeField === 'destination' && this.destinationQuery.trim()
              ? results.filter((place) => place.latitude != null && place.longitude != null)
              : [];
        },
        error: () => {
          this.searchLoading = false;
          this.searchResults = [];
          this.mapSuggestions = [];
        },
      });

    this.loadCurrentPosition();
    this.triggerSearch('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get canValidate(): boolean {
    return Boolean(this.pickup && this.destination);
  }

  get showRouteMap(): boolean {
    return this.phase === 'route';
  }

  get mapInteractive(): boolean {
    return this.sheetMode === 'compact' || this.mapSelectionField !== null;
  }

  get hasSearchQuery(): boolean {
    return Boolean(this.getActiveSearchQuery().trim());
  }

  onFieldFocus(field: RouteField): void {
    this.activeField = field;
    this.mapSelectionField = field;
    this.searchErrorKey = null;

    if (field === 'destination' && this.destination && !this.destinationQuery) {
      this.destinationQuery = this.destination.label;
    }

    this.triggerSearch(this.getActiveSearchQuery());
  }

  onDestinationQueryChange(query: string): void {
    this.destinationQuery = query;
    this.destination = null;
    this.searchErrorKey = null;
    this.triggerSearch(query);
  }

  onShareCurrentPosition(): void {
    this.geolocation
      .getCurrentPosition()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (position) => this.applyPickup(position.latitude, position.longitude),
        error: () => this.applyPickup(BAMBey_CENTER.latitude, BAMBey_CENTER.longitude),
      });
  }

  onPlaceSelect(place: LocationPlace): void {
    this.locationSearch
      .resolvePlace(place)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resolved) => this.applySelectedPlace(resolved),
        error: (error: Error) => {
          this.searchErrorKey =
            error.message === 'OUT_OF_REGION'
              ? 'RIDE_BOOKING.OUT_OF_REGION'
              : 'RIDE_BOOKING.SEARCH_ERROR';
        },
      });
  }

  onValidate(): void {
    if (!this.canValidate) {
      return;
    }

    if (this.phase === 'search') {
      this.openRouteView();
      return;
    }

    this.locationSearch.resetSession();
    void this.router.navigateByUrl('/ride-tracking');
  }

  onMapClick(coords: google.maps.LatLngLiteral): void {
    if (!isWithinDiourbelRegion(coords.lat, coords.lng)) {
      this.searchErrorKey = 'RIDE_BOOKING.OUT_OF_REGION';
      return;
    }

    const field = this.mapSelectionField ?? this.activeField;
    const label =
      field === 'pickup'
        ? this.translate.instant('RIDE_BOOKING.CURRENT_POSITION')
        : this.translate.instant('RIDE_BOOKING.SELECTED_ON_MAP');

    const selection: LocationSelection = {
      label,
      latitude: coords.lat,
      longitude: coords.lng,
    };

    if (field === 'pickup') {
      this.pickup = selection;
      this.activeField = 'destination';
      this.mapSelectionField = 'destination';
      this.triggerSearch(this.destinationQuery);
      return;
    }

    this.destination = selection;
    this.destinationQuery = label;
    this.mapSuggestions = [];
    this.searchErrorKey = null;
  }

  onLocateMe(): void {
    const target = this.pickup ?? BAMBey_CENTER;
    this.rideMap?.centerOn(target, 16);
  }

  toggleSheetMode(): void {
    this.sheetMode = this.sheetMode === 'compact' ? 'search' : 'compact';

    if (this.sheetMode === 'search') {
      this.activeField = 'destination';
      this.mapSelectionField = 'destination';
      this.triggerSearch(this.destinationQuery);
      return;
    }

    this.mapSelectionField = 'destination';
  }

  expandSheetForSearch(): void {
    this.sheetMode = 'search';
    this.activeField = 'destination';
    this.mapSelectionField = 'destination';
    this.triggerSearch(this.destinationQuery);
  }

  collapseSheet(): void {
    this.sheetMode = 'compact';
    this.mapSelectionField = 'destination';
  }

  private applySelectedPlace(resolved: LocationPlace): void {
    if (resolved.latitude == null || resolved.longitude == null) {
      return;
    }

    const selection: LocationSelection = {
      label: resolved.label,
      latitude: resolved.latitude,
      longitude: resolved.longitude,
    };

    this.searchErrorKey = null;
    this.locationSearch.resetSession();

    if (this.activeField === 'pickup') {
      this.pickup = selection;
      this.activeField = 'destination';
      this.mapSelectionField = 'destination';
      this.triggerSearch(this.destinationQuery);
      return;
    }

    this.destination = selection;
    this.destinationQuery = resolved.label;
    this.mapSuggestions = [];

    if (this.phase === 'route') {
      this.collapseSheet();
    }
  }

  private openRouteView(): void {
    this.phase = 'route';
    this.sheetMode = 'compact';
    this.mapSelectionField = 'destination';
    this.mapSuggestions = [];
  }

  private loadCurrentPosition(): void {
    this.geolocation
      .getCurrentPosition()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (position) => {
          if (isWithinDiourbelRegion(position.latitude, position.longitude)) {
            this.applyPickup(position.latitude, position.longitude);
            return;
          }

          this.applyPickup(BAMBey_CENTER.latitude, BAMBey_CENTER.longitude);
        },
        error: () => this.applyPickup(BAMBey_CENTER.latitude, BAMBey_CENTER.longitude),
      });
  }

  private applyPickup(latitude: number, longitude: number): void {
    this.pickup = {
      label: this.translate.instant('RIDE_BOOKING.CURRENT_POSITION'),
      latitude,
      longitude,
    };
  }

  private getActiveSearchQuery(): string {
    return this.activeField === 'destination' ? this.destinationQuery : '';
  }

  private triggerSearch(query: string): void {
    this.searchQuery$.next(query.trim());
  }
}
