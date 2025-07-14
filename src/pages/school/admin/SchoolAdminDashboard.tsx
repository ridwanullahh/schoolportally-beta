import React, { useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
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
  ShoppingCart
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
}

const sidebarItems: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'site-editor', label: 'Site Editor', icon: Edit },
  { id: 'ecommerce', label: 'Store', icon: ShoppingCart },
  { id: 'admissions', label: 'Admissions', icon: Users },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'programs', label: 'Programs', icon: BookOpen },
  { id: 'classes', label: 'Classes', icon: Users },
  { id: 'calendar', label: 'Academic Calendar', icon: Calendar },
  { id: 'results', label: 'Results', icon: Award },
  { id: 'fees', label: 'Fees', icon: DollarSign },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'gallery', label: 'Gallery', icon: Camera },
  { id: 'elibrary', label: 'E-Library', icon: Library },
  { id: 'lms', label: 'LMS', icon: BookOpen },
  { id: 'forms', label: 'Forms', icon: FileText },
  { id: 'wiki', label: 'Knowledge Base', icon: Book },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'support', label: 'Support', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
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
    <Route path="settings" element={<BrandingModule />} />
  </>
);

const SchoolAdminDashboard = () => {
    const { school } = useSchool();
    const { user, loading } = useAuth();
    const location = useLocation();
    const activePath = location.pathname.split('/').pop() || 'overview';
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div>Loading...</div>
            </div>
        );
    }

    const isAdmin = user?.roles?.includes('school_admin') || user?.roles?.includes('school_owner');

    if (!isAdmin) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                    <p>You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
                <div className="px-6 mb-8">
                    <CardTitle className="text-lg font-semibold">{school?.name} Admin</CardTitle>
                    <CardContent className="text-sm text-gray-500 p-0">Manage your school</CardContent>
                </div>
                <div className="space-y-1 px-3">
                    {sidebarItems.map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            className={`w-full justify-start ${activePath === item.id ? 'bg-gray-100' : ''}`}
                            asChild
                        >
                            <Link to={item.id}>
                                <item.icon className="w-4 h-4 mr-2" />
                                {isSidebarOpen && item.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </Sidebar>

            <div className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default SchoolAdminDashboard;
