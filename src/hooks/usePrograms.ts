import { useState, useEffect } from 'react';
import { useSchool } from './useSchool';
import sdk from '@/lib/sdk-config';

export interface Program {
  id: string;
  uid?: string;
  schoolId: string;
  name: string;
  type: 'academic' | 'extracurricular' | 'sports' | 'arts' | 'technology';
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  capacity: number;
  currentEnrollment: number;
  instructor: string;
  instructorId?: string;
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  location?: string;
  fees?: number;
  requirements?: string[];
  benefits?: string[];
  image?: string;
  gallery?: string[];
  startDate: string;
  endDate?: string;
  applicationDeadline?: string;
  status: 'active' | 'inactive' | 'full' | 'completed';
  featured: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export const usePrograms = () => {
  const { school } = useSchool();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setPrograms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<Program>('programs', (allPrograms) => {
      const schoolPrograms = allPrograms
        .filter(p => p.schoolId === school.id && p.status === 'active')
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setPrograms(schoolPrograms);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createProgram = async (programData: Omit<Program, 'id' | 'uid' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<Program>('programs', {
      ...programData,
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateProgram = async (id: string, updates: Partial<Program>) => {
    return sdk.update<Program>('programs', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteProgram = async (id: string) => {
    return sdk.delete('programs', id);
  };

  const getProgramsByType = (type: string) => {
    return programs.filter(program => program.type === type);
  };

  const getFeaturedPrograms = (limit?: number) => {
    return programs.filter(program => program.featured).slice(0, limit || 6);
  };

  const getAvailablePrograms = () => {
    return programs.filter(program => program.currentEnrollment < program.capacity);
  };

  const getProgramTypes = () => {
    const types = [...new Set(programs.map(program => program.type))];
    return types.filter(Boolean);
  };

  return {
    programs,
    loading,
    error,
    createProgram,
    updateProgram,
    deleteProgram,
    getProgramsByType,
    getFeaturedPrograms,
    getAvailablePrograms,
    getProgramTypes,
  };
};
