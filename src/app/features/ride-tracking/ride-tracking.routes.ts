import { Routes } from '@angular/router';

export const RIDE_TRACKING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/ride-tracking/ride-tracking.page').then((m) => m.RideTrackingPage),
  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/ride-chat/ride-chat.page').then((m) => m.RideChatPage),
  },
];
