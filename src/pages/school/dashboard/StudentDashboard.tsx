
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { Book, Calendar, Bell, FileText, Users, Clock, Menu, X, LogOut } from 'lucide-react';
import TeacherDashboard from './TeacherDashboard';
import ParentDashboard from './ParentDashboard';
import sdk from '@/lib/sdk-config';

const StudentDashboard = () => {
  const { schoolSlug } = useParams();
  const { user, logout } = useAuth();
  const { school } = useSchool();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    announcements: [],
    assignments: [],
    events: []
  });

  useEffect(() => {
    if (school && user) {
      fetchDashboardData();
    }
  }, [school, user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch real data from SDK
      const [courses, announcements, events] = await Promise.all([
        sdk.get('lms_courses'),
        sdk.get('announcements'),
        sdk.get('events')
      ]);

      setDashboardData({
        courses: courses.filter((c: any) => c.schoolId === school?.id && c.publishStatus === 'published'),
        announcements: announcements.filter((a: any) => a.schoolId === school?.id && a.status === 'published').slice(0, 3),
        assignments: [], // Will be implemented with assignments module
        events: events.filter((e: any) => e.schoolId === school?.id && e.status === 'published').slice(0, 3)
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = `/${schoolSlug}/login`;
  };

  // Route to appropriate dashboard based on user role
  if (user?.roles?.includes('teacher')) {
    return <TeacherDashboard />;
  }
  
  if (user?.roles?.includes('parent')) {
    return <ParentDashboard />;
  }

  const quickStats = [
    { title: 'Enrolled Courses', value: dashboardData.courses.length.toString(), icon: Book, color: 'bg-blue-500' },
    { title: 'Upcoming Events', value: dashboardData.events.length.toString(), icon: Calendar, color: 'bg-green-500' },
    { title: 'New Announcements', value: dashboardData.announcements.length.toString(), icon: Bell, color: 'bg-yellow-500' },
    { title: 'Assignments Due', value: '0', icon: FileText, color: 'bg-red-500' },
  ];

  const sidebarItems = [
    { name: 'Dashboard', icon: Book, active: true },
    { name: 'My Courses', icon: Book },
    { name: 'Assignments', icon: FileText },
    { name: 'Calendar', icon: Calendar },
    { name: 'Messages', icon: Bell },
    { name: 'Profile', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-lg font-semibold">{school?.name}</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.name}
              variant={item.active ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.name}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.userType}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <p className="text-gray-600">Here's what's happening at {school?.name} today.</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    My Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.courses.length > 0 ? (
                      dashboardData.courses.slice(0, 3).map((course: any) => (
                        <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-semibold">{course.title}</h4>
                            <p className="text-sm text-gray-600">{course.description}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Continue
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No courses enrolled yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Announcements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.announcements.length > 0 ? (
                      dashboardData.announcements.map((announcement: any) => (
                        <div key={announcement.id} className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900">{announcement.title}</h4>
                          <p className="text-sm text-blue-700 mt-1">{announcement.content}</p>
                          <p className="text-xs text-blue-600 mt-2">
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No announcements yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.events.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardData.events.map((event: any) => (
                      <div key={event.id} className="p-4 border rounded-lg">
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <p className="text-sm text-blue-600 mt-2">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No upcoming events.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
