
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { getSchoolSlug } from '@/utils/routing';

interface School {
  id: string;
  uid?: string;
  name: string;
  slug: string;
  ownerId: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone: string;
  currency: string;
  status: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  onboardingCompleted?: boolean;
  branding?: any;
  createdAt?: string;
  updatedAt?: string;
}

interface SchoolContextType {
  school: School | null;
  loading: boolean;
  error: string | null;
  updateSchool: (updates: Partial<School>) => Promise<School | null>;
  createSchool: (schoolData: Omit<School, 'id'>) => Promise<School | null>;
  hasSchool: boolean;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};

interface SchoolProviderProps {
  children: ReactNode;
}

export const SchoolProvider: React.FC<SchoolProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchool = async () => {
      setLoading(true);
      setError(null);

      try {
        const schoolSlug = getSchoolSlug();
        
        if (schoolSlug) {
          console.log('Fetching school by slug:', schoolSlug);
          const schools = await sdk.get<School>('schools');
          const schoolData = schools.find(s => s.slug === schoolSlug);
          
          if (schoolData) {
            setSchool(schoolData);
            console.log('School found by slug:', schoolData);
          } else {
            console.log('No school found with slug:', schoolSlug);
            setSchool(null);
          }
        } else if (isAuthenticated && user?.schoolId) {
          console.log('Fetching school by user schoolId:', user.schoolId);
          const schools = await sdk.get<School>('schools');
          const schoolData = schools.find(s => s.id === user.schoolId);
          
          if (schoolData) {
            setSchool(schoolData);
            console.log('School found by user:', schoolData);
          } else {
            console.log('No school found for user');
            setSchool(null);
          }
        } else {
          setSchool(null);
        }
      } catch (err) {
        console.error('Failed to fetch school:', err);
        setError('Failed to load school data');
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [isAuthenticated, user?.schoolId, window.location.pathname]);

  const updateSchool = async (updates: Partial<School>) => {
    if (!school) return null;

    try {
      const updatedSchool = await sdk.update<School>('schools', school.id, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      setSchool(updatedSchool);
      return updatedSchool;
    } catch (err) {
      console.error('Failed to update school:', err);
      throw err;
    }
  };

  const createSchool = async (schoolData: Omit<School, 'id'>) => {
    try {
      const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
      };

      const newSchool = await sdk.insert<School>('schools', {
        id: generateUniqueId(),
        uid: generateUniqueId(),
        ...schoolData,
        ownerId: user?.id || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Update user with schoolId
      if (user && user.id) {
        await sdk.update('users', user.id, { schoolId: newSchool.id });
      }
      
      setSchool(newSchool);
      return newSchool;
    } catch (err) {
      console.error('Failed to create school:', err);
      throw err;
    }
  };

  const value: SchoolContextType = {
    school,
    loading,
    error,
    updateSchool,
    createSchool,
    hasSchool: !!school,
  };

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
};
