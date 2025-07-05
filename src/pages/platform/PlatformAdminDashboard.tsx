
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { School, User } from '@/types';
import sdk from '@/lib/sdk-config';
import { Building, Users, DollarSign, Settings } from 'lucide-react';

const PlatformAdminDashboard = () => {
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolsData, usersData] = await Promise.all([
          sdk.get<School>('schools'),
          sdk.get<User>('users')
        ]);
        setSchools(schoolsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch platform data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const approveSchool = async (schoolId: string) => {
    try {
      await sdk.update<School>('schools', schoolId, { status: 'active' });
      setSchools(schools.map(s => s.id === schoolId ? { ...s, status: 'active' } : s));
    } catch (error) {
      console.error('Failed to approve school:', error);
    }
  };

  const suspendSchool = async (schoolId: string) => {
    try {
      await sdk.update<School>('schools', schoolId, { status: 'suspended' });
      setSchools(schools.map(s => s.id === schoolId ? { ...s, status: 'suspended' } : s));
    } catch (error) {
      console.error('Failed to suspend school:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading platform data...</p>
        </div>
      </div>
    );
  }

  const activeSchools = schools.filter(s => s.status === 'active');
  const pendingSchools = schools.filter(s => s.status === 'pending');
  const totalRevenue = activeSchools.length * 50; // Placeholder calculation

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Platform Admin Dashboard</h1>
              <p className="text-gray-600">Manage SchoolPortal platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Platform Admin</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schools.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeSchools.length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">Across all schools</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue}</div>
              <p className="text-xs text-muted-foreground">From subscriptions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingSchools.length}</div>
              <p className="text-xs text-muted-foreground">Schools awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schools" className="space-y-6">
          <TabsList>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="schools">
            <Card>
              <CardHeader>
                <CardTitle>School Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schools.map((school) => (
                    <div key={school.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{school.name}</h4>
                        <p className="text-sm text-gray-600">/{school.slug}</p>
                        <div className="flex space-x-2 mt-1">
                          <Badge variant="outline">{school.subscriptionPlan}</Badge>
                          <Badge variant={school.status === 'active' ? 'default' : 'secondary'}>
                            {school.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(`/${school.slug}`, '_blank')}
                        >
                          View
                        </Button>
                        {school.status === 'pending' && (
                          <Button size="sm" onClick={() => approveSchool(school.id)}>
                            Approve
                          </Button>
                        )}
                        {school.status === 'active' && (
                          <Button size="sm" variant="destructive" onClick={() => suspendSchool(school.id)}>
                            Suspend
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 10).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{user.firstName} {user.lastName}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <Badge variant="outline" className="mt-1">{user.userType}</Badge>
                      </div>
                      <div>
                        <Badge variant={user.status === 'approved' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-800">Active Subscriptions</h3>
                      <p className="text-2xl font-bold text-green-900">{activeSchools.length}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-800">Monthly Revenue</h3>
                      <p className="text-2xl font-bold text-blue-900">${totalRevenue}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">System Configuration</h3>
                    <p className="text-sm text-gray-600">Configure platform-wide settings and integrations.</p>
                  </div>
                  <Button variant="outline">Configure Integrations</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlatformAdminDashboard;
