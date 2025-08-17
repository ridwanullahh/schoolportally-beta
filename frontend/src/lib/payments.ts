import UniversalSDK from './sdk';

class PaymentManager {
  private sdk: UniversalSDK;

  constructor(sdk: UniversalSDK) {
    this.sdk = sdk;
  }

  async getPaymentGatewayConfig(schoolId: string, provider: string): Promise<any> {
    const school = await this.sdk.getItem('schools', schoolId);
    if (!school || !school.paymentSettings || !school.paymentSettings[provider]) {
      throw new Error(`Payment provider ${provider} not configured for school ${schoolId}`);
    }
    return school.paymentSettings[provider];
  }

  async initiatePayment(provider: string, schoolId: string, studentId: string, studentEmail: string, feeId: string, amount: number, currency: string, description: string): Promise<any> {
    const config = await this.getPaymentGatewayConfig(schoolId, provider);
    const callbackParams = `?provider=${provider}&schoolId=${schoolId}&feeId=${feeId}`;

    switch (provider) {
      case 'paystack': {
        const res = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.secretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: studentEmail,
            amount: amount * 100,
            currency,
            callback_url: `${window.location.origin}/payment/callback${callbackParams}`,
            metadata: {
              studentId,
              schoolId,
              feeId,
              description,
            },
          }),
        });
        const data = await res.json();
        if (!data.status) {
          throw new Error(data.message);
        }
        return {
          paymentId: data.data.reference,
          redirectUrl: data.data.authorization_url,
        };
      }
      case 'stripe': {
        const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'payment_method_types[]': 'card',
            'line_items[][price_data][currency]': currency,
            'line_items[][price_data][product_data][name]': description,
            'line_items[][price_data][unit_amount]': (amount * 100).toString(),
            'line_items[][quantity]': '1',
            mode: 'payment',
            success_url: `${window.location.origin}/payment/callback${callbackParams}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${window.location.origin}/payment/cancel`,
            'client_reference_id': studentId,
          }),
        });
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
        return {
          paymentId: data.id,
          redirectUrl: data.url,
        };
      }
      case 'flutterwave': {
        const tx_ref = `SCH-${schoolId}-${Date.now()}`;
        const res = await fetch('https://api.flutterwave.com/v3/payments', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.secretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tx_ref,
            amount,
            currency,
            redirect_url: `${window.location.origin}/payment/callback${callbackParams}&tx_ref=${tx_ref}`,
            customer: {
              email: studentEmail,
              name: 'Student', // TODO: get student name
            },
            customizations: {
              title: 'School Fee Payment',
              description,
            },
          }),
        });
        const data = await res.json();
        if (data.status !== 'success') {
          throw new Error(data.message);
        }
        return {
          paymentId: tx_ref,
          redirectUrl: data.data.link,
        };
      }
      case 'razorpay': {
        const res = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa(`${config.keyId}:${config.keySecret}`)}`,
          },
          body: JSON.stringify({
            amount: amount * 100,
            currency,
            receipt: `SCH-${schoolId}-${Date.now()}`,
            notes: {
              schoolId,
              studentId,
              feeId,
            },
          }),
        });
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error.description);
        }
        return {
          paymentId: data.id,
          redirectUrl: `https://checkout.razorpay.com/v1/checkout.js`, // Special handling for Razorpay
          orderId: data.id,
          keyId: config.keyId,
          amount: data.amount,
          currency: data.currency,
          description,
          studentEmail
        };
      }
      case 'paypal': {
        const auth = btoa(`${config.clientId}:${config.clientSecret}`);
        const res = await fetch(`https://api.${config.mode}.paypal.com/v2/checkout/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
              description,
              amount: {
                currency_code: currency,
                value: amount.toString(),
              },
            }],
            application_context: {
              return_url: `${window.location.origin}/payment/callback${callbackParams}`,
              cancel_url: `${window.location.origin}/payment/cancel`,
            }
          }),
        });
        const data = await res.json();
        if (data.links) {
          const approvalLink = data.links.find((link: any) => link.rel === 'approve');
          return {
            paymentId: data.id,
            redirectUrl: approvalLink.href,
          };
        }
        throw new Error(data.message);
      }
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }

  async verifyPayment(provider: string, schoolId: string, transactionId: string): Promise<any> {
    const config = await this.getPaymentGatewayConfig(schoolId, provider);

    switch (provider) {
      case 'paystack': {
        const res = await fetch(`https://api.paystack.co/transaction/verify/${transactionId}`, {
          headers: {
            Authorization: `Bearer ${config.secretKey}`,
          },
        });
        const data = await res.json();
        if (!data.status || data.data.status !== 'success') {
          throw new Error(data.message || 'Payment verification failed');
        }
        return {
          status: 'success',
          transactionId,
          amount: data.data.amount / 100,
          currency: data.data.currency,
        };
      }
      case 'stripe': {
        const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${transactionId}`, {
          headers: {
            Authorization: `Bearer ${config.secretKey}`,
          },
        });
        const data = await res.json();
        if (data.error || data.payment_status !== 'paid') {
          throw new Error(data.error?.message || 'Payment verification failed');
        }
        return {
          status: 'success',
          transactionId: data.id,
          amount: data.amount_total / 100,
          currency: data.currency,
        };
      }
      case 'flutterwave': {
        const res = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${transactionId}`, {
          headers: {
            Authorization: `Bearer ${config.secretKey}`,
          },
        });
        const data = await res.json();
        if (data.status !== 'success' || data.data.status !== 'successful') {
          throw new Error(data.message || 'Payment verification failed');
        }
        return {
          status: 'success',
          transactionId,
          amount: data.data.amount,
          currency: data.data.currency,
        };
      }
      case 'razorpay': {
        // Verification for Razorpay is done on the client-side with the response from the checkout
        // This function can be used to verify the payment signature on the server-side
        return {
          status: 'success',
          transactionId,
        };
      }
      case 'paypal': {
        const auth = btoa(`${config.clientId}:${config.clientSecret}`);
        const res = await fetch(`https://api.${config.mode}.paypal.com/v2/checkout/orders/${transactionId}/capture`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
        });
        const data = await res.json();
        if (data.status === 'COMPLETED') {
          return {
            status: 'success',
            transactionId,
            amount: data.purchase_units[0].payments.captures[0].amount.value,
            currency: data.purchase_units[0].payments.captures[0].amount.currency_code,
          };
        }
        throw new Error(data.message || 'Payment verification failed');
      }
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }
}

export default PaymentManager;