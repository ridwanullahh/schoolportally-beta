
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Settings, 
  Calendar,
  MessageCircle,
  BarChart3,
  Layout,
  User,
  Mail,
  HelpCircle
} from 'lucide-react';

// Import admin modules
import SiteEditor from '@/components/admin/SiteEditor';
import AdmissionsModule from '@/components/admin/AdmissionsModule';
import ProgramsModule from '@/components/admin/ProgramsModule';
import ClassesModule from '@/components/admin/ClassesModule';
import BlogModule from '@/components/admin/BlogModule';
import FAQModule from '@/components/admin/FAQModule';
import AnnouncementsModule from '@/components/admin/AnnouncementsModule';

const SchoolAdminDashboard = () => {
  const { school, loading } = useSchool();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this school's admin dashboard.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { name: 'Total Students', value: '2,543', icon: Users, change: '+12%' },
    { name: 'Active Programs', value: '24', icon: BookOpen, change: '+3%' },
    { name: 'Faculty Members', value: '186', icon: GraduationCap, change: '+5%' },
    { name: 'Pending Applications', value: '42', icon: FileText, change: '+8%' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">{school.name}</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9 h-auto p-1">
            <TabsTrigger value="overview" className="flex items-center space-x-2 py-3">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="site-editor" className="flex items-center space-x-2 py-3">
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">Site Editor</span>
            </TabsTrigger>
            <TabsTrigger value="admissions" className="flex items-center space-x-2 py-3">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Admissions</span>
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center space-x-2 py-3">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Programs</span>
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center space-x-2 py-3">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Classes</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center space-x-2 py-3">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center space-x-2 py-3">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Announcements</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center space-x-2 py-3">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2 py-3">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change} from last month</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => setActiveTab('admissions')}>
                    <User className="w-6 h-6" />
                    <span>Review Applications</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => setActiveTab('site-editor')}>
                    <Layout className="w-6 h-6" />
                    <span>Edit Website</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => setActiveTab('announcements')}>
                    <Mail className="w-6 h-6" />
                    <span>Send Announcement</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => setActiveTab('blog')}>
                    <FileText className="w-6 h-6" />
                    <span>Write Blog Post</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Student Name {i}</p>
                          <p className="text-sm text-gray-600">Applied for Grade 9</p>
                        </div>
                        <Button size="sm" variant="outline">Review</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Event Name {i}</p>
                          <p className="text-sm text-gray-600">Tomorrow at 10:00 AM</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="site-editor">
            <SiteEditor />
          </TabsContent>

          <TabsContent value="admissions">
            <AdmissionsModule />
          </TabsContent>

          <TabsContent value="programs">
            <ProgramsModule />
          </TabsContent>

          <TabsContent value="classes">
            <ClassesModule />
          </TabsContent>

          <TabsContent value="blog">
            <BlogModule />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsModule />
          </TabsContent>

          <TabsContent value="faq">
            <FAQModule />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>School Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">General Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">School Name</label>
                        <input 
                          type="text" 
                          value={school.name} 
                          className="w-full px-3 py-2 border rounded-lg"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input 
                          type="email" 
                          value={school.email || ''} 
                          className="w-full px-3 py-2 border rounded-lg"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Branding</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Primary Color</label>
                        <input 
                          type="color" 
                          value={school.branding?.primaryColor || '#4f46e5'} 
                          className="w-full h-10 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Secondary Color</label>
                        <input 
                          type="color" 
                          value={school.branding?.secondaryColor || '#06b6d4'} 
                          className="w-full h-10 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button>Save Settings</Button>
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
