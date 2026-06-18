import { Routes } from '@angular/router';

export const HELP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/help/help.page').then((m) => m.HelpPage),
  },
];
