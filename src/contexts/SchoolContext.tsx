
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { School, SchoolBranding } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { getSchoolSlug } from '@/utils/routing';

interface SchoolContextType {
  school: School | null;
  loading: boolean;
  error: string | null;
  updateSchool: (updates: Partial<School>) => Promise<void>;
  updateBranding: (branding: Partial<SchoolBranding>) => Promise<void>;
  checkSlugAvailability: (slug: string) => Promise<boolean>;
  refreshSchool: () => Promise<void>;
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

  const fetchSchool = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const schoolSlug = getSchoolSlug();
    if (!schoolSlug && !user?.schoolId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let schoolData: School | null = null;
      
      if (schoolSlug) {
        // Fetch by slug for public access
        const schools = await sdk.get<School>('schools');
        schoolData = schools.find(s => s.slug === schoolSlug) || null;
      } else if (user?.schoolId) {
        // Fetch by ID for authenticated users
        schoolData = await sdk.getItem<School>('schools', user.schoolId);
      }

      setSchool(schoolData);
    } catch (err) {
      console.error('Failed to fetch school:', err);
      setError('Failed to load school data');
    } finally {
      setLoading(false);
    }
  };

  const updateSchool = async (updates: Partial<School>) => {
    if (!school) return;

    try {
      const updatedSchool = await sdk.update<School>('schools', school.id, updates);
      setSchool(updatedSchool);
    } catch (err) {
      console.error('Failed to update school:', err);
      throw err;
    }
  };

  const updateBranding = async (branding: Partial<SchoolBranding>) => {
    if (!school) return;

    try {
      const currentBranding = school.branding || {};
      const updatedBranding = { ...currentBranding, ...branding };
      const updatedSchool = await sdk.update<School>('schools', school.id, {
        branding: updatedBranding
      });
      setSchool(updatedSchool);
    } catch (err) {
      console.error('Failed to update branding:', err);
      throw err;
    }
  };

  const checkSlugAvailability = async (slug: string): Promise<boolean> => {
    try {
      const schools = await sdk.get<School>('schools');
      return !schools.some(s => s.slug.toLowerCase() === slug.toLowerCase());
    } catch (err) {
      console.error('Failed to check slug availability:', err);
      return false;
    }
  };

  const refreshSchool = async () => {
    await fetchSchool();
  };

  useEffect(() => {
    fetchSchool();
  }, [isAuthenticated, user?.schoolId]);

  const value: SchoolContextType = {
    school,
    loading,
    error,
    updateSchool,
    updateBranding,
    checkSlugAvailability,
    refreshSchool,
  };

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
};
