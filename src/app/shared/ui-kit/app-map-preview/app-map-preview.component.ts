import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { IonGrid, IonImg, IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { GoogleMapsLoaderService } from '../../../services/google-maps/google-maps-loader.service';

/** Centre par défaut : Bambey, Sénégal */
const DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 14.6928, lng: -16.4571 };

@Component({
  selector: 'app-map-preview',
  standalone: true,
  imports: [GoogleMap, MapMarker, IonGrid, IonImg, IonText, TranslatePipe],
  templateUrl: './app-map-preview.component.html',
  styleUrls: ['./app-map-preview.component.scss'],
})
export class AppMapPreviewComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly mapsLoader = inject(GoogleMapsLoaderService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('mapHost', { read: ElementRef })
  private mapHost?: ElementRef<HTMLElement>;

  @Input() center: google.maps.LatLngLiteral = DEFAULT_CENTER;
  @Input() zoom = 14;

  mapsReady = false;
  apiKeyConfigured = false;
  loadError = false;
  mapHeightPx = 0;
  markerOptions: google.maps.MarkerOptions = {};

  private resizeObserver?: ResizeObserver;
  private googleMap?: google.maps.Map;

  readonly mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    clickableIcons: false,
    gestureHandling: 'none',
  };

  ngOnInit(): void {
    this.apiKeyConfigured = this.mapsLoader.isApiKeyConfigured();

    if (!this.apiKeyConfigured) {
      return;
    }

    void this.mapsLoader
      .load()
      .then(() => {
        this.markerOptions = {
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#BF71FD',
            fillOpacity: 1,
            strokeColor: '#983EDF',
            strokeWeight: 2,
          },
        };
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
    if (!host) {
      return;
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      const height = Math.floor(entries[0]?.contentRect.height ?? 0);
      if (height <= 0 || height === this.mapHeightPx) {
        return;
      }

      this.mapHeightPx = height;
      if (this.googleMap) {
        google.maps.event.trigger(this.googleMap, 'resize');
        this.googleMap.setCenter(this.center);
      }
      this.cdr.markForCheck();
    });

    this.resizeObserver.observe(host);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  onMapInitialized(map: google.maps.Map): void {
    this.googleMap = map;
    google.maps.event.trigger(map, 'resize');
    map.setCenter(this.center);
  }

  onAuthFailure(): void {
    this.loadError = true;
    this.mapsReady = false;
    this.cdr.markForCheck();
  }
}
