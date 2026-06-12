import { Routes } from '@angular/router';

export const RIDE_TRACKING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/ride-tracking/ride-tracking.page').then((m) => m.RideTrackingPage),
  },
];
