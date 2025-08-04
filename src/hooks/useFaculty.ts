import { useState, useEffect } from 'react';
import { useSchool } from './useSchool';
import sdk from '@/lib/sdk-config';

export interface FacultyMember {
  id: string;
  uid?: string;
  schoolId: string;
  name: string;
  title: string;
  department: string;
  subject?: string;
  bio?: string;
  image?: string;
  email?: string;
  phone?: string;
  qualifications?: string[];
  experience?: string;
  specializations?: string[];
  achievements?: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    researchgate?: string;
  };
  officeHours?: string;
  courses?: string[];
  researchInterests?: string[];
  publications?: string[];
  order?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export const useFaculty = () => {
  const { school } = useSchool();
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!school) {
      setFaculty([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = sdk.subscribe<FacultyMember>('faculty', (allFaculty) => {
      const schoolFaculty = allFaculty
        .filter(f => f.schoolId === school.id && f.status === 'active')
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setFaculty(schoolFaculty);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [school]);

  const createFaculty = async (facultyData: Omit<FacultyMember, 'id' | 'uid' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    if (!school) throw new Error('No school context');
    return sdk.insert<FacultyMember>('faculty', {
      ...facultyData,
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateFaculty = async (id: string, updates: Partial<FacultyMember>) => {
    return sdk.update<FacultyMember>('faculty', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteFaculty = async (id: string) => {
    return sdk.delete('faculty', id);
  };

  const getFacultyByDepartment = (department: string) => {
    return faculty.filter(member => member.department === department);
  };

  const getFacultyBySubject = (subject: string) => {
    return faculty.filter(member => member.subject === subject);
  };

  const getFeaturedFaculty = (limit?: number) => {
    const featured = faculty.slice(0, limit || 8);
    return featured;
  };

  const getDepartments = () => {
    const departments = [...new Set(faculty.map(member => member.department))];
    return departments.filter(Boolean);
  };

  const getSubjects = () => {
    const subjects = [...new Set(faculty.map(member => member.subject))];
    return subjects.filter(Boolean);
  };

  return {
    faculty,
    loading,
    error,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    getFacultyByDepartment,
    getFacultyBySubject,
    getFeaturedFaculty,
    getDepartments,
    getSubjects,
  };
};
