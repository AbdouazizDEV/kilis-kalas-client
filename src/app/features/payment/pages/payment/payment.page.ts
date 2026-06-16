import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonGrid, IonRow, IonCol, IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { PaymentMethodType } from '../../../../models/payment.model';
import { AppBackButtonComponent } from '../../../../shared/ui-kit/app-back-button/app-back-button.component';
import { AppPaymentMethodOptionComponent } from '../../../../shared/ui-kit/app-payment-method-option/app-payment-method-option.component';
import { RideBookingStateService } from '../../../../services/ride/ride-booking-state.service';

interface PaymentOptionView {
  type: PaymentMethodType;
  labelKey: string;
  iconSrc: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    TranslatePipe,
    AppBackButtonComponent,
    AppPaymentMethodOptionComponent,
  ],
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  private readonly router = inject(Router);
  private readonly bookingState = inject(RideBookingStateService);

  selectedMethod: PaymentMethodType = 'wave';

  readonly paymentOptions: PaymentOptionView[] = [
    { type: 'cash', labelKey: 'PAYMENT.CASH', iconSrc: 'assets/icons/cashMoney.svg' },
    { type: 'wave', labelKey: 'PAYMENT.WAVE', iconSrc: 'assets/icons/logoWave.svg' },
    { type: 'orange_money', labelKey: 'PAYMENT.ORANGE_MONEY', iconSrc: 'assets/icons/OrangeMoney.svg' },
  ];

  ngOnInit(): void {
    this.selectedMethod = this.bookingState.session.paymentMethod ?? 'wave';

    if (!this.bookingState.session.pickup || !this.bookingState.session.destination) {
      void this.router.navigateByUrl('/ride-booking');
    }
  }

  onMethodSelect(type: PaymentMethodType): void {
    this.selectedMethod = type;
    this.bookingState.setPaymentMethod(type);
    void this.router.navigate(['/ride-booking'], { queryParams: { phase: 'vehicle' } });
  }
}
