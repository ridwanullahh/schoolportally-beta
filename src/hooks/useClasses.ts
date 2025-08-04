import { useState, useEffect } from 'react';
import { useSchool } from './useSchool';
import sdk from '@/lib/sdk-config';

export interface ClassItem {
  id: string;
  uid?: string;
  schoolId: string;
  name: string;
  grade: string;
  section?: string;
  capacity: number;
  currentEnrollment: number;
  teacher: string;
  teacherId?: string;
  subjects: string[];
  schedule: {
    [key: string]: {
      startTime: string;
      endTime: string;
      subject: string;
    }[];
  };
  room?: string;
  description?: string;
  image?: string;
  academicYear: string;
  fees?: number;
  requirements?: string[];
  status: 'active' | 'inactive' | 'full';
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export const useClasses = () => {
  const { school } = useSchool();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setClasses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<ClassItem>('classes', (allClasses) => {
      const schoolClasses = allClasses
        .filter(c => c.schoolId === school.id && c.status === 'active')
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setClasses(schoolClasses);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createClass = async (classData: Omit<ClassItem, 'id' | 'uid' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<ClassItem>('classes', {
      ...classData,
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateClass = async (id: string, updates: Partial<ClassItem>) => {
    return sdk.update<ClassItem>('classes', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteClass = async (id: string) => {
    return sdk.delete('classes', id);
  };

  const getClassesByGrade = (grade: string) => {
    return classes.filter(cls => cls.grade === grade);
  };

  const getClassesByTeacher = (teacherId: string) => {
    return classes.filter(cls => cls.teacherId === teacherId);
  };

  const getFeaturedClasses = (limit?: number) => {
    return classes.slice(0, limit || 6);
  };

  const getGrades = () => {
    const grades = [...new Set(classes.map(cls => cls.grade))];
    return grades.filter(Boolean).sort();
  };

  const getAvailableClasses = () => {
    return classes.filter(cls => cls.currentEnrollment < cls.capacity);
  };

  return {
    classes,
    loading,
    error,
    createClass,
    updateClass,
    deleteClass,
    getClassesByGrade,
    getClassesByTeacher,
    getFeaturedClasses,
    getGrades,
    getAvailableClasses,
  };
};
