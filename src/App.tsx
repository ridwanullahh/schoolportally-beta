
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Marketing Pages
import Home from "./pages/marketing/Home";
import Features from "./pages/marketing/Features";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Onboarding from "./pages/onboarding/Onboarding";
import NotFound from "./pages/NotFound";

// Routing utilities
import { isMarketingRoute, isPlatformAdminRoute, isSchoolRoute } from "./utils/routing";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
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
              
              {/* Placeholder routes for development */}
              <Route path="/pricing" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Pricing Page - Coming Soon</h1></div>} />
              <Route path="/about" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">About Page - Coming Soon</h1></div>} />
              <Route path="/blog" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Blog Page - Coming Soon</h1></div>} />
              <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Contact Page - Coming Soon</h1></div>} />
              
              {/* Platform Admin Routes - Coming Soon */}
              <Route path="/platform-admin/*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Platform Admin - Coming Soon</h1></div>} />
              
              {/* School Routes - Coming Soon */}
              <Route path="/:schoolSlug" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">School Website - Coming Soon</h1></div>} />
              <Route path="/:schoolSlug/dashboard/*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">School Dashboard - Coming Soon</h1></div>} />
              <Route path="/:schoolSlug/admin/*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">School Admin - Coming Soon</h1></div>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
