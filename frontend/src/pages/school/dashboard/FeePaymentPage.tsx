import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/hooks/useSchool';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import sdk from '@/lib/sdk-config';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PaymentManager from '@/lib/payments';

interface Fee {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  currency: string;
  studentId: string;
  status: string;
}

const FeePaymentPage: React.FC = () => {
  const { user } = useAuth();
  const { school } = useSchool();
  const [fees, setFees] = useState<Fee[]>([]);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [paymentManager, setPaymentManager] = useState<PaymentManager | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sdk) {
      setPaymentManager(new PaymentManager(sdk));
      fetchFees();
    }
  }, [sdk]);

  const fetchFees = async () => {
    if (!sdk || !user) return;
    setLoading(true);
    try {
      const allFees = await sdk.get<Fee>('fees');
      const userFees = allFees.filter(fee => fee.studentId === user.id && fee.status !== 'paid');
      setFees(userFees);
    } catch (err) {
      setError('Failed to fetch fees.');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!paymentManager || !selectedFee || !selectedProvider || !school || !user) return;

    setLoading(true);
    setError(null);

    try {
      const result = await paymentManager.initiatePayment(
        selectedProvider,
        school.id,
        user.id,
        user.email,
        selectedFee.id,
        selectedFee.amount,
        selectedFee.currency,
        selectedFee.description
      );
      window.location.href = result.redirectUrl;
    } catch (err) {
      setError('Payment initiation failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fee Payments</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fees.map((fee) => (
            <TableRow key={fee.id}>
              <TableCell>{fee.description}</TableCell>
              <TableCell>${fee.amount}</TableCell>
              <TableCell>{fee.dueDate}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedFee(fee)}>Pay Now</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select Payment Provider</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Select onValueChange={setSelectedProvider}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {school?.paymentSettings &&
                            Object.keys(school.paymentSettings).map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handlePay} disabled={!selectedProvider || loading}>
                        {loading ? 'Processing...' : 'Proceed to Payment'}
                      </Button>
                      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FeePaymentPage;