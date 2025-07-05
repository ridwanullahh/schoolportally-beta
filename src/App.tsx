
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SchoolProvider } from "./contexts/SchoolContext";

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
import SchoolAdminDashboard from "./pages/school/admin/SchoolAdminDashboard";
import StudentDashboard from "./pages/school/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/school/dashboard/TeacherDashboard";
import ParentDashboard from "./pages/school/dashboard/ParentDashboard";

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
                
                {/* School Routes */}
                <Route path="/:schoolSlug" element={<SchoolWebsite />} />
                <Route path="/:schoolSlug/:pageSlug" element={<SchoolWebsite />} />
                <Route path="/:schoolSlug/admin/*" element={<SchoolAdminDashboard />} />
                <Route path="/:schoolSlug/dashboard/*" element={<StudentDashboard />} />
                
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
