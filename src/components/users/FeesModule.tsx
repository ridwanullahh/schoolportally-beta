import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';

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

const FeesModule: React.FC = () => {
  const { school } = useSchool();
  const { user } = useAuth();
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [school, user]);

  const fetchData = async () => {
    if (!school || !user) return;

    setLoading(true);
    try {
      const allFees = await sdk.get<Fee>('fees');
      let userFees = [];

      if (user.userType === 'student') {
        userFees = allFees.filter(fee => fee.schoolId === school.id && fee.studentId === user.id);
      } else if (user.userType === 'parent') {
        // This assumes that a parent has a list of their children's IDs
        // You may need to fetch this list first
        // For now, we'll assume the user object has a `children` array
        const childrenIds = user.children || [];
        userFees = allFees.filter(fee => fee.schoolId === school.id && childrenIds.includes(fee.studentId));
      }
      
      setFees(userFees);
    } catch (error) {
      console.error('Error fetching fees data:', error);
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-2xl font-bold">My Fees</h2>
      </div>

      {fees.length === 0 ? (
         <div className="text-center py-8 text-gray-500">
           You have no outstanding fees.
         </div>
      ) : (
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
                        {fee.paidAt && (
                          <div>
                            <span className="text-gray-500">Paid:</span>
                            <span className="ml-1">{new Date(fee.paidAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {fee.status !== 'paid' && (
                        <Button>Pay Now</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FeesModule;