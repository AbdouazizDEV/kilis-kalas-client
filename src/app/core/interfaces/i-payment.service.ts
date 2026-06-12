import { Observable } from 'rxjs';
import { PaymentMethod, PaymentRequest, PaymentResult } from '../../models/payment.model';

export interface IPaymentService {
  getPaymentMethods(): Observable<PaymentMethod[]>;
  processPayment(request: PaymentRequest): Observable<PaymentResult>;
}
