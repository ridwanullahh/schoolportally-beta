
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';

interface School {
  id: string;
  uid: string;
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
        const schoolData = await sdk.getItem<School>('schools', user.schoolId);
        setSchool(schoolData);
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
      const updatedSchool = await sdk.update<School>('schools', school.id, updates);
      setSchool(updatedSchool);
      return updatedSchool;
    } catch (err) {
      console.error('Failed to update school:', err);
      throw err;
    }
  };

  const createSchool = async (schoolData: Omit<School, 'id' | 'uid'>) => {
    try {
      const newSchool = await sdk.insert<School>('schools', {
        ...schoolData,
        ownerId: user?.id || '',
      });
      
      // Update user with schoolId
      if (user) {
        await sdk.update('users', user.id!, { schoolId: newSchool.id });
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
