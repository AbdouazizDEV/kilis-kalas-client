import { Routes } from '@angular/router';

export const RATING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/rating/rating.page').then((m) => m.RatingPage),
  },
];
