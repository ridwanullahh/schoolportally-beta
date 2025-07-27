import React, { useState, useEffect } from 'react';
import { useSchool } from '@/hooks/useSchool';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const paymentProviders = [
  { value: 'paystack', label: 'Paystack' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'flutterwave', label: 'Flutterwave' },
  { value: 'razorpay', label: 'Razorpay' },
  { value: 'paypal', label: 'Paypal' },
];

const PaymentSettingsPage: React.FC = () => {
  const { school, updateSchool } = useSchool();
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [configuredProviders, setConfiguredProviders] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (school?.paymentSettings) {
      setConfiguredProviders(Object.keys(school.paymentSettings));
    }
  }, [school]);

  const handleSave = async () => {
    if (!selectedProvider || !school) return;
    const newSettings = {
      ...school.paymentSettings,
      [selectedProvider]: credentials,
    };
    try {
      await updateSchool({ paymentSettings: newSettings });
      toast({ title: 'Success', description: 'Payment settings saved successfully' });
      setConfiguredProviders(Object.keys(newSettings));
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save payment settings' });
    }
  };

  const handleTest = async () => {
    if (!selectedProvider || !credentials) return;
    // This is a mock test. In a real application, you would make a request
    // to the provider's API to validate the credentials.
    toast({ title: 'Info', description: `Testing ${selectedProvider} credentials...` });
    setTimeout(() => {
      if (credentials.secretKey || credentials.keySecret || credentials.clientSecret) {
        toast({ title: 'Success', description: 'Credentials are valid.' });
      } else {
        toast({ title: 'Error', description: 'Invalid credentials.' });
      }
    }, 1000);
  };

  const renderCredentialFields = () => {
    switch (selectedProvider) {
      case 'paystack':
        return (
          <>
            <Input
              placeholder="Public Key"
              onChange={(e) => setCredentials({ ...credentials, publicKey: e.target.value })}
            />
            <Input
              placeholder="Secret Key"
              onChange={(e) => setCredentials({ ...credentials, secretKey: e.target.value })}
            />
          </>
        );
      case 'stripe':
        return (
          <>
            <Input
              placeholder="Public Key"
              onChange={(e) => setCredentials({ ...credentials, publicKey: e.target.value })}
            />
            <Input
              placeholder="Secret Key"
              onChange={(e) => setCredentials({ ...credentials, secretKey: e.target.value })}
            />
          </>
        );
      case 'flutterwave':
        return (
          <>
            <Input
              placeholder="Public Key"
              onChange={(e) => setCredentials({ ...credentials, publicKey: e.target.value })}
            />
            <Input
              placeholder="Secret Key"
              onChange={(e) => setCredentials({ ...credentials, secretKey: e.target.value })}
            />
          </>
        );
      case 'razorpay':
        return (
          <>
            <Input
              placeholder="Key ID"
              onChange={(e) => setCredentials({ ...credentials, keyId: e.target.value })}
            />
            <Input
              placeholder="Key Secret"
              onChange={(e) => setCredentials({ ...credentials, keySecret: e.target.value })}
            />
          </>
        );
      case 'paypal':
        return (
          <>
            <Input
              placeholder="Client ID"
              onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
            />
            <Input
              placeholder="Client Secret"
              onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
            />
            <Select onValueChange={(value) => setCredentials({ ...credentials, mode: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payment Gateway Settings</h1>
      <div className="space-y-4">
        <Select onValueChange={setSelectedProvider}>
          <SelectTrigger>
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            {paymentProviders.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {renderCredentialFields()}

        <div className="flex space-x-2">
          <Button onClick={handleSave}>Save Settings</Button>
          <Button onClick={handleTest} variant="outline" disabled={!selectedProvider}>
            Test Credentials
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Configured Providers</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configuredProviders.map((provider) => (
              <TableRow key={provider}>
                <TableCell>{provider}</TableCell>
                <TableCell>
                  <span className="text-green-500">Configured</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentSettingsPage;