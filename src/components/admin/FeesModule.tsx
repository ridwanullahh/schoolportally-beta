
import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Settings, DollarSign, Calendar, Users } from 'lucide-react';

interface Fee {
  id: string;
  schoolId: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string;
  category: string;
  status: string;
  studentId?: string;
  paidAt?: string;
  paymentMethod?: string;
  transactionId?: string;
  paystackConfig?: any;
  installments?: any[];
  createdAt: string;
}

interface PaystackConfig {
  id: string;
  schoolId: string;
  publicKey: string;
  secretKey: string;
  webhookUrl: string;
  isActive: boolean;
  testMode: boolean;
  createdAt: string;
}

const FeesModule: React.FC = () => {
  const { school } = useSchool();
  const [fees, setFees] = useState<Fee[]>([]);
  const [paystackConfig, setPaystackConfig] = useState<PaystackConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [feeForm, setFeeForm] = useState({
    name: '',
    description: '',
    amount: 0,
    currency: 'NGN',
    dueDate: '',
    category: 'tuition',
    status: 'pending'
  });

  const [configForm, setConfigForm] = useState({
    publicKey: '',
    secretKey: '',
    webhookUrl: '',
    testMode: true,
    isActive: false
  });

  const categories = ['tuition', 'transport', 'uniform', 'books', 'sports', 'meals', 'exam', 'other'];

  useEffect(() => {
    fetchData();
  }, [school]);

  const fetchData = async () => {
    if (!school) return;

    setLoading(true);
    try {
      const [allFees, allConfigs] = await Promise.all([
        sdk.get<Fee>('fees'),
        sdk.get<PaystackConfig>('paystack_config')
      ]);

      const schoolFees = allFees.filter(fee => fee.schoolId === school.id);
      const schoolConfig = allConfigs.find(config => config.schoolId === school.id);

      setFees(schoolFees);
      setPaystackConfig(schoolConfig || null);

      if (schoolConfig) {
        setConfigForm({
          publicKey: schoolConfig.publicKey,
          secretKey: schoolConfig.secretKey,
          webhookUrl: schoolConfig.webhookUrl,
          testMode: schoolConfig.testMode,
          isActive: schoolConfig.isActive
        });
      }
    } catch (error) {
      console.error('Error fetching fees data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFee = async () => {
    if (!school) return;

    try {
      const newFee = await sdk.insert<Fee>('fees', {
        ...feeForm,
        schoolId: school.id,
        createdAt: new Date().toISOString()
      });
      setFees([...fees, newFee]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating fee:', error);
    }
  };

  const handleUpdateFee = async () => {
    if (!selectedFee) return;

    try {
      const updatedFee = await sdk.update<Fee>('fees', selectedFee.id, feeForm);
      setFees(fees.map(fee => 
        fee.id === selectedFee.id ? updatedFee : fee
      ));
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedFee(null);
    } catch (error) {
      console.error('Error updating fee:', error);
    }
  };

  const handleDeleteFee = async (feeId: string) => {
    try {
      await sdk.delete('fees', feeId);
      setFees(fees.filter(fee => fee.id !== feeId));
    } catch (error) {
      console.error('Error deleting fee:', error);
    }
  };

  const handleSaveConfig = async () => {
    if (!school) return;

    try {
      if (paystackConfig) {
        await sdk.update<PaystackConfig>('paystack_config', paystackConfig.id, configForm);
      } else {
        await sdk.insert<PaystackConfig>('paystack_config', {
          ...configForm,
          schoolId: school.id,
          createdAt: new Date().toISOString()
        });
      }
      await fetchData();
      setIsConfigDialogOpen(false);
    } catch (error) {
      console.error('Error saving Paystack config:', error);
    }
  };

  const resetForm = () => {
    setFeeForm({
      name: '',
      description: '',
      amount: 0,
      currency: 'NGN',
      dueDate: '',
      category: 'tuition',
      status: 'pending'
    });
  };

  const openEditDialog = (fee: Fee) => {
    setSelectedFee(fee);
    setFeeForm({
      name: fee.name,
      description: fee.description,
      amount: fee.amount,
      currency: fee.currency,
      dueDate: fee.dueDate,
      category: fee.category,
      status: fee.status
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fees Management</h2>
        <div className="flex space-x-2">
          <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Paystack Config
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Paystack Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Public Key</label>
                  <Input
                    value={configForm.publicKey}
                    onChange={(e) => setConfigForm({ ...configForm, publicKey: e.target.value })}
                    placeholder="pk_test_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secret Key</label>
                  <Input
                    type="password"
                    value={configForm.secretKey}
                    onChange={(e) => setConfigForm({ ...configForm, secretKey: e.target.value })}
                    placeholder="sk_test_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Webhook URL</label>
                  <Input
                    value={configForm.webhookUrl}
                    onChange={(e) => setConfigForm({ ...configForm, webhookUrl: e.target.value })}
                    placeholder="https://your-site.com/webhook"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={configForm.testMode}
                    onChange={(e) => setConfigForm({ ...configForm, testMode: e.target.checked })}
                  />
                  <label>Test Mode</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={configForm.isActive}
                    onChange={(e) => setConfigForm({ ...configForm, isActive: e.target.checked })}
                  />
                  <label>Active</label>
                </div>
                <Button onClick={handleSaveConfig}>Save Configuration</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setIsEditing(false); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                New Fee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Fee' : 'Create New Fee'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fee Name *</label>
                  <Input
                    value={feeForm.name}
                    onChange={(e) => setFeeForm({ ...feeForm, name: e.target.value })}
                    placeholder="Enter fee name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount *</label>
                    <Input
                      type="number"
                      value={feeForm.amount}
                      onChange={(e) => setFeeForm({ ...feeForm, amount: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <Select value={feeForm.currency} onValueChange={(value) => setFeeForm({ ...feeForm, currency: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">NGN</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select value={feeForm.category} onValueChange={(value) => setFeeForm({ ...feeForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <Input
                      type="date"
                      value={feeForm.dueDate}
                      onChange={(e) => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={feeForm.description}
                    onChange={(e) => setFeeForm({ ...feeForm, description: e.target.value })}
                    placeholder="Fee description"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={isEditing ? handleUpdateFee : handleCreateFee}>
                  {isEditing ? 'Update Fee' : 'Create Fee'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{fees.length}</div>
                <p className="text-xs text-muted-foreground">Total Fees</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{fees.filter(f => f.status === 'paid').length}</div>
            <p className="text-xs text-muted-foreground">Paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{fees.filter(f => f.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {fees.reduce((acc, f) => f.status === 'paid' ? acc + f.amount : acc, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total Collected</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fees.map((fee) => (
              <div key={fee.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{fee.name}</h3>
                      <Badge className={getStatusColor(fee.status)}>
                        {fee.status}
                      </Badge>
                      <Badge variant="outline">{fee.category}</Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{fee.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Amount:</span>
                        <span className="font-medium ml-1">{fee.currency} {fee.amount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Due Date:</span>
                        <span className="ml-1">{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'Not set'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <span className="ml-1">{new Date(fee.createdAt).toLocaleDateString()}</span>
                      </div>
                      {fee.paidAt && (
                        <div>
                          <span className="text-gray-500">Paid:</span>
                          <span className="ml-1">{new Date(fee.paidAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(fee)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteFee(fee.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {fees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No fees found. Create your first fee to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeesModule;
