export interface PaymentResult {
  status: 'success' | 'failed';
  transactionId?: string;
  amount?: number;
  currency?: string;
  provider?: string;
  message?: string;
}
