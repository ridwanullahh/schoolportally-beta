import React from 'react';
import { useParams } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

interface DynamicRedirectProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requireSchoolOwnership?: boolean;
}

const DynamicRedirect: React.FC<DynamicRedirectProps> = ({ children, requiredRoles, requireSchoolOwnership }) => {
  const { schoolSlug } = useParams<{ schoolSlug: string }>();
  const fallbackPath = schoolSlug ? `/${schoolSlug}/login` : '/login';

  return (
    <ProtectedRoute
      requiredRoles={requiredRoles}
      requireSchoolOwnership={requireSchoolOwnership}
      fallbackPath={fallbackPath}
    >
      {children}
    </ProtectedRoute>
  );
};

export default DynamicRedirect;