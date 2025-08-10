import React, { useState } from 'react';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { Route, Link, useLocation, Outlet } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Megaphone,
  Edit,
  Book,
  Calendar,
  Library,
  Award,
  MessageSquare,
  DollarSign,
  Camera,
  Briefcase,
  ShoppingCart,
  Video
} from 'lucide-react';

// Import all modules including the new ones
import UsersModule from '@/components/admin/UsersModule';
import SiteEditor from '@/components/admin/SiteEditor';
import AdmissionsModule from '@/components/admin/AdmissionsModule';
import ProgramsModule from '@/components/admin/ProgramsModule';
import ClassesModule from '@/components/admin/ClassesModule';
import BlogModule from '@/components/admin/BlogModule';
import FAQModule from '@/components/admin/FAQModule';
import AnnouncementsModule from '@/components/admin/AnnouncementsModule';
import LMSModule from '@/components/admin/LMSModule';
import FormsModule from '@/components/admin/FormsModule';
import WikiModule from '@/components/admin/WikiModule';
import FeesModule from '@/components/admin/FeesModule';
import EventsModule from '@/components/admin/EventsModule';
import GalleryModule from '@/components/admin/GalleryModule';
import JobsModule from '@/components/admin/JobsModule';
import SupportModule from '@/components/admin/SupportModule';
import CalendarModule from '@/components/admin/CalendarModule';
import ELibraryModule from '@/components/admin/ELibraryModule';
import ResultsModule from '@/components/admin/ResultsModule';
import MessagesModule from '@/components/admin/MessagesModule';
import EcommerceModule from '@/components/admin/EcommerceModule';
import BrandingModule from '@/components/admin/BrandingModule';
import SessionsPage from './SessionsPage';
import TermsPage from './TermsPage';
import SubjectsPage from './SubjectsPage';
import LiveClassSchedulePage from './LiveClassSchedulePage';
import PaymentSettingsPage from './PaymentSettingsPage';
import SystemIntegrationTest from '@/components/admin/SystemIntegrationTest';
import ComponentTest from '@/pages/test/ComponentTest';

// Overview Module Component
const OverviewModule = () => {
  const { school } = useSchool();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No students enrolled yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Create your first program</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Set up your first class</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Admin account active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-gray-500">
              No recent activity to display.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Add New Student
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Create Program
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Write Blog Post
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Megaphone className="w-4 h-4 mr-2" />
              Make Announcement
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  href?: string;
}

const sidebarItems: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: 'overview' },
  { id: 'site-editor', label: 'Site Editor', icon: Edit, href: 'site-editor' },
  { id: 'ecommerce', label: 'Store', icon: ShoppingCart, href: 'ecommerce' },
  { id: 'admissions', label: 'Admissions', icon: Users, href: 'admissions' },
  { id: 'users', label: 'Users', icon: Users, href: 'users' },
  { id: 'programs', label: 'Programs', icon: BookOpen, href: 'programs' },
  { id: 'classes', label: 'Classes', icon: Users, href: 'classes' },
  { id: 'sessions', label: 'Sessions', icon: Calendar, href: 'sessions' },
  { id: 'terms', label: 'Terms', icon: Calendar, href: 'terms' },
  { id: 'subjects', label: 'Subjects', icon: BookOpen, href: 'subjects' },
  { id: 'live-class-schedule', label: 'Live Classes', icon: Video, href: 'live-class-schedule' },
  { id: 'calendar', label: 'Academic Calendar', icon: Calendar, href: 'calendar' },
  { id: 'results', label: 'Results', icon: Award, href: 'results' },
  { id: 'fees', label: 'Fees', icon: DollarSign, href: 'fees' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, href: 'messages' },
  { id: 'blog', label: 'Blog', icon: FileText, href: 'blog' },
  { id: 'announcements', label: 'Announcements', icon: Megaphone, href: 'announcements' },
  { id: 'events', label: 'Events', icon: Calendar, href: 'events' },
  { id: 'gallery', label: 'Gallery', icon: Camera, href: 'gallery' },
  { id: 'elibrary', label: 'E-Library', icon: Library, href: 'elibrary' },
  { id: 'lms', label: 'LMS', icon: BookOpen, href: 'lms' },
  { id: 'forms', label: 'Forms', icon: FileText, href: 'forms' },
  { id: 'wiki', label: 'Knowledge Base', icon: Book, href: 'wiki' },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, href: 'jobs' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, href: 'faq' },
  { id: 'support', label: 'Support', icon: BookOpen, href: 'support' },
  { id: 'payment-settings', label: 'Payment Settings', icon: DollarSign, href: 'payment-settings' },
  { id: 'integration-test', label: 'Integration Test', icon: Settings, href: 'integration-test' },
  { id: 'component-test', label: 'Component Test', icon: Settings, href: 'component-test' },
  { id: 'settings', label: 'Settings', icon: Settings, href: 'settings' },
];

export const adminRoutes = (
  <>
    <Route index element={<OverviewModule />} />
    <Route path="overview" element={<OverviewModule />} />
    <Route path="site-editor" element={<SiteEditor />} />
    <Route path="ecommerce" element={<EcommerceModule />} />
    <Route path="admissions" element={<AdmissionsModule />} />
    <Route path="users" element={<UsersModule />} />
    <Route path="programs" element={<ProgramsModule />} />
    <Route path="classes" element={<ClassesModule />} />
    <Route path="sessions" element={<SessionsPage />} />
    <Route path="terms" element={<TermsPage />} />
    <Route path="subjects" element={<SubjectsPage />} />
    <Route path="live-class-schedule" element={<LiveClassSchedulePage />} />
    <Route path="calendar" element={<CalendarModule />} />
    <Route path="results" element={<ResultsModule />} />
    <Route path="fees" element={<FeesModule />} />
    <Route path="messages" element={<MessagesModule />} />
    <Route path="blog" element={<BlogModule />} />
    <Route path="faq" element={<FAQModule />} />
    <Route path="announcements" element={<AnnouncementsModule />} />
    <Route path="lms" element={<LMSModule />} />
    <Route path="forms" element={<FormsModule />} />
    <Route path="wiki" element={<WikiModule />} />
    <Route path="events" element={<EventsModule />} />
    <Route path="gallery" element={<GalleryModule />} />
    <Route path="elibrary" element={<ELibraryModule />} />
    <Route path="jobs" element={<JobsModule />} />
    <Route path="support" element={<SupportModule />} />
    <Route path="payment-settings" element={<PaymentSettingsPage />} />
    <Route path="integration-test" element={<SystemIntegrationTest />} />
    <Route path="component-test" element={<ComponentTest />} />
    <Route path="settings" element={<BrandingModule />} />
  </>
  );

const SchoolAdminDashboard = () => {
    const { school } = useSchool();
    const { user, loading } = useAuth();

    return (
        <ModernDashboardLayout
            sidebarItems={sidebarItems}
            allowedRoles={['school_admin', 'school_owner', 'admin', 'super_admin']}
            title="Admin Dashboard"
            subtitle={`Manage ${school?.name || 'your school'}`}
        >
            <Outlet />
        </ModernDashboardLayout>
    );
};

export default SchoolAdminDashboard;
