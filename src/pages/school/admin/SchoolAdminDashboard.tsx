
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useUserManagement } from '@/hooks/useUserManagement';
import { usePages } from '@/hooks/usePages';
import { Users, FileText, Settings, Globe, BookOpen, Calendar } from 'lucide-react';

const SchoolAdminDashboard = () => {
  const { user } = useAuth();
  const { school } = useSchool();
  const { users, approveUser, suspendUser } = useUserManagement();
  const { pages } = usePages();
  const [activeTab, setActiveTab] = useState('overview');

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No School Found</h1>
          <p className="text-gray-600">You don't have access to any school admin dashboard.</p>
        </div>
      </div>
    );
  }

  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsers = users.filter(u => u.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{school.name} - Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName || user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{school.subscriptionPlan}</Badge>
              <Button onClick={() => window.open(`/${school.slug}`, '_blank')}>
                <Globe className="w-4 h-4 mr-2" />
                View Website
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="site-editor">Site Editor</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {pendingUsers.length} pending approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Website Pages</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pages.length}</div>
                  <p className="text-xs text-muted-foreground">Published pages</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{school.subscriptionPlan}</div>
                  <p className="text-xs text-muted-foreground">{school.subscriptionStatus}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Button size="sm" className="w-full" onClick={() => setActiveTab('site-editor')}>
                    Edit Website
                  </Button>
                </CardContent>
              </Card>
            </div>

            {pendingUsers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending User Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{user.firstName} {user.lastName}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <Badge variant="outline" className="mt-1">{user.userType}</Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => approveUser(user.id!)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => suspendUser(user.id!)}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{user.firstName} {user.lastName}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex space-x-2 mt-1">
                          <Badge variant="outline">{user.userType}</Badge>
                          <Badge variant={user.status === 'approved' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {user.status === 'pending' && (
                          <Button size="sm" onClick={() => approveUser(user.id!)}>
                            Approve
                          </Button>
                        )}
                        {user.status === 'approved' && (
                          <Button size="sm" variant="outline" onClick={() => suspendUser(user.id!)}>
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

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    Blog Posts
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col">
                    <Calendar className="w-6 h-6 mb-2" />
                    Events
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col">
                    <BookOpen className="w-6 h-6 mb-2" />
                    Programs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules">
            <Card>
              <CardHeader>
                <CardTitle>Available Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Admissions</h3>
                    <p className="text-sm text-gray-600 mt-1">Manage student applications</p>
                    <Badge className="mt-2">Active</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Classes</h3>
                    <p className="text-sm text-gray-600 mt-1">Manage class schedules</p>
                    <Badge className="mt-2">Active</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Programs</h3>
                    <p className="text-sm text-gray-600 mt-1">Academic programs</p>
                    <Badge className="mt-2">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="site-editor">
            <Card>
              <CardHeader>
                <CardTitle>Website Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">Edit your school's public website pages and content.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pages.map((page) => (
                      <div key={page.id} className="p-4 border rounded-lg">
                        <h3 className="font-medium">{page.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">/{page.slug}</p>
                        <Button size="sm" className="mt-2">Edit Page</Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>School Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">School Name</label>
                        <p className="font-medium">{school.name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">URL Slug</label>
                        <p className="font-medium">/{school.slug}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <p className="font-medium">{school.email || 'Not set'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Phone</label>
                        <p className="font-medium">{school.phone || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;
