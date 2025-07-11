
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requireSchoolOwnership?: boolean;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requireSchoolOwnership = false,
  fallbackPath
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const { school } = useSchool();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to access this area.</p>
            <Button 
              onClick={() => window.location.href = fallbackPath || '/login'}
              className="w-full"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check for user verification and approval status
  if (user && (!user.verified || user.status !== 'approved')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              Your account is not yet verified or approved. Please contact an administrator.
            </p>
            <Button
              onClick={() => window.history.back()}
              className="w-full"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => user?.roles?.includes(role));
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardContent className="text-center p-6">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-6">You don't have permission to access this area.</p>
              <Button
                onClick={() => window.history.back()}
                className="w-full"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Check school ownership
  if (requireSchoolOwnership && school) {
    if (user?.id !== school.ownerId && !user?.roles?.includes('school_admin')) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardContent className="text-center p-6">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-6">You don't have administrative access to this school.</p>
              <Button 
                onClick={() => window.history.back()}
                className="w-full"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
