
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import sdk from '@/lib/sdk-config';
import { School } from '@/types';

export const useSchool = () => {
  const { user, isAuthenticated } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.schoolId) {
      setLoading(false);
      setSchool(null);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = sdk.subscribe<School>('schools', (schools) => {
      console.log('Received school updates:', schools);
      const schoolData = schools.find(s => s.id === user.schoolId);
      if (schoolData) {
        setSchool(schoolData);
        console.log('School updated:', schoolData);
      } else {
        setSchool(null);
        console.log('No matching school found after update');
      }
      setLoading(false);
    });

    return () => {
      console.log('Unsubscribing from schools');
      unsubscribe();
    };

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
