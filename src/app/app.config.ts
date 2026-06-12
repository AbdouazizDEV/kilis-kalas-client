import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { AUTH_SERVICE } from './core/tokens/auth.token';
import { GEOLOCATION_SERVICE } from './core/tokens/geolocation.token';
import { PAYMENT_SERVICE } from './core/tokens/payment.token';
import { RIDE_REPOSITORY } from './core/tokens/ride.token';
import { USER_REPOSITORY } from './core/tokens/user.token';
import { AuthService } from './services/auth/auth.service';
import { GeolocationService } from './services/geolocation/geolocation.service';
import { PaymentService } from './services/payment/payment.service';
import { RideRepository } from './services/ride/ride.repository';
import { UserRepository } from './services/user/user.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicStorageModule.forRoot()),
    ...provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
    ...provideTranslateService({ lang: 'fr', fallbackLang: 'fr' }),
    { provide: AUTH_SERVICE, useClass: AuthService },
    { provide: RIDE_REPOSITORY, useClass: RideRepository },
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: GEOLOCATION_SERVICE, useClass: GeolocationService },
    { provide: PAYMENT_SERVICE, useClass: PaymentService },
  ],
};
