import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { IonGrid, IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { LocationPlace, LocationSelection } from '../../../models/location.model';
import { GoogleMapsLoaderService } from '../../../services/google-maps/google-maps-loader.service';

const DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 14.6928, lng: -16.4571 };

@Component({
  selector: 'app-ride-map',
  standalone: true,
  imports: [GoogleMap, IonGrid, IonText, TranslatePipe],
  templateUrl: './app-ride-map.component.html',
  styleUrls: ['./app-ride-map.component.scss'],
})
export class AppRideMapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  private readonly mapsLoader = inject(GoogleMapsLoaderService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('mapHost', { read: ElementRef })
  private mapHost?: ElementRef<HTMLElement>;

  @Input() pickup: LocationSelection | null = null;
  @Input() destination: LocationSelection | null = null;
  @Input() suggestions: LocationPlace[] = [];
  @Input() interactive = true;
  @Input() mapSelectionField: 'pickup' | 'destination' | null = null;
  @Input() center: google.maps.LatLngLiteral = DEFAULT_CENTER;
  @Input() zoom = 14;

  @Output() mapClick = new EventEmitter<google.maps.LatLngLiteral>();

  mapsReady = false;
  apiKeyConfigured = false;
  loadError = false;
  mapHeightPx = 0;

  readonly mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    clickableIcons: false,
    gestureHandling: 'greedy',
  };

  private googleMap?: google.maps.Map;
  private directionsService?: google.maps.DirectionsService;
  private directionsRenderer?: google.maps.DirectionsRenderer;
  private pickupMarker?: google.maps.Marker;
  private destinationMarker?: google.maps.Marker;
  private suggestionMarkers: google.maps.Marker[] = [];
  private resizeObserver?: ResizeObserver;

  ngOnInit(): void {
    this.apiKeyConfigured = this.mapsLoader.isApiKeyConfigured();
    if (!this.apiKeyConfigured) {
      return;
    }

    void this.mapsLoader
      .load()
      .then(() => {
        this.mapsReady = true;
        this.cdr.markForCheck();
      })
      .catch(() => {
        this.loadError = true;
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    const host = this.mapHost?.nativeElement;
    if (host) {
      this.observeHost(host);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.googleMap) {
      return;
    }

    if (changes['pickup'] || changes['destination']) {
      this.syncMarkersAndRoute();
    }

    if (changes['suggestions']) {
      this.syncSuggestionMarkers();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.clearSuggestionMarkers();
    this.pickupMarker?.setMap(null);
    this.destinationMarker?.setMap(null);
    this.directionsRenderer?.setMap(null);
  }

  observeHost(host: HTMLElement): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver((entries) => {
      const height = Math.floor(entries[0]?.contentRect.height ?? 0);
      if (height <= 0 || height === this.mapHeightPx) {
        return;
      }

      this.mapHeightPx = height;
      if (this.googleMap) {
        google.maps.event.trigger(this.googleMap, 'resize');
      }
      this.cdr.markForCheck();
    });
    this.resizeObserver.observe(host);
  }

  onMapInitialized(map: google.maps.Map): void {
    this.googleMap = map;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#10B981',
        strokeWeight: 5,
        strokeOpacity: 0.9,
      },
    });

    google.maps.event.trigger(map, 'resize');
    this.syncMarkersAndRoute();
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (!this.interactive || !event.latLng) {
      return;
    }

    this.mapClick.emit(event.latLng.toJSON());
  }

  centerOn(point: LocationSelection, zoom = 16): void {
    if (!this.googleMap) {
      return;
    }

    this.googleMap.panTo({ lat: point.latitude, lng: point.longitude });
    this.googleMap.setZoom(zoom);
  }

  fitRoute(): void {
    if (!this.googleMap || !this.directionsRenderer) {
      return;
    }

    const directions = this.directionsRenderer.getDirections();
    const bounds = directions?.routes[0]?.bounds;
    if (bounds) {
      this.googleMap.fitBounds(bounds, 64);
    }
  }

  fitSuggestions(): void {
    if (!this.googleMap || !this.suggestions.length) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    this.suggestions.forEach((place) => {
      if (place.latitude != null && place.longitude != null) {
        bounds.extend({ lat: place.latitude, lng: place.longitude });
      }
    });

    if (!bounds.isEmpty()) {
      this.googleMap.fitBounds(bounds, 72);
    }
  }

  onAuthFailure(): void {
    this.loadError = true;
    this.mapsReady = false;
    this.cdr.markForCheck();
  }

  private syncMarkersAndRoute(): void {
    if (!this.googleMap) {
      return;
    }

    this.updateMarker('pickup', this.pickup, '#BF71FD', '#983EDF');
    this.updateMarker('destination', this.destination, '#10B981', '#09420B', true);
    this.drawRoute();
  }

  private updateMarker(
    role: 'pickup' | 'destination',
    location: LocationSelection | null,
    fillColor: string,
    strokeColor: string,
    pin = false,
  ): void {
    const current = role === 'pickup' ? this.pickupMarker : this.destinationMarker;

    if (!location) {
      current?.setMap(null);
      if (role === 'pickup') {
        this.pickupMarker = undefined;
      } else {
        this.destinationMarker = undefined;
      }
      return;
    }

    const position = { lat: location.latitude, lng: location.longitude };
    const icon: google.maps.Symbol | google.maps.Icon = pin
      ? {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor,
          fillOpacity: 1,
          strokeColor,
          strokeWeight: 1.5,
          scale: 1.4,
          anchor: new google.maps.Point(12, 22),
        }
      : {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor,
          fillOpacity: 1,
          strokeColor,
          strokeWeight: 2,
        };

    if (current) {
      current.setPosition(position);
      current.setIcon(icon);
      return;
    }

    const marker = new google.maps.Marker({
      map: this.googleMap,
      position,
      icon,
      zIndex: role === 'destination' ? 2 : 1,
    });

    if (role === 'pickup') {
      this.pickupMarker = marker;
    } else {
      this.destinationMarker = marker;
    }
  }

  private drawRoute(): void {
    if (!this.pickup || !this.destination || !this.directionsService || !this.directionsRenderer) {
      return;
    }

    this.directionsService.route(
      {
        origin: { lat: this.pickup.latitude, lng: this.pickup.longitude },
        destination: { lat: this.destination.latitude, lng: this.destination.longitude },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status !== google.maps.DirectionsStatus.OK || !result) {
          return;
        }

        this.directionsRenderer?.setDirections(result);
        this.fitRoute();
      },
    );
  }

  private syncSuggestionMarkers(): void {
    if (!this.googleMap) {
      return;
    }

    this.clearSuggestionMarkers();

    this.suggestions.forEach((place) => {
      if (place.latitude == null || place.longitude == null) {
        return;
      }

      const marker = new google.maps.Marker({
        map: this.googleMap,
        position: { lat: place.latitude, lng: place.longitude },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: '#10B981',
          fillOpacity: 0.55,
          strokeColor: '#09420B',
          strokeWeight: 1.5,
        },
        zIndex: 0,
      });

      this.suggestionMarkers.push(marker);
    });

    if (this.suggestions.length && !this.destination) {
      this.fitSuggestions();
    }
  }

  private clearSuggestionMarkers(): void {
    this.suggestionMarkers.forEach((marker) => marker.setMap(null));
    this.suggestionMarkers = [];
  }
}
