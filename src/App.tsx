import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SchoolProvider } from "./contexts/SchoolContext";
import DynamicRedirect from "./components/auth/DynamicRedirect";
import SchoolLogin from "./pages/school/auth/SchoolLogin";
import SchoolRegister from "./pages/school/auth/SchoolRegister";

// Marketing Pages
import Home from "./pages/marketing/Home";
import Features from "./pages/marketing/Features";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Onboarding from "./pages/onboarding/Onboarding";
import NotFound from "./pages/NotFound";

// Platform Admin
import PlatformAdminDashboard from "./pages/platform/PlatformAdminDashboard";

// School Pages
import SchoolWebsite from "./pages/school/SchoolWebsite";
import SchoolAdminDashboard, { adminRoutes } from "./pages/school/admin/SchoolAdminDashboard";
import StudentDashboard from "./pages/school/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/school/dashboard/TeacherDashboard";
import ParentDashboard from "./pages/school/dashboard/ParentDashboard";
import StaffDashboard from "./pages/school/dashboard/StaffDashboard";
import Dashboard from "./pages/school/dashboard/Dashboard";
import BlogPostPage from "./pages/school/BlogPost";
import EventsPage from "./pages/school/EventsPage";
import EventPage from "./pages/school/EventPage";
import ClassesPage from "./pages/school/ClassesPage";
import ClassPage from "./pages/school/ClassPage";
import ProgramsPage from "./pages/school/ProgramsPage";
import ProgramPage from "./pages/school/ProgramPage";
import CoursesPage from "./pages/school/CoursesPage";
import CoursePage from "./pages/school/CoursePage";
import SubjectPage from "./pages/school/SubjectPage";
import LiveClassLobbyPage from "./pages/school/dashboard/LiveClassLobbyPage";
import AnnouncementsPage from "./pages/school/AnnouncementsPage";
import LibraryPage from "./pages/school/LibraryPage";
import BookPage from "./pages/school/BookPage";
import GalleryPage from "./pages/school/GalleryPage";
import ModernLiveClass from "./components/shared/ModernLiveClass";
import KnowledgebasePage from "./pages/school/KnowledgebasePage";
import ArticlePage from "./pages/school/ArticlePage";
import JobsPage from "./pages/school/JobsPage";
import JobPage from "./pages/school/JobPage";
import FaqPage from "./pages/school/FaqPage";
import AcademicCalendarPage from "./pages/school/AcademicCalendarPage";
import ProductsPage from "./pages/school/ProductsPage";
import ProductPage from "./pages/school/ProductPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SchoolProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Marketing Site Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Features />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding" element={<Onboarding />} />
                
                {/* Placeholder marketing routes */}
                <Route path="/pricing" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Pricing Page - Coming Soon</h1></div>} />
                <Route path="/about" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">About Page - Coming Soon</h1></div>} />
                <Route path="/blog" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Blog Page - Coming Soon</h1></div>} />
                <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Contact Page - Coming Soon</h1></div>} />
                
                {/* Platform Admin Routes */}
                <Route path="/platform-admin/*" element={<PlatformAdminDashboard />} />
                
                {/* School Authentication Routes */}
                <Route path="/:schoolSlug/login" element={<SchoolLogin />} />
                <Route path="/:schoolSlug/register" element={<SchoolRegister />} />
                
                {/* School Routes */}
                <Route path="/:schoolSlug" element={<SchoolWebsite />} />
                <Route path="/:schoolSlug/blog/:postSlug" element={<BlogPostPage />} />
                <Route path="/:schoolSlug/events" element={<EventsPage />} />
                <Route path="/:schoolSlug/events/:eventId" element={<EventPage />} />
                <Route path="/:schoolSlug/classes" element={<ClassesPage />} />
                <Route path="/:schoolSlug/classes/:classId" element={<ClassPage />} />
                <Route path="/:schoolSlug/programs" element={<ProgramsPage />} />
                <Route path="/:schoolSlug/programs/:programId" element={<ProgramPage />} />
                <Route path="/:schoolSlug/courses" element={<CoursesPage />} />
                <Route path="/:schoolSlug/courses/:courseId" element={<CoursePage />} />
                <Route path="/:schoolSlug/announcements" element={<AnnouncementsPage />} />
                <Route path="/:schoolSlug/library" element={<LibraryPage />} />
                <Route path="/:schoolSlug/library/:bookId" element={<BookPage />} />
                <Route path="/:schoolSlug/gallery" element={<GalleryPage />} />
                <Route path="/:schoolSlug/knowledgebase" element={<KnowledgebasePage />} />
                <Route path="/:schoolSlug/knowledgebase/:articleId" element={<ArticlePage />} />
                <Route path="/:schoolSlug/jobs" element={<JobsPage />} />
                <Route path="/:schoolSlug/jobs/:jobId" element={<JobPage />} />
                <Route path="/:schoolSlug/faq" element={<FaqPage />} />
                <Route path="/:schoolSlug/calendar" element={<AcademicCalendarPage />} />
                <Route path="/:schoolSlug/products" element={<ProductsPage />} />
                <Route path="/:schoolSlug/products/:productSlug" element={<ProductPage />} />
                <Route path="/:schoolSlug/:pageSlug" element={<SchoolWebsite />} />
                
                {/* Protected School Admin Routes */}
                <Route path="/:schoolSlug/admin" element={
                  <DynamicRedirect
                    requiredRoles={['school_admin', 'school_owner']}
                    requireSchoolOwnership={true}
                  >
                    <SchoolAdminDashboard />
                  </DynamicRedirect>
                }>
                  {adminRoutes}
                </Route>
                
                {/* Protected School Dashboard Routes */}
                {/* Protected School Dashboard Routes */}
                <Route path="/:schoolSlug/dashboard/*" element={<Dashboard />}>
                   <Route path="live-classes" element={<LiveClassLobbyPage />} />
                   <Route path="live-class/:roomId" element={<ModernLiveClass />} />
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SchoolProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
