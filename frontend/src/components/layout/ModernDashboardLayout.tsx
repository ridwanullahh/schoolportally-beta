import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ModernSidebar } from '@/components/ui/modern-sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell, Search, Menu, X, Settings, HelpCircle, 
  Sun, Moon, Maximize2, Minimize2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  badge?: string | number;
  children?: SidebarItem[];
}

interface ModernDashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  allowedRoles: string[];
  title?: string;
  subtitle?: string;
}

export const ModernDashboardLayout: React.FC<ModernDashboardLayoutProps> = ({
  children,
  sidebarItems,
  allowedRoles,
  title,
  subtitle
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications] = useState(3); // Mock notification count
  
  const { user, loading } = useAuth();
  const { school } = useSchool();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const hasAccess = user && allowedRoles.some(role => 
    user.roles?.includes(role) || user.role === role
  );

  if (!hasAccess) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You do not have permission to view this dashboard.
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getCurrentPageTitle = () => {
    if (title) return title;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    return lastSegment
      ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ')
      : 'Dashboard';
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className={cn(
      "flex h-screen bg-gray-50 transition-colors duration-200",
      isDarkMode && "dark bg-gray-900"
    )}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <ModernSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          items={sidebarItems}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-72 bg-white">
            <ModernSidebar
              isOpen={true}
              setIsOpen={() => setIsMobileMenuOpen(false)}
              items={sidebarItems}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Page Title */}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {getCurrentPageTitle()}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-500">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="hidden sm:flex"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Fullscreen Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="hidden sm:flex"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>

              {/* Help */}
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
              </Button>

              {/* User Avatar */}
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              © 2024 {school?.name || 'SchoolPortal'}. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <span>Version 2.0.0</span>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ModernDashboardLayout;
