import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PaymentMethodType } from '../../models/payment.model';
import { ChatMessage, DriverProfile, Ride, RideEstimate, VehicleType } from '../../models/ride.model';
import { LocationSelection } from '../../models/location.model';

export interface BookingSession {
  pickup: LocationSelection | null;
  destination: LocationSelection | null;
  vehicleType: VehicleType;
  paymentMethod: PaymentMethodType;
  estimate: RideEstimate | null;
  ride: Ride | null;
  chatMessages: ChatMessage[];
}

const DEFAULT_SESSION: BookingSession = {
  pickup: null,
  destination: null,
  vehicleType: 'moto',
  paymentMethod: 'wave',
  estimate: null,
  ride: null,
  chatMessages: [],
};

@Injectable({ providedIn: 'root' })
export class RideBookingStateService {
  private readonly sessionSubject = new BehaviorSubject<BookingSession>({ ...DEFAULT_SESSION });
  readonly session$ = this.sessionSubject.asObservable();

  get session(): BookingSession {
    return this.sessionSubject.value;
  }

  setPickup(pickup: LocationSelection): void {
    this.patch({ pickup });
  }

  setDestination(destination: LocationSelection): void {
    this.patch({ destination });
  }

  setVehicleType(vehicleType: VehicleType): void {
    this.patch({ vehicleType });
  }

  setPaymentMethod(paymentMethod: PaymentMethodType): void {
    this.patch({ paymentMethod });
  }

  setEstimate(estimate: RideEstimate): void {
    this.patch({ estimate });
  }

  setRide(ride: Ride): void {
    this.patch({ ride });
  }

  updateRide(partial: Partial<Ride>): void {
    const ride = this.session.ride;
    if (!ride) {
      return;
    }

    this.patch({ ride: { ...ride, ...partial } });
  }

  addChatMessage(message: ChatMessage): void {
    this.patch({ chatMessages: [...this.session.chatMessages, message] });
  }

  initChat(): void {
    if (this.session.chatMessages.length) {
      return;
    }

    this.patch({
      chatMessages: [
        {
          id: 'welcome',
          sender: 'driver',
          text: 'Bonjour, je suis en route vers vous.',
          sentAt: new Date(),
        },
      ],
    });
  }

  reset(): void {
    this.sessionSubject.next({ ...DEFAULT_SESSION });
  }

  private patch(partial: Partial<BookingSession>): void {
    this.sessionSubject.next({ ...this.session, ...partial });
  }
}
