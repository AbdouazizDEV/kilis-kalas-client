import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonImg,
  IonText,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription, interval, switchMap, takeWhile } from 'rxjs';
import { addIcons } from 'ionicons';
import {
  callOutline,
  chatbubbleOutline,
  locateOutline,
  navigateOutline,
  warningOutline,
} from 'ionicons/icons';
import { RIDE_REPOSITORY } from '../../../../core/tokens/ride.token';
import { Ride, RideStatus } from '../../../../models/ride.model';
import { RideBookingStateService } from '../../../../services/ride/ride-booking-state.service';
import { AppAvatarComponent } from '../../../../shared/ui-kit/app-avatar/app-avatar.component';
import { AppBackButtonComponent } from '../../../../shared/ui-kit/app-back-button/app-back-button.component';
import { AppPillButtonComponent } from '../../../../shared/ui-kit/app-pill-button/app-pill-button.component';
import { AppRatingStarsComponent } from '../../../../shared/ui-kit/app-rating-stars/app-rating-stars.component';
import { AppRideMapComponent } from '../../../../shared/ui-kit/app-ride-map/app-ride-map.component';
import { AppTripRouteSummaryComponent } from '../../../../shared/ui-kit/app-trip-route-summary/app-trip-route-summary.component';
import { LocationSelection } from '../../../../models/location.model';

@Component({
  selector: 'app-ride-tracking',
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    IonImg,
    IonText,
    TranslatePipe,
    AppBackButtonComponent,
    AppPillButtonComponent,
    AppRideMapComponent,
    AppTripRouteSummaryComponent,
    AppAvatarComponent,
    AppRatingStarsComponent,
  ],
  templateUrl: './ride-tracking.page.html',
  styleUrls: ['./ride-tracking.page.scss'],
})
export class RideTrackingPage implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly bookingState = inject(RideBookingStateService);
  private readonly rideRepository = inject(RIDE_REPOSITORY);

  @ViewChild(AppRideMapComponent)
  private rideMap?: AppRideMapComponent;

  ride: Ride | null = null;
  pickup: LocationSelection | null = null;
  destination: LocationSelection | null = null;
  rating = 4;
  pollingSub?: Subscription;

  constructor() {
    addIcons({ locateOutline, chatbubbleOutline, callOutline, navigateOutline, warningOutline });
  }

  ngOnInit(): void {
    const session = this.bookingState.session;
    this.pickup = session.pickup;
    this.destination = session.destination;
    this.ride = session.ride;

    if (!this.ride || !this.pickup || !this.destination) {
      void this.router.navigateByUrl('/ride-booking');
      return;
    }

    this.startPolling();
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  get status(): RideStatus {
    return this.ride?.status ?? 'searching';
  }

  get isSearching(): boolean {
    return this.status === 'searching';
  }

  get isDriverArriving(): boolean {
    return this.status === 'driver_arriving' || this.status === 'accepted';
  }

  get isInProgress(): boolean {
    return this.status === 'in_progress';
  }

  get isCompleted(): boolean {
    return this.status === 'completed';
  }

  get etaMinutes(): number {
    return this.ride?.etaMinutes ?? 20;
  }

  get searchVehicleIcon(): string {
    const type = this.ride?.vehicleType ?? this.bookingState.session.vehicleType ?? 'moto';
    return type === 'auto' ? 'assets/icon/Auto.svg' : 'assets/icon/Motorcycle.svg';
  }

  get completedDateLabel(): string {
    if (!this.ride?.completedAt) {
      return '';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(this.ride.completedAt));
  }

  onLocateMe(): void {
    if (this.pickup) {
      this.rideMap?.centerOn(this.pickup, 16);
    }
  }

  onOpenChat(): void {
    this.bookingState.initChat();
    void this.router.navigateByUrl('/ride-tracking/chat');
  }

  onCancel(): void {
    if (!this.ride) {
      return;
    }

    this.rideRepository.cancelRide(this.ride.id).subscribe(() => {
      this.rideRepository.resetActiveRide();
      this.bookingState.reset();
      void this.router.navigateByUrl('/home');
    });
  }

  onFinish(): void {
    this.rideRepository.resetActiveRide();
    this.bookingState.reset();
    void this.router.navigateByUrl('/home');
  }

  onViewDetails(): void {
    void this.router.navigateByUrl('/ride-history/detail');
  }

  onRatingChange(value: number): void {
    this.rating = value;
  }

  private startPolling(): void {
    if (!this.ride) {
      return;
    }

    this.pollingSub = interval(3000)
      .pipe(
        switchMap(() => this.rideRepository.getRideStatus(this.ride!.id)),
        takeWhile((ride) => ride.status !== 'cancelled', true),
      )
      .subscribe((ride) => {
        this.ride = ride;
        this.bookingState.setRide(ride);
      });
  }
}
