
import React, { useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  Settings, 
  GraduationCap,
  Image,
  MessageSquare,
  DollarSign,
  BarChart3,
  Globe,
  Palette,
  UserCheck,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import all admin modules
import LMSModule from '@/components/admin/LMSModule';
import UserManagementModule from '@/components/admin/UserManagementModule';
import EnhancedSiteEditor from '@/components/admin/EnhancedSiteEditor';
import AdmissionsModule from '@/components/admin/AdmissionsModule';
import ProgramsModule from '@/components/admin/ProgramsModule';
import ClassesModule from '@/components/admin/ClassesModule';
import BlogModule from '@/components/admin/BlogModule';
import EventsModule from '@/components/admin/EventsModule';
import GalleryModule from '@/components/admin/GalleryModule';
import AnnouncementsModule from '@/components/admin/AnnouncementsModule';
import FAQModule from '@/components/admin/FAQModule';
import FormsModule from '@/components/admin/FormsModule';
import CalendarModule from '@/components/admin/CalendarModule';
import ELibraryModule from '@/components/admin/ELibraryModule';
import FeesModule from '@/components/admin/FeesModule';
import ResultsModule from '@/components/admin/ResultsModule';
import JobsModule from '@/components/admin/JobsModule';
import MessagesModule from '@/components/admin/MessagesModule';
import SupportModule from '@/components/admin/SupportModule';
import WikiModule from '@/components/admin/WikiModule';

const SchoolAdminDashboard = () => {
  const { schoolSlug } = useParams();
  const { user, logout } = useAuth();
  const { school } = useSchool();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = `/${schoolSlug}/login`;
  };

  const menuItems = [
    { name: 'Dashboard', path: '', icon: LayoutDashboard },
    { name: 'Users', path: 'users', icon: UserCheck },
    { name: 'Site Editor', path: 'site-editor', icon: Globe },
    { name: 'LMS Courses', path: 'lms', icon: BookOpen },
    { name: 'Admissions', path: 'admissions', icon: GraduationCap },
    { name: 'Programs', path: 'programs', icon: BookOpen },
    { name: 'Classes', path: 'classes', icon: Users },
    { name: 'Events', path: 'events', icon: Calendar },
    { name: 'Blog', path: 'blog', icon: FileText },
    { name: 'Gallery', path: 'gallery', icon: Image },
    { name: 'Announcements', path: 'announcements', icon: MessageSquare },
    { name: 'FAQ', path: 'faq', icon: FileText },
    { name: 'Forms', path: 'forms', icon: FileText },
    { name: 'Calendar', path: 'calendar', icon: Calendar },
    { name: 'E-Library', path: 'elibrary', icon: BookOpen },
    { name: 'Fees', path: 'fees', icon: DollarSign },
    { name: 'Results', path: 'results', icon: BarChart3 },
    { name: 'Jobs', path: 'jobs', icon: Users },
    { name: 'Messages', path: 'messages', icon: MessageSquare },
    { name: 'Support', path: 'support', icon: Settings },
    { name: 'Wiki', path: 'wiki', icon: FileText },
  ];

  const DashboardOverview = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to {school?.name} Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your school's digital presence and operations from here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">245</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Events</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-red-500 p-3 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">34</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Globe className="h-6 w-6 mb-2" />
                Edit Website
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <BookOpen className="h-6 w-6 mb-2" />
                Add Course
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                Create Event
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm">New user registration: John Doe</p>
                <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm">Course published: Advanced Mathematics</p>
                <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <p className="text-sm">Event created: Science Fair 2024</p>
                <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

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
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                window.location.href = `/${schoolSlug}/admin/${item.path}`;
                setSidebarOpen(false);
              }}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.name}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">Administrator</p>
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
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-4 ml-auto">
              <Button
                variant="outline"
                onClick={() => window.open(`/${schoolSlug}`, '_blank')}
              >
                <Globe className="w-4 h-4 mr-2" />
                View Website
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/users" element={<UserManagementModule />} />
            <Route path="/site-editor" element={<EnhancedSiteEditor />} />
            <Route path="/lms" element={<LMSModule />} />
            <Route path="/admissions" element={<AdmissionsModule />} />
            <Route path="/programs" element={<ProgramsModule />} />
            <Route path="/classes" element={<ClassesModule />} />
            <Route path="/events" element={<EventsModule />} />
            <Route path="/blog" element={<BlogModule />} />
            <Route path="/gallery" element={<GalleryModule />} />
            <Route path="/announcements" element={<AnnouncementsModule />} />
            <Route path="/faq" element={<FAQModule />} />
            <Route path="/forms" element={<FormsModule />} />
            <Route path="/calendar" element={<CalendarModule />} />
            <Route path="/elibrary" element={<ELibraryModule />} />
            <Route path="/fees" element={<FeesModule />} />
            <Route path="/results" element={<ResultsModule />} />
            <Route path="/jobs" element={<JobsModule />} />
            <Route path="/messages" element={<MessagesModule />} />
            <Route path="/support" element={<SupportModule />} />
            <Route path="/wiki" element={<WikiModule />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;
