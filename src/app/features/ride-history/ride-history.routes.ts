import { Routes } from '@angular/router';

export const RIDE_HISTORY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/ride-history-list/ride-history-list.page').then((m) => m.RideHistoryListPage),
  },
  {
    path: 'detail',
    loadComponent: () =>
      import('./pages/ride-history/ride-history.page').then((m) => m.RideHistoryPage),
  },
];
