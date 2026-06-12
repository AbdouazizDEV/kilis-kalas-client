import { Routes } from '@angular/router';

export const RIDE_BOOKING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/ride-booking/ride-booking.page').then((m) => m.RideBookingPage),
  },
];
