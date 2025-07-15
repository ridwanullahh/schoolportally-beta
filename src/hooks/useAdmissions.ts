import { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Admission } from '@/types'; // Assuming Admission type exists in types

export const useAdmissions = () => {
  const { school } = useSchool();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setAdmissions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<Admission>('admissions', (allAdmissions) => {
      const schoolAdmissions = allAdmissions.filter(a => a.schoolId === school.id);
      setAdmissions(schoolAdmissions);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createAdmission = async (admissionData: Omit<Admission, 'id' | 'uid' | 'schoolId'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<Admission>('admissions', { ...admissionData, schoolId: school.id });
  };

  const updateAdmission = async (admissionId: string, updates: Partial<Admission>) => {
    return sdk.update<Admission>('admissions', admissionId, updates);
  };

  const deleteAdmission = async (admissionId: string) => {
    return sdk.delete('admissions', admissionId);
  };

  return {
    admissions,
    loading,
    error,
    createAdmission,
    updateAdmission,
    deleteAdmission,
  };
};