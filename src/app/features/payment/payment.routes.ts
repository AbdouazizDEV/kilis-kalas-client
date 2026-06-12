import { Routes } from '@angular/router';

export const PAYMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/payment/payment.page').then((m) => m.PaymentPage),
  },
];
