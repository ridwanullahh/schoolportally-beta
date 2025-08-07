import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LMSDashboard } from '@/components/lms/LMSDashboard';

const LMSModule = () => {
  const { user } = useAuth();
  
  // Determine user role for LMS dashboard
  const getUserRole = (): 'teacher' | 'student' | 'admin' => {
    if (!user) return 'student';
    
    if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'school_admin' || user.role === 'school_owner') {
      return 'admin';
    }
    if (user.role === 'teacher') return 'teacher';
    return 'student';
  };

  return <LMSDashboard userRole={getUserRole()} />;
};

export default LMSModule;
