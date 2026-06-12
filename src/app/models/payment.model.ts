export type PaymentMethodType = 'cash' | 'orange_money' | 'wave' | 'card';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  isDefault: boolean;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message?: string;
}

export interface PaymentRequest {
  rideId: string;
  amountXof: number;
  methodId: string;
}
