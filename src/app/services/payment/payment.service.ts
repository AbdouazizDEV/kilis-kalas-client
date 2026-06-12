import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { IPaymentService } from '../../core/interfaces/i-payment.service';
import { PaymentMethod, PaymentMethodType, PaymentRequest, PaymentResult } from '../../models/payment.model';

@Injectable()
export class PaymentService implements IPaymentService {
  getPaymentMethods(): Observable<PaymentMethod[]> {
    const methods: PaymentMethod[] = [
      { id: 'cash', type: 'cash' as PaymentMethodType, label: 'Espèces', isDefault: true },
      { id: 'orange', type: 'orange_money' as PaymentMethodType, label: 'Orange Money', isDefault: false },
      { id: 'wave', type: 'wave' as PaymentMethodType, label: 'Wave', isDefault: false },
    ];
    return of(methods).pipe(delay(300));
  }

  processPayment(request: PaymentRequest): Observable<PaymentResult> {
    return of({
      success: true,
      transactionId: `txn-${Date.now()}`,
      message: 'Paiement effectué avec succès',
    }).pipe(delay(500));
  }
}
