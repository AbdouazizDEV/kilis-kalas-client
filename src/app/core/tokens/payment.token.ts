import { InjectionToken } from '@angular/core';
import { IPaymentService } from '../interfaces/i-payment.service';

export const PAYMENT_SERVICE = new InjectionToken<IPaymentService>('PAYMENT_SERVICE');
