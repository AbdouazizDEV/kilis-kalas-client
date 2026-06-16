import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonImg, IonText } from '@ionic/angular/standalone';
import { PaymentMethodType } from '../../../models/payment.model';

@Component({
  selector: 'app-payment-method-option',
  standalone: true,
  imports: [IonImg, IonText],
  templateUrl: './app-payment-method-option.component.html',
  styleUrls: ['./app-payment-method-option.component.scss'],
})
export class AppPaymentMethodOptionComponent {
  @Input() type: PaymentMethodType = 'cash';
  @Input() label = '';
  @Input() iconSrc = '';
  @Input() selected = false;

  @Output() selectedChange = new EventEmitter<PaymentMethodType>();

  onSelect(): void {
    this.selectedChange.emit(this.type);
  }
}
