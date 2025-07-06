
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';

interface School {
  id: string;
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

export const useSchool = () => {
  const { user, isAuthenticated } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchool = async () => {
      if (!isAuthenticated || !user?.schoolId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching school for user:', user.schoolId);
        const schools = await sdk.get<School>('schools');
        const schoolData = schools.find(s => s.id === user.schoolId);
        
        if (schoolData) {
          setSchool(schoolData);
          console.log('School found:', schoolData);
        } else {
          console.log('No school found for user');
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
  }, [isAuthenticated, user?.schoolId]);

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

  return {
    school,
    loading,
    error,
    updateSchool,
    createSchool,
    hasSchool: !!school,
  };
};
