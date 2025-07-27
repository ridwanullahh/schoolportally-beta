import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentManager from '@/lib/payments';
import { useToast } from '@/hooks/use-toast';
import sdk from '@/lib/sdk-config';

const PaymentCallbackPage: React.FC = () => {
  const [paymentManager, setPaymentManager] = useState<PaymentManager | null>(null);
  const [status, setStatus] = useState('verifying');
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (sdk) {
      setPaymentManager(new PaymentManager(sdk));
    }
  }, [sdk]);

  useEffect(() => {
    const verify = async () => {
      if (!paymentManager || !sdk) return;

      const params = new URLSearchParams(location.search);
      const provider = params.get('provider');
      const transactionId = params.get('transaction_id') || params.get('reference') || params.get('session_id') || params.get('tx_ref');
      const orderId = params.get('orderID'); // For PayPal
      const feeId = params.get('feeId');
      const schoolId = params.get('schoolId');

      if (!provider || (!transactionId && !orderId) || !feeId || !schoolId) {
        setStatus('failed');
        toast({ title: 'Error', description: 'Invalid payment callback URL.' });
        return;
      }

      try {
        const finalTransactionId = provider === 'paypal' ? orderId! : transactionId!;
        const result = await paymentManager.verifyPayment(provider, schoolId, finalTransactionId);

        if (result.status === 'success') {
          await sdk.update('fees', feeId, {
            status: 'paid',
            paidAt: new Date().toISOString(),
            transactionId: finalTransactionId,
            paymentMethod: provider,
          });

          setStatus('success');
          toast({ title: 'Success', description: 'Payment successful!' });
          navigate('/dashboard/fees');
        } else {
          setStatus('failed');
          toast({ title: 'Error', description: result.message || 'Payment verification failed.' });
        }
      } catch (error: any) {
        setStatus('failed');
        toast({ title: 'Error', description: error.message || 'An unexpected error occurred.' });
      }
    };

    if (paymentManager && sdk) {
      verify();
    }
  }, [paymentManager, sdk, location, navigate, toast]);

  return (
    <div className="flex justify-center items-center h-screen">
      {status === 'verifying' && <div>Verifying payment...</div>}
      {status === 'success' && <div>Payment successful! Redirecting...</div>}
      {status === 'failed' && <div>Payment failed. Please try again.</div>}
    </div>
  );
};

export default PaymentCallbackPage;