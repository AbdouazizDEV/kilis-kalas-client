import { Component, OnInit, inject } from '@angular/core';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PaymentMethodType } from '../../../../models/payment.model';
import { Ride, VehicleType } from '../../../../models/ride.model';
import { RideBookingStateService } from '../../../../services/ride/ride-booking-state.service';
import { AppAvatarComponent } from '../../../../shared/ui-kit/app-avatar/app-avatar.component';
import { AppBackButtonComponent } from '../../../../shared/ui-kit/app-back-button/app-back-button.component';
import { AppTripRouteSummaryComponent } from '../../../../shared/ui-kit/app-trip-route-summary/app-trip-route-summary.component';

@Component({
  selector: 'app-ride-history',
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    TranslatePipe,
    AppBackButtonComponent,
    AppAvatarComponent,
    AppTripRouteSummaryComponent,
  ],
  templateUrl: './ride-history.page.html',
  styleUrls: ['./ride-history.page.scss'],
})
export class RideHistoryPage implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly bookingState = inject(RideBookingStateService);

  ride: Ride | null = null;
  pickupLabel = '';
  destinationLabel = '';
  paymentMethod: PaymentMethodType = 'wave';
  vehicleType: VehicleType = 'moto';

  ngOnInit(): void {
    const session = this.bookingState.session;
    this.ride = session.ride;
    this.pickupLabel = session.pickup?.label ?? this.ride?.pickup.address ?? '';
    this.destinationLabel = session.destination?.label ?? this.ride?.destination.address ?? '';
    this.paymentMethod = session.paymentMethod;
    this.vehicleType = session.vehicleType ?? this.ride?.vehicleType ?? 'moto';

    if (!this.ride) {
      this.ride = this.createFallbackRide();
      this.pickupLabel = this.ride.pickup.address ?? 'Bambey Centre';
      this.destinationLabel = this.ride.destination.address ?? 'Université de Bambey';
    }
  }

  private createFallbackRide(): Ride {
    return {
      id: 'ride-demo',
      passengerId: 'current-user',
      reference: 'AA-000-AA',
      status: 'completed',
      vehicleType: 'moto',
      pickup: { latitude: 14.6937, longitude: -16.4441, address: 'Bambey Centre' },
      destination: { latitude: 14.7012, longitude: -16.4312, address: 'Université de Bambey' },
      estimate: { distanceKm: 3.5, durationMinutes: 8, priceXof: 2000, currency: 'XOF' },
      driver: {
        id: 'driver-1',
        name: 'Moussa Diop',
        phone: '+221771112233',
        rating: 4.8,
        vehicle: {
          plate: 'AA-000-AA',
          model: 'Moto',
          color: 'Verte',
          type: 'moto',
          iconSrc: 'assets/icon/Motorcycle.svg',
        },
      },
      createdAt: new Date('2025-10-18'),
      completedAt: new Date('2025-10-18'),
    };
  }

  get driverName(): string {
    return this.ride?.driver?.name ?? '';
  }

  get vehicleMeta(): string {
    const vehicle = this.ride?.driver?.vehicle;
    if (!vehicle) {
      return '';
    }

    return `${vehicle.plate} | ${vehicle.model} ${vehicle.color}`;
  }

  get tripReference(): string {
    return this.ride?.reference ?? '';
  }

  get tripDateLabel(): string {
    const date = this.ride?.completedAt ?? this.ride?.createdAt;
    if (!date) {
      return '';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  }

  get durationLabel(): string {
    const minutes = this.ride?.estimate?.durationMinutes ?? 8;
    const wholeMinutes = Math.floor(minutes);
    const seconds = Math.round((minutes - wholeMinutes) * 60);
    return `${String(wholeMinutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
  }

  get distanceLabel(): string {
    const distance = this.ride?.estimate?.distanceKm ?? 3.5;
    return `${distance.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
  }

  get vehicleOfferLabel(): string {
    switch (this.vehicleType) {
      case 'auto':
        return this.translate.instant('RIDE_BOOKING.VEHICLE_AUTO');
      case 'delivery':
        return this.translate.instant('RIDE_BOOKING.VEHICLE_DELIVERY');
      default:
        return this.translate.instant('RIDE_BOOKING.VEHICLE_MOTO');
    }
  }

  get priceLabel(): string {
    const price = this.ride?.estimate?.priceXof ?? 2000;
    return `${new Intl.NumberFormat('fr-FR').format(price)} FCFA`;
  }

  get paymentLabel(): string {
    switch (this.paymentMethod) {
      case 'cash':
        return this.translate.instant('PAYMENT.CASH');
      case 'orange_money':
        return this.translate.instant('PAYMENT.ORANGE_MONEY');
      case 'card':
        return this.translate.instant('PAYMENT.CASH');
      default:
        return this.translate.instant('PAYMENT.WAVE');
    }
  }
}
