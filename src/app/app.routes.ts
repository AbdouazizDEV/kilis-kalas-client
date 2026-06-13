import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'onboarding/splash',
    pathMatch: 'full',
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('./features/onboarding/onboarding.routes').then((m) => m.ONBOARDING_ROUTES),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'auth/otp',
    loadComponent: () => import('./features/auth/pages/otp/otp.page').then((m) => m.OtpPage),
  },
  {
    path: 'auth/new-password',
    loadComponent: () =>
      import('./features/auth/pages/new-password/new-password.page').then((m) => m.NewPasswordPage),
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('./features/auth/pages/forgot-password/forgot-password.page').then(
        (m) => m.ForgotPasswordPage,
      ),
  },
  {
    path: 'auth',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'ride-booking',
    loadChildren: () =>
      import('./features/ride-booking/ride-booking.routes').then((m) => m.RIDE_BOOKING_ROUTES),
  },
  {
    path: 'ride-tracking',
    loadChildren: () =>
      import('./features/ride-tracking/ride-tracking.routes').then((m) => m.RIDE_TRACKING_ROUTES),
  },
  {
    path: 'ride-history',
    loadChildren: () =>
      import('./features/ride-history/ride-history.routes').then((m) => m.RIDE_HISTORY_ROUTES),
  },
  {
    path: 'payment',
    loadChildren: () => import('./features/payment/payment.routes').then((m) => m.PAYMENT_ROUTES),
  },
  {
    path: 'rating',
    loadChildren: () => import('./features/rating/rating.routes').then((m) => m.RATING_ROUTES),
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'onboarding/splash',
  },
];
