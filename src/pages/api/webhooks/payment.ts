import type { NextApiRequest, NextApiResponse } from 'next';
import sdk from '@/lib/sdk-config';
import crypto from 'crypto';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const provider = req.query.provider as string;

  try {
    switch (provider) {
      case 'paystack': {
        const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
          .update(JSON.stringify(req.body))
          .digest('hex');
        if (hash !== req.headers['x-paystack-signature']) {
          return res.status(401).json({ message: 'Invalid signature' });
        }

        const { event, data } = req.body;
        if (event === 'charge.success') {
          const { reference, amount, currency } = data;
          const fee = await sdk.queryBuilder('fees').where(f => f.transactionId === reference).exec();
          if (fee.length > 0) {
            await sdk.update('fees', fee[0].id, {
              status: 'paid',
              paidAt: new Date().toISOString(),
              amount: amount / 100,
              currency,
            });
          }
        }
        break;
      }
      case 'stripe': {
        const sig = req.headers['stripe-signature']!;
        const event = JSON.parse(req.body);

        // TODO: Verify Stripe signature using `stripe.webhooks.constructEvent`

        if (event.type === 'checkout.session.completed') {
          const session = event.data.object;
          const { client_reference_id, amount_total, currency } = session;
          const fee = await sdk.queryBuilder('fees').where(f => f.studentId === client_reference_id).exec();
          if (fee.length > 0) {
            await sdk.update('fees', fee[0].id, {
              status: 'paid',
              paidAt: new Date().toISOString(),
              amount: amount_total / 100,
              currency,
            });
          }
        }
        break;
      }
      case 'flutterwave': {
        const signature = req.headers['verif-hash'] as string;
        if (!signature || signature !== process.env.FLUTTERWAVE_HASH) {
          return res.status(401).json({ message: 'Invalid signature' });
        }

        const { tx_ref, amount, currency, status } = req.body;
        if (status === 'successful') {
          const fee = await sdk.queryBuilder('fees').where(f => f.transactionId === tx_ref).exec();
          if (fee.length > 0) {
            await sdk.update('fees', fee[0].id, {
              status: 'paid',
              paidAt: new Date().toISOString(),
              amount,
              currency,
            });
          }
        }
        break;
      }
      case 'razorpay': {
        const signature = req.headers['x-razorpay-signature'] as string;
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest !== signature) {
          return res.status(401).json({ message: 'Invalid signature' });
        }

        const { event, payload } = req.body;
        if (event === 'payment.authorized') {
          const { payment } = payload;
          const { order_id, amount, currency } = payment;
          const fee = await sdk.queryBuilder('fees').where(f => f.transactionId === order_id).exec();
          if (fee.length > 0) {
            await sdk.update('fees', fee[0].id, {
              status: 'paid',
              paidAt: new Date().toISOString(),
              amount: amount / 100,
              currency,
            });
          }
        }
        break;
      }
      case 'paypal': {
        // TODO: Implement PayPal webhook verification
        const { event_type, resource } = req.body;
        if (event_type === 'CHECKOUT.ORDER.APPROVED') {
          const { id, purchase_units } = resource;
          const { amount } = purchase_units[0];
          const fee = await sdk.queryBuilder('fees').where(f => f.transactionId === id).exec();
          if (fee.length > 0) {
            await sdk.update('fees', fee[0].id, {
              status: 'paid',
              paidAt: new Date().toISOString(),
              amount: parseFloat(amount.value),
              currency: amount.currency_code,
            });
          }
        }
        break;
      }
      default:
        return res.status(400).json({ message: 'Unsupported provider' });
    }

    res.status(200).json({ message: 'Webhook received' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;